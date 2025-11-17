import os

class Config:
    # SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    # print(SQLALCHEMY_DATABASE_URI)
    SQLALCHEMY_DATABASE_URI = "postgresql://solar_solution_data_base_user:J0gdZ0VLfu4sjk4iwJAAYPLtN1zbcJgZ@dpg-d4d4qr0gjchc73dovr30-a.oregon-postgres.render.com/solar_solution_data_base"
    
    # Fix postgres:// → postgresql://
    if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)

    # Use SQLite if no DATABASE_URL
    if not SQLALCHEMY_DATABASE_URI:
        SQLALCHEMY_DATABASE_URI = "sqlite:///local.db"
        print("Using fallback SQLite database")

    SQLALCHEMY_TRACK_MODIFICATIONS = False