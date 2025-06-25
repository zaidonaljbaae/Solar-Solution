from typing import List, Type, Any, Dict, Tuple
from sqlalchemy.exc import SQLAlchemyError
from app import db
from sqlalchemy.orm import aliased

from app.models import Client_Message, Region, Governorate

class Repository:    
    def __init__(self, model: Type[db.Model]):
        self.model = model

    def add_item(self, item: db.Model) -> Tuple[dict, int]:
        try:
            db.session.add(item)
            db.session.commit()
            return {"message": "Item added successfully", "item": item.Id}, 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    def add_items(self, items: List[db.Model]) -> Tuple[dict, int]:
        try:
            db.session.add_all(items)
            db.session.commit()
            return {"message": f"{len(items)} items added successfully"}, 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    def list_active_items(self):
        try:
            return self.model.query.filter_by(Active=True).all()
        except SQLAlchemyError as e:
            return {"error": str(e)}, 500

    def list_by_attributes(self, **kwargs):
        try:
            return self.model.query.filter_by(**kwargs).all()
        except SQLAlchemyError as e:
            return {"error": str(e)}, 500

    def update_item(self, id: str, data: Dict[str, Any]) -> Tuple[dict, int]:
        try:
            item = self.model.query.get(id)
            if not item:
                return {"error": "Item not found"}, 404
            for key, value in data.items():
                if hasattr(item, key):
                    setattr(item, key, value)
            db.session.commit()
            return {"message": "Item updated", "item": item.Id}, 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    def delete_item(self, id: str) -> Tuple[dict, int]:
        try:
            item = self.model.query.get(id)
            if not item:
                return {"error": "Item not found"}, 404
            item.Active = False
            db.session.commit()
            return {"message": "has been deleted", "item": item.Name}
        except SQLAlchemyError as e:
            db.session.rollback()
            return {"error": str(e)}, 500

class GovernorateRepository(Repository):
    def __init__(self):
        super().__init__(model=Governorate)

class RegionRepository (Repository):
    def __init__(self):
        super().__init__(model=Region)

    def get_region_by_governorates(self, governorate_id: str):
        try:
            return (
                db.session.query(db.Region)
                .join(db.Governorate, db.Region.Id == db.Governorate.Region_Id)
                .filter(db.Governorate.Id == governorate_id, db.Region.Active == True)
                .all()
            )
        except SQLAlchemyError as e:
            raise e
class ClientMessageRepository(Repository):
    def __init__(self):
        super().__init__(Client_Message)

    def get_all_client_messages(self):
        try:
            region_alias = aliased(Region)
            governorate_alias = aliased(Governorate)

            messages = (
                db.session.query(
                    Client_Message,
                    region_alias.Name.label("region_name"),
                    governorate_alias.Name.label("governorate_name"),
                )
                .join(region_alias, Client_Message.Region_Id == region_alias.Id)
                .join(governorate_alias, region_alias.Governorate_Id == governorate_alias.Id)
                .filter(Client_Message.Active == True)
                .all()
            )
            return messages
        except SQLAlchemyError as e:
            raise e
        
    def get_client_messages_by_region(self, region_id: str):
        try:
            region_alias = aliased(Region)
            governorate_alias = aliased(Governorate)

            messages = (
                db.session.query(
                    Client_Message,
                    region_alias.Name.label("region_name"),
                    governorate_alias.Name.label("governorate_name"),
                )
                .join(region_alias, Client_Message.Region_Id == region_alias.Id)
                .join(governorate_alias, region_alias.Governorate_Id == governorate_alias.Id)
                .filter(Client_Message.Active == True, region_alias.Id == region_id)
                .all()
            )
            return messages
        except SQLAlchemyError as e:
            raise e