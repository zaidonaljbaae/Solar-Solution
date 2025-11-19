from flask import Blueprint, request, jsonify
from backend.repositories.public_repository import PublicRepository
from backend.models.public_models import User
from flask_jwt_extended import jwt_required

users_bp = Blueprint("users", __name__, url_prefix="/api/users")

repo = PublicRepository(User)


@users_bp.post("/")
@jwt_required()
def create_user():
    data = request.json or {}
    try:
        obj = repo.create(**data)
        return jsonify(obj.serialize()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@users_bp.get("/")
@jwt_required()
def list_users():
    filters = request.args.to_dict()
    objects = repo.get_all(filters if filters else None)
    return jsonify([obj.serialize() for obj in objects]), 200


@users_bp.get("/<string:obj_id>")
@jwt_required()
def get_user(obj_id):
    obj = repo.get_by_id(obj_id)
    if not obj:
        return jsonify({"error": "Not found"}), 404
    return jsonify(obj.serialize()), 200


@users_bp.put("/<string:obj_id>")
@jwt_required()
def update_user(obj_id):
    data = request.json or {}
    obj = repo.update(obj_id, **data)
    if not obj:
        return jsonify({"error": "Not found"}), 404
    return jsonify(obj.serialize()), 200


@users_bp.delete("/<string:obj_id>")
@jwt_required()
def delete_user(obj_id):
    deleted = repo.delete(obj_id, soft=True)
    if not deleted:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"message": "Deleted successfully"}), 200
