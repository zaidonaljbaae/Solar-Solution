from app import db
import uuid
from datetime import datetime

class Client_Message(db.Model):
    __tablename__ = 'Clients_Messages'

    Id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    Date_Create = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    Date_Update = db.Column(db.DateTime, nullable=True, onupdate=datetime.utcnow)
    Active = db.Column(db.Boolean, nullable=False, default=True)
    Full_Name = db.Column(db.String(100), nullable=False)
    Phone_Number = db.Column(db.String(20), unique=True, nullable=False)
    
    Region_Id = db.Column(db.String(36), db.ForeignKey('Regions.Id'), nullable=False)
    Region = db.relationship('Region', backref='Clients_Messages', lazy=True)
    
    Email = db.Column(db.String(100), nullable=False)
    House_Number = db.Column(db.String(50), nullable=False)
    Message = db.Column(db.Text, nullable=True)

    def __init__(self):
        super().__init__()

    def serialize(self):
        return {
            c.name: str(getattr(self, c.name))
            for c in self.__table__.columns
        }
    
class Governorate(db.Model):
    __tablename__ = 'Governorates'

    Id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    Date_Create = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    Date_Update = db.Column(db.DateTime, nullable=True, onupdate=datetime.utcnow)
    Active = db.Column(db.Boolean, nullable=False, default=True)
    Name = db.Column(db.String(100), nullable=False, unique=True)

    Regions = db.relationship('Region', backref='Governorate', lazy=True)

    def __init__(self, name):
        self.Name = name
    
    def serialize(self):
        return {
            c.name: str(getattr(self, c.name))
            for c in self.__table__.columns
        }
    
class Region(db.Model):
    __tablename__ = 'Regions'

    Id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    Date_Create = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    Date_Update = db.Column(db.DateTime, nullable=True, onupdate=datetime.utcnow)
    Active = db.Column(db.Boolean, nullable=False, default=True)

    Name = db.Column(db.String(200), nullable=False)

    Governorate_Id = db.Column(db.String(36), db.ForeignKey('Governorates.Id'), nullable=False)

    def __repr__(self):
        return f"<Region {self.name} - Governorate ID {self.Governorate_Id}>"
    
    def serialize(self):
        return {
            c.name: str(getattr(self, c.name))
            for c in self.__table__.columns
        }