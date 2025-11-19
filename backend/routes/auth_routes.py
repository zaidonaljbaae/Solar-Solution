from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from backend.models.public_models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/login")
def login():
    data = request.json or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email e senha são obrigatórios"}), 400

    user = User.query.filter_by(Email=email).first()

    print('user found:', user.Id)
    # if not user:
    #     return jsonify({"error": "Usuário não encontrado"}), 404

    # if not check_password_hash(user.Password, password):
    #     return jsonify({"error": "Senha incorreta"}), 401

    token = create_access_token(identity=user.Id)

    return jsonify({
        "message": "Login realizado com sucesso",
        "token": token,
        "user_id": user.Id
    })
