from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from dotenv import load_dotenv
from sqlalchemy import or_, func
import os
from urllib.parse import quote_plus

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mssql+pyodbc:///?odbc_connect={quote_plus(os.getenv('DB_CONNECTION_STRING'))}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    api = Api(app)

    # Import models
    from models import User, Grant, UserGrant, GrantRequirement

    # Resources
    class UserRegister(Resource):
        def post(self):
            data = request.json
            if User.query.filter_by(email=data['email']).first():
                return {"message": "Email already registered"}, 400
            
            new_user = User(
                email=data['email'],
                password=generate_password_hash(data['password']),
                company_name=data.get('company_name'),
                uei_code=data.get('uei_code'),
                naics_code=data.get('naics_code'),
                employee_count=data.get('employee_count')
            )
            db.session.add(new_user)
            db.session.commit()
            return {"message": "User registered successfully"}, 201

    class UserLogin(Resource):
        def post(self):
            data = request.json
            user = User.query.filter_by(email=data['email']).first()
            if user and check_password_hash(user.password, data['password']):
                access_token = create_access_token(identity=user.id)
                return {"access_token": access_token}, 200
            return {"message": "Invalid credentials"}, 401

    class UserProfile(Resource):
        @jwt_required()
        def get(self):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            return {
                'email': user.email,
                'company_name': user.company_name,
                'uei_code': user.uei_code,
                'naics_code': user.naics_code,
                'employee_count': user.employee_count
            }

        @jwt_required()
        def put(self):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            data = request.json
            user.company_name = data.get('company_name', user.company_name)
            user.uei_code = data.get('uei_code', user.uei_code)
            user.naics_code = data.get('naics_code', user.naics_code)
            user.employee_count = data.get('employee_count', user.employee_count)
            db.session.commit()
            return {"message": "Profile updated successfully"}, 200

    class GrantList(Resource):
        @jwt_required()
        def get(self):
            grants = Grant.query.all()
            return [{
                'id': grant.id,
                'title': grant.title,
                'agency': grant.agency,
                'due_date': grant.due_date.isoformat(),
                'funding_amount': grant.funding_amount
            } for grant in grants]

    class GrantDetail(Resource):
        @jwt_required()
        def get(self, grant_id):
            grant = Grant.query.get(grant_id)
            if grant:
                return {
                    'id': grant.id,
                    'title': grant.title,
                    'agency': grant.agency,
                    'due_date': grant.due_date.isoformat(),
                    'funding_amount': grant.funding_amount
                }
            return {"message": "Grant not found"}, 404

    class GrantMatches(Resource):
        @jwt_required()
        def get(self):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            grants = Grant.query.all()
            matched_grants = []
            
            for grant in grants:
                match_score = calculate_match_score(user, grant)
                if match_score > 0:
                    matched_grants.append({
                        'id': grant.id,
                        'title': grant.title,
                        'agency': grant.agency,
                        'due_date': grant.due_date.isoformat(),
                        'funding_amount': grant.funding_amount,
                        'match_score': match_score
                    })
            
            matched_grants.sort(key=lambda x: x['match_score'], reverse=True)
            return matched_grants

    # Add resources to API
    api.add_resource(UserRegister, '/api/register')
    api.add_resource(UserLogin, '/api/login')
    api.add_resource(UserProfile, '/api/profile')
    api.add_resource(GrantList, '/api/grants')
    api.add_resource(GrantDetail, '/api/grants/<int:grant_id>')
    api.add_resource(GrantMatches, '/api/grants/matches')

    return app

@app.route('/api/grants/search', methods=['GET'])
@jwt_required()
def search_grants():
    # Get query parameters
    query = request.args.get('query', '')
    agency = request.args.get('agency', '')
    min_amount = request.args.get('min_amount', type=float)
    max_amount = request.args.get('max_amount', type=float)
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    sort_by = request.args.get('sort_by', 'due_date')
    sort_order = request.args.get('sort_order', 'asc')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    # Build the query
    grants_query = Grant.query

    if query:
        grants_query = grants_query.filter(or_(
            Grant.title.ilike(f'%{query}%'),
            Grant.agency.ilike(f'%{query}%')
        ))

    if agency:
        grants_query = grants_query.filter(Grant.agency == agency)

    if min_amount is not None:
        grants_query = grants_query.filter(func.cast(Grant.funding_amount, db.Float) >= min_amount)

    if max_amount is not None:
        grants_query = grants_query.filter(func.cast(Grant.funding_amount, db.Float) <= max_amount)

    if start_date:
        grants_query = grants_query.filter(Grant.due_date >= start_date)

    if end_date:
        grants_query = grants_query.filter(Grant.due_date <= end_date)

    # Apply sorting
    if sort_by == 'funding_amount':
        sort_column = func.cast(Grant.funding_amount, db.Float)
    else:
        sort_column = getattr(Grant, sort_by)

    if sort_order == 'desc':
        sort_column = sort_column.desc()

    grants_query = grants_query.order_by(sort_column)

    # Paginate results
    paginated_grants = grants_query.paginate(page=page, per_page=per_page, error_out=False)

    # Prepare response
    grants = [{
        'id': grant.id,
        'title': grant.title,
        'agency': grant.agency,
        'due_date': grant.due_date.isoformat(),
        'funding_amount': grant.funding_amount
    } for grant in paginated_grants.items]

    return jsonify({
        'grants': grants,
        'total': paginated_grants.total,
        'pages': paginated_grants.pages,
        'current_page': page
    })

def calculate_match_score(user, grant):
    score = 0
    requirement = GrantRequirement.query.filter_by(grant_id=grant.id).first()
    
    if requirement:
        # NAICS code match
        if user.naics_code and requirement.naics_code:
            if user.naics_code.startswith(requirement.naics_code):
                score += 50
        
        # Employee count match
        if user.employee_count:
            if (not requirement.min_employees or user.employee_count >= requirement.min_employees) and \
               (not requirement.max_employees or user.employee_count <= requirement.max_employees):
                score += 50
    
    return score

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)