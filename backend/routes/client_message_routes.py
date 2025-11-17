from flask import Blueprint, request, jsonify
from backend.repositories.public_repository import PublicRepository
from backend.models.public_models import Client_Message

client_message_bp = Blueprint("client_messages", __name__, url_prefix="/api/client-messages")

repo = PublicRepository(Client_Message)


@client_message_bp.post("/")
def create_client_message():
    data = request.json or {}
    try:
        obj = repo.create(**data)
        return jsonify(obj.serialize()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@client_message_bp.get("/")
def list_client_messages():
    filters = request.args.to_dict()
    objects = repo.get_all(filters if filters else None)
    return jsonify([obj.serialize() for obj in objects]), 200


@client_message_bp.get("/<string:obj_id>")
def get_client_message(obj_id):
    obj = repo.get_by_id(obj_id)
    if not obj:
        return jsonify({"error": "Not found"}), 404
    return jsonify(obj.serialize()), 200


@client_message_bp.put("/<string:obj_id>")
def update_client_message(obj_id):
    data = request.json or {}
    obj = repo.update(obj_id, **data)
    if not obj:
        return jsonify({"error": "Not found"}), 404
    return jsonify(obj.serialize()), 200


@client_message_bp.delete("/<string:obj_id>")
def delete_client_message(obj_id):
    deleted = repo.delete(obj_id, soft=True)
    if not deleted:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"message": "Deleted successfully"}), 200
