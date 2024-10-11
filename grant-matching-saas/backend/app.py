from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
import uuid
import pyodbc

app = Flask(__name__)
CORS(app)

# Azure SQL Server configuration
server = 'skgrantserverdev.database.windows.net'
database = 'skGrantDB'
username = 'Shaun.Koehn'
password = 'Silverbus!730'
driver = '{ODBC Driver 18 for SQL Server}'

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f'mssql+pyodbc://{username}:{password}@{server}/{database}?driver={driver}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this!

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    company_name = db.Column(db.String(120), nullable=True)
    uei_code = db.Column(db.String(20), nullable=True)
    naics_code = db.Column(db.String(10), nullable=True)
    employee_count = db.Column(db.Integer, nullable=True)

class Grant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    agency = db.Column(db.String(100), nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    funding_amount = db.Column(db.String(100), nullable=False)

class UserGrant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    grant_id = db.Column(db.Integer, db.ForeignKey('grant.id'), nullable=False)
    match_score = db.Column(db.Float, nullable=False)

class GrantRequirement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    grant_id = db.Column(db.Integer, db.ForeignKey('grant.id'), nullable=False)
    naics_code = db.Column(db.String(10), nullable=True)
    min_employees = db.Column(db.Integer, nullable=True)
    max_employees = db.Column(db.Integer, nullable=True)

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already registered"}), 400
    
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
    return jsonify({"msg": "User registered successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/api/profile', methods=['GET', 'PUT'])
@jwt_required()
def user_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if request.method == 'GET':
        return jsonify({
            'email': user.email,
            'company_name': user.company_name,
            'uei_code': user.uei_code,
            'naics_code': user.naics_code,
            'employee_count': user.employee_count
        })
    elif request.method == 'PUT':
        data = request.json
        user.company_name = data.get('company_name', user.company_name)
        user.uei_code = data.get('uei_code', user.uei_code)
        user.naics_code = data.get('naics_code', user.naics_code)
        user.employee_count = data.get('employee_count', user.employee_count)
        db.session.commit()
        return jsonify({"msg": "Profile updated successfully"}), 200

@app.route('/api/grants', methods=['GET'])
@jwt_required()
def get_grants():
    grants = Grant.query.all()
    return jsonify([{
        'id': grant.id,
        'title': grant.title,
        'agency': grant.agency,
        'due_date': grant.due_date.isoformat(),
        'funding_amount': grant.funding_amount
    } for grant in grants])

@app.route('/api/grants/<int:grant_id>', methods=['GET'])
@jwt_required()
def get_grant(grant_id):
    grant = Grant.query.get(grant_id)
    if grant:
        return jsonify({
            'id': grant.id,
            'title': grant.title,
            'agency': grant.agency,
            'due_date': grant.due_date.isoformat(),
            'funding_amount': grant.funding_amount
        })
    return jsonify({"error": "Grant not found"}), 404

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

@app.route('/api/grants/matches', methods=['GET'])
@jwt_required()
def get_grant_matches():
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
    return jsonify(matched_grants)

if __name__ == '__main__':
    app.run(debug=True)