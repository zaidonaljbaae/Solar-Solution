# libraries
from flask import Blueprint, render_template, request, redirect, url_for, render_template_string, jsonify
from app import db
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional, Dict, Any, List, Tuple
# flask libraries
from flask_parameter_validation import ValidateParameters, Query, Route, Json
# services
from app.services import ClientMessageService, GovernorateService, RegionService

main = Blueprint('main', __name__)

governorates_service = GovernorateService()

@main.route('/')
def index():
    return render_template("pages/base.html")

@main.route('/login')
def login():
    return render_template("pages/login.html")

@main.route('/controle_service')
def controle():
    return render_template("pages/controle_service.html")
@main.route('/add-message', methods=['POST'])
@ValidateParameters()
def add_client_message(full_name: str = Json(), email: Optional[str] = Json(),
                       phone: str = Json(), message: str = Json(), 
                       region_id: int = Json(), house_number: str = Json(),
                       ):
    try:
        client_message = ClientMessageService().add_message(full_name, email, phone, house_number, message, region_id)
        return jsonify(client_message), 201 
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    
@main.route('/get-client-messages', methods=['GET'])
@ValidateParameters()
def get_client_messages(region_id: str = Query()):
    try:
        client_messages = ClientMessageService().get_client_messages_by_region(region_id)
    
        result = []
        for msg, region_name, governorate_name in client_messages:
            d = msg.serialize()
            d["region_name"] = region_name
            d["governorate_name"] = governorate_name
            result.append(d)
    
        return jsonify(result)
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

@main.route('/get-all-client-messages', methods=['GET'])
def get_all_client_messages():
    try:
        client_messages = ClientMessageService().get_all_client_messages()
        
        result = []
        for msg, region_name, governorate_name in client_messages:
            d = msg.serialize()
            d["region_name"] = region_name
            d["governorate_name"] = governorate_name
            result.append(d)
        
        return jsonify(result)
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    
@main.route('/delete-client-message/<int:message_id>', methods=['DELETE'])
@ValidateParameters()
def delete_client_message(message_id: int):
    try:
        response = ClientMessageService().delete_client_message(message_id)
        return jsonify(response), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    
@main.route('/update-client-message/<int:message_id>', methods=['PUT'])
@ValidateParameters()
def update_client_message(message_id: int, full_name: str = Json(), email: Optional[str] = Json(),
                          phone: str = Json(), message: str = Json(), 
                          region_id: int = Json(), house_number: str = Json()):
    try:
        response = ClientMessageService().update_client_message(
            message_id, full_name, email, phone, house_number, message, region_id
        )
        return jsonify(response), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

@main.route('/add-governorate', methods=['POST'])
@ValidateParameters()
def add_governorate(name: str = Json()):
    try:
        service = GovernorateService()
        governorate = service.add_governorate(name)
        return jsonify(governorate), 201
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

@main.route('/get-all-governorates', methods=['GET'])
@ValidateParameters()
def get_governorates_by_region():
    try:
        governorates = governorates_service.get_all_governorates()
        return jsonify([gov.serialize() for gov in governorates])
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

@main.route('/delete-governorate/<int:governorate_id>', methods=['DELETE'])
@ValidateParameters()
def delete_governorate(governorate_id: int):
    try:
        response = GovernorateService().delete_governorate(governorate_id)
        return jsonify(response), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    
@main.route('/update-governorate/<int:governorate_id>', methods=['PUT'])
@ValidateParameters()
def update_governorate(governorate_id: int, name: str = Json()):
    try:
        response = GovernorateService().update_governorate(governorate_id, name)
        return jsonify(response), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

@main.route('/add-region', methods=['POST'])
@ValidateParameters()
def add_region(name: str = Json(), governorate_id: int = Json()):
    try:
        service = RegionService()
        region = service.add_region(name, governorate_id)
        return jsonify(region), 201
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    
@main.route('/get-regions-by-governorate/<int:governorate_id>', methods=['GET'])
@ValidateParameters()
def get_regions_by_governorate(governorate_id: int):
    try:
        regions = RegionService().get_regions_by_governorate(governorate_id)
        return jsonify([region.serialize() for region in regions])
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    
@main.route('/delete-region/<int:region_id>', methods=['DELETE'])
@ValidateParameters()
def delete_region(region_id: int):
    try:
        response = RegionService().delete_region(region_id)
        return jsonify(response), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    
@main.route('/update-region/<int:region_id>', methods=['PUT'])
@ValidateParameters()
def update_region(region_id: int, name: str = Json(), governorate_id: int = Json()):
    try:
        response = RegionService().update_region(region_id, name, governorate_id)
        return jsonify(response), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    
