import uuid
from datetime import datetime
from werkzeug.security import check_password_hash
from backend.extensions import db


# ==============================
# Base class
# ==============================
class BaseModel(db.Model):
    __abstract__ = True

    Id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    Date_Create = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    Date_Update = db.Column(db.DateTime, nullable=True, onupdate=datetime.utcnow)
    Active = db.Column(db.Boolean, nullable=False, default=True)

    def serialize(self):
        """Serialize all columns automatically."""
        return {
            c.name: str(getattr(self, c.name))
            for c in self.__table__.columns
        }


# ==============================
# User Table
# ==============================
class User(BaseModel):
    __tablename__ = "Users"

    Email = db.Column(db.String(255), unique=True, nullable=False)
    Password_Hash = db.Column(db.String(255), nullable=False)
    Name = db.Column(db.String(100), nullable=False)
    Type = db.Column(db.String(50), nullable=False, default="admin")  
    # admin / user

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.Password_Hash, password)


# ==============================
# Governorate
# ==============================
class Governorate(BaseModel):
    __tablename__ = "Governorates"

    Name = db.Column(db.String(100), nullable=False, unique=True)

    # One Governorate = Many Regions
    Regions = db.relationship(
        "Region", 
        backref="Governorate", 
        lazy=True,
        cascade="all, delete"
    )


# ==============================
# Region
# ==============================
class Region(BaseModel):
    __tablename__ = "Regions"

    Name = db.Column(db.String(200), nullable=False)

    Governorate_Id = db.Column(
        db.String(36),
        db.ForeignKey("Governorates.Id"),
        nullable=False
    )

    # One Region = Many Client Messages
    Client_Messages = db.relationship(
        "Client_Message",
        backref="Region",
        lazy=True,
        cascade="all, delete"
    )

    def __repr__(self):
        return f"<Region {self.Name} - Governorate ID {self.Governorate_Id}>"


# ==============================
# Client Messages
# ==============================
class Client_Message(BaseModel):
    __tablename__ = "Clients_Messages"

    Full_Name = db.Column(db.String(100), nullable=False)
    Phone_Number = db.Column(db.String(20), unique=True, nullable=False)

    Region_Id = db.Column(
        db.String(36),
        db.ForeignKey("Regions.Id"),
        nullable=False
    )

    Email = db.Column(db.String(100), nullable=False)
    House_Number = db.Column(db.String(50), nullable=False)
    Message = db.Column(db.Text, nullable=True)
