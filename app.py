import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database import db
from config import Config

def create_app():
    app = Flask(__name__)
    
    # 1. Load Configuration
    app.config.from_object(Config)
    
    # 2. Initialize Extensions
    CORS(app)
    JWTManager(app)
    db.init_app(app) # This is the ONLY place this is called to avoid registration errors
    
    # 3. Ensure Upload Folder Exists
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
        
    with app.app_context():
        # Import models here to ensure they are registered with the DB
        import models
        db.create_all() # Automatically creates data.db if it doesn't exist

    # 4. Register Blueprints
    from auth import bp as auth_bp
    from posts import bp as posts_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(posts_bp)
    
    return app

# Initialize the app object
app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)