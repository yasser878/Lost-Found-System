from datetime import datetime
from database import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_verified = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)

    def set_password(self, p): self.password_hash = generate_password_hash(p)
    def check_password(self, p): return check_password_hash(self.password_hash, p)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    
    # NEW CATEGORY COLUMN
    category = db.Column(db.String(50), nullable=False, default="Other") 
    
    status = db.Column(db.String(10), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    phone_number = db.Column(db.String(50), nullable=False)
    image_filename = db.Column(db.String(300))
    notes = db.Column(db.Text)
    reporter_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    reporter = db.relationship("User", backref=db.backref("posts", lazy=True))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)