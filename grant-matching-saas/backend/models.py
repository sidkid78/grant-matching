from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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