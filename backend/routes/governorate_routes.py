from flask import Blueprint, request, jsonify
from backend.repositories.public_repository import PublicRepository
from backend.models.public_models import Governorate

governorate_bp = Blueprint("governorate", __name__, url_prefix="/api/governorates")
from flask_jwt_extended import jwt_required

repo = PublicRepository(Governorate)


# ================================
# CREATE
# ================================
@governorate_bp.post("/")
@jwt_required()
def create_governorate():
    data = request.json or {}
    try:
        obj = repo.create(**data)
        return jsonify(obj.serialize()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ================================
# LIST + FILTERS
# ================================
@governorate_bp.get("/")
def list_governorates():

    filters = request.args.to_dict()  # read query params

    objects = repo.get_all(filters if filters else None)

    return jsonify([obj.serialize() for obj in objects]), 200


# ================================
# GET BY ID
# ================================
@governorate_bp.get("/<string:obj_id>")
def get_governorate(obj_id):
    obj = repo.get_by_id(obj_id)
    if not obj:
        return jsonify({"error": "Not found"}), 404
    return jsonify(obj.serialize()), 200


# ================================
# UPDATE
# ================================
@governorate_bp.put("/<string:obj_id>")
@jwt_required()
def update_governorate(obj_id):
    data = request.json or {}
    obj = repo.update(obj_id, **data)
    if not obj:
        return jsonify({"error": "Not found"}), 404

    return jsonify(obj.serialize()), 200


# ================================
# DELETE
# ================================
@governorate_bp.delete("/<string:obj_id>")
@jwt_required()
def delete_governorate(obj_id):
    deleted = repo.delete(obj_id, soft=True)
    if not deleted:
        return jsonify({"error": "Not found"}), 404

    return jsonify({"message": "Deleted successfully"}), 200
