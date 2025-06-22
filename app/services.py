import json
import os
from typing import List, Tuple
from app.repository import ClientMessageRepository, RegionRepository, GovernorateRepository
from app.models import Client_Message, Region, Governorate

class ClientMessageService:
    def __init__(self):
        self.client_message_repo = ClientMessageRepository()

    def add_message(self, full_name: str, email: str,phone_number: str,
                 house_number: str, message: str, region_id: str,
                ) -> Tuple[dict, int]:
        try:
            client_message = Client_Message(
                Full_Name=full_name,
                Phone_Number=phone_number,
                Region_Id=region_id,
                Email=email,
                House_Number=house_number,
                Message=message
            )
            self.client_message_repo.add_item(client_message)
            return {"message": "Client message added successfully", "item": client_message.Id}, 201
        except Exception as e:
            return {"error": str(e)}, 500

    def get_all_client_messages(self) -> List[Client_Message]:
        return self.client_message_repo.get_all_client_messages()
    
    def get_client_messages_by_region(self, region_id: str) -> List[Tuple[Client_Message, str, str]]:
        try:
            client_messages = self.client_message_repo.get_client_messages_by_region(region_id)
            return [(msg, msg.Region.Name, msg.Region.Governorate.Name) for msg in client_messages]
        except Exception as e:
            return {"error": str(e)}, 500
    
    def delete_client_message(self, message_id: str) -> Tuple[dict, int]:
        try:
            return self.client_message_repo.delete_item(message_id)
        except Exception as e:
            return {"error": str(e)}, 500
        
    def update_client_message(self, message_id: str, full_name: str, email: str,
                             phone_number: str, house_number: str, message: str,
                             region_id: str) -> Tuple[dict, int]:
        try:
            return self.client_message_repo.update_item(message_id, {
                "Full_Name": full_name,
                "Email": email,
                "Phone_Number": phone_number,
                "House_Number": house_number,
                "Message": message,
                "Region_Id": region_id
            })
        except Exception as e:
            return {"error": str(e)}, 500

class GovernorateService:
    def __init__(self):
        self.governorate_repo = GovernorateRepository()

    def add_governorate(self, name):
        try:
            governorate = self.governorate_repo.list_by_attributes(Name = name, Active=True)
            if governorate:
                return {"message": f"Governorate {name} already exists"}, 409
            governorate = Governorate(name=name)
            self.governorate_repo.add_item(governorate)
            return {"message": f"Governorate {name} added successfully"}, 201
        except Exception as e:
            return {"error": str(e)}, 500
        
    def get_all_governorates(self) -> List[Governorate]:
        try:
            print("Fetching all active governorates")
            return self.governorate_repo.list_active_items()
        except Exception as e:
            return {"error": str(e)}, 500
        
    @staticmethod   
    def delete_governorate(self, governorate_id):
        try:
            return self.governorate_repo.delete_item(governorate_id)
        except Exception as e:
            return {"error": str(e)}, 500
    
    def update_governorate(self, governorate_id: str, name: str):
        try:
            return self.governorate_repo.update_item(governorate_id, {"Name": name})
        except Exception as e:
            return {"error": str(e)}, 500

class RegionService:
    def __init__(self):
        self.region_repo = RegionRepository()

    @staticmethod
    def add_region(self, name: str, governorate_id: int):
        try:
            region = Region(Name=name, Governorate_Id=governorate_id)
            self.region_repo.add_item(region)
            return {"message": "Region added successfully", "item": region.Id}, 201
        except Exception as e:
            return {"error": str(e)}, 500

    def get_regions_by_governorate(self, governorate_id: int) -> List[Region]:
        try:
            return self.region_repo.get_region_by_governorates(governorate_id)
        except Exception as e:
            return {"error": str(e)}, 500
    
    def delete_region(self, region_id: str):
        try:
            return self.region_repo.delete_item(region_id)
        except Exception as e:
            return {"error": str(e)}, 500
        
    def update_region(self, region_id: str, name: str, governorate_id: int):
        try:
            return self.region_repo.update_item(region_id, {"Name": name, "Governorate_Id": governorate_id})
        except Exception as e:
            return {"error": str(e)}, 500