from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Post, User
from utils import allowed_file, save_image

bp = Blueprint("posts", __name__, url_prefix="/posts")

@bp.route("/uploads/<f>")
def upl(f): 
    """Serves uploaded images from the upload folder."""
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], f)

@bp.route("/", methods=["GET"])
def all():
    """Fetches all posts with support for search and category filtering."""
    page = request.args.get('page', 1, type=int)
    search_query = request.args.get('q', '', type=str)
    status_filter = request.args.get('status', '', type=str)
    category_filter = request.args.get('category', '', type=str)

    per_page = 10 
    query = Post.query

    if status_filter in ['lost', 'found']:
        query = query.filter(Post.status == status_filter)
    if category_filter:
        query = query.filter(Post.category == category_filter)
    if search_query:
        search = f"%{search_query}%"
        query = query.filter((Post.title.ilike(search)) | (Post.description.ilike(search)))

    pagination = query.order_by(Post.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    posts_data = []
    for p in pagination.items:
        posts_data.append({
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "category": p.category,
            "status": p.status,
            "date": p.date.isoformat(),
            "phone": p.phone_number,
            "image": f"http://localhost:5000/posts/uploads/{p.image_filename}" if p.image_filename else None,
            "reporter": p.reporter.username
        })
        
    return jsonify({
        "posts": posts_data,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": page,
        "has_next": pagination.has_next,
        "has_prev": pagination.has_prev
    })

@bp.route("/", methods=["POST"])
@jwt_required()
def create():
    """Creates a new post and handles image uploads."""
    uid = get_jwt_identity()
    u = User.query.get(int(uid))
    title = request.form.get("title")
    status = request.form.get("status")
    phone = request.form.get("phone_number")
    category = request.form.get("category")
    
    if not(title and status and phone and category): 
        return jsonify({"msg": "missing data"}), 400
    
    desc = request.form.get("description")
    img = None
    if "image" in request.files:
        f = request.files["image"]
        if f.filename and allowed_file(f.filename):
            img = save_image(f, current_app.config["UPLOAD_FOLDER"], f"user{uid}")
            
    p = Post(title=title, description=desc, category=category, status=status, phone_number=phone, image_filename=img, reporter=u)
    db.session.add(p)
    db.session.commit()
    return jsonify({"msg": "created", "id": p.id})

@bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_post(id):
    """Updates a post or deletes it if the status is set to 'claimed'."""
    uid = get_jwt_identity()
    user = User.query.get(int(uid))
    post = Post.query.get_or_404(id)
    
    # Check permissions: only owner or admin can update/delete
    if post.reporter_id != user.id and not user.is_admin: 
        return jsonify({"msg": "Permission denied"}), 403
    
    # Handle both JSON (from test_backend.py) and Form Data (from main.js)
    data = request.get_json() if request.is_json else request.form
    new_status = data.get("status", "").lower().strip()

    # CORE LOGIC: Deletes post if status is 'claimed'
    if new_status == "claimed":
        db.session.delete(post)
        db.session.commit()
        return jsonify({"msg": "Item claimed and report deleted"})

    # Standard update for other fields
    post.title = data.get("title", post.title)
    post.description = data.get("description", post.description)
    post.category = data.get("category", post.category)
    if new_status in ["lost", "found"]: 
        post.status = new_status
    post.phone_number = data.get("phone_number", post.phone_number)
    
    if "image" in request.files:
        f = request.files["image"]
        if f.filename and allowed_file(f.filename):
             post.image_filename = save_image(f, current_app.config["UPLOAD_FOLDER"], f"user{uid}")
    
    db.session.commit()
    return jsonify({"msg": "updated"})

@bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_post(id):
    """Explicit delete route primarily for admin use."""
    uid = get_jwt_identity()
    user = User.query.get(int(uid))
    post = Post.query.get_or_404(id)
    
    if post.reporter_id != user.id and not user.is_admin:
        return jsonify({"msg": "Permission denied"}), 403
        
    db.session.delete(post)
    db.session.commit()
    return jsonify({"msg": "Post deleted successfully"})