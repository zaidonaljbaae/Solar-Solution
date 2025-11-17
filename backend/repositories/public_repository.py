from backend.app import db
from sqlalchemy.exc import SQLAlchemyError
from typing import Type, List, Optional, Dict
from sqlalchemy import or_, and_


class PublicRepository:

    def __init__(self, model: Type[db.Model]):
        self.model = model

    # ============================================
    # CREATE
    # ============================================
    def create(self, **data):
        try:
            obj = self.model(**data)
            db.session.add(obj)
            db.session.commit()
            return obj
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    # ============================================
    # READ ALL with filters
    # ============================================
    def get_all(self, filters: Dict = None) -> List[db.Model]:

        query = self.model.query

        if not filters:
            if hasattr(self.model, "Active"):
                query = query.filter(self.model.Active == True)
            return query.order_by(self.model.Date_Create.desc()).all()

        for field, value in filters.items():

            if hasattr(self.model, field):
                column = getattr(self.model, field)
                query = query.filter(column == value)

        return query.order_by(self.model.Date_Create.desc()).all()

    # ============================================
    # READ BY ID
    # ============================================
    def get_by_id(self, obj_id: str):
        return self.model.query.get(obj_id)

    # ============================================
    # UPDATE
    # ============================================
    def update(self, obj_id: str, **data):
        obj = self.get_by_id(obj_id)

        if not obj:
            return None

        try:
            for field, value in data.items():
                if hasattr(obj, field):
                    setattr(obj, field, value)

            db.session.commit()
            return obj

        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    # ============================================
    # DELETE
    # ============================================
    def delete(self, obj_id: str, soft: bool = True) -> bool:
        obj = self.get_by_id(obj_id)

        if not obj:
            return False

        try:
            if soft and hasattr(obj, "Active"):
                obj.Active = False
            else:
                db.session.delete(obj)
            db.session.commit()
            return True

        except SQLAlchemyError as e:
            db.session.rollback()
            raise e
