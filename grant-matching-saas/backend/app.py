from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename 
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime, timedelta
import os
import random
from dotenv import load_dotenv
from sam_api_service import SAMAPIService 

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

key_vault_name = os.environ.get("KEY_VAULT_NAME")
key_vault_uri = f"https://{key_vault_name}.vault.azure.net/"
credential = DefaultAzureCredential()
secret_client = SecretClient(vault_url=key_vault_uri, credential=credential)

sam_api_key = secret_client.get_secret("SAM-API-KEY").value 

sam_api_service = SAMAPIService(api_key=sam_api_key)

connect_str = os.environ.get("AZURE_STORAGE_CONNECTION_STRING")
blob_service_client = BlobServiceClient.from_connection_string(connect_str)
container_name = "grant-documents"

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///grants.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Use environment variable
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    company_name = db.Column(db.String(255))
    uei_code = db.Column(db.String(50))
    naics_code = db.Column(db.String(10))
    employee_count = db.Column(db.Integer)

class Grant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    agency = db.Column(db.String(100), nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    funding_amount = db.Column(db.String(100), nullable=False)

# Routes
@app.route('/api/upload-document', methods=['POST'])
@jwt_required()
def upload_document():
    try:
        file = request.files['file']
        if file:
            filename = secure_filename(file.filename)
            blob_client = blob_service_client.get_blob_client(container=container_name, blob=filename)
            blob_client.upload_blob(file)
            return jsonify({"message": "File uploaded successfully", 
                            "url": blob_client.url}), 200
        else:
            return jsonify({"message": "No file provided"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500



@app.route('/api/login', methods=['POST'])
def login():
    try:
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        
        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400
        
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            access_token = create_access_token(identity=email)
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({"message": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/api/register', methods=['POST'])
def register():
    try:
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        
        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email already registered"}), 400
        
        new_user = User(email=email, password=generate_password_hash(password))
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/api/grants', methods=['GET'])
@jwt_required()
def get_all_grants():
    try:
        keyword = request.args.get('keyword')
        agency = request.args.get('agency')
        posted_date_start = datetime.now() - timedelta(days=30)  # Last 30 days
        posted_date_end = datetime.now()

        grants = sam_api_service.search_grants(
            keyword=keyword,
            agency=agency,
            posted_date_start=posted_date_start,
            posted_date_end=posted_date_end
        )

        return jsonify(grants)
    except Exception as e:
        return jsonify({"message": str(e)}), 500
       

@app.route('/api/grants/matches', methods=['GET'])
@jwt_required()
def get_matched_grants():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()

        # Fetch grants based on user's profile
        grants = sam_api_service.search_grants(
            keyword=user.naics_code,
            posted_date_start=datetime.now() - timedelta(days=30),
            posted_date_end=datetime.now()
        )

        # Simple matching algorithm (can be improved)
        matched_grants = []
        for grant in grants:
            match_score = 0
            if user.naics_code and user.naics_code in grant['description']:
                match_score += 50
            if user.employee_count and grant['funding_amount']:
                if int(grant['funding_amount']) > user.employee_count * 1000:  # Arbitrary threshold
                    match_score += 50

            if match_score > 0:
                grant['match_score'] = match_score
                matched_grants.append(grant)

        return jsonify(matched_grants)
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/api/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()

        if request.method == 'GET':
            return jsonify({
                "email": user.email,
                "company_name": user.company_name,
                "uei_code": user.uei_code,
                "naics_code": user.naics_code,
                "employee_count": user.employee_count
            })
        elif request.method == 'PUT':
            data = request.json
            user.company_name = data.get('company_name', user.company_name)
            user.uei_code = data.get('uei_code', user.uei_code)
            user.naics_code = data.get('naics_code', user.naics_code)
            user.employee_count = data.get('employee_count', user.employee_count)
            db.session.commit()
            return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)