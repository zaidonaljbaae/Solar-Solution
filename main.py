from datetime import date
from flask import Flask, abort, render_template, redirect, request, url_for, flash, render_template_string
from flask_bootstrap import Bootstrap5
from flask_ckeditor import CKEditor
from flask_login import UserMixin, login_user, LoginManager, current_user, logout_user
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship, DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Text
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import relationship
from langdetect import detect
from nltk.corpus import words
import nltk
import os
import re

app = Flask(__name__)
# Configure the SQLAlchemy database URI and initialize the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'  # SQLite database file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# Define the Submission model
class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), unique=True, nullable=False)
    governorate = db.Column(db.String(100), nullable=False)
    region = db.Column(db.String(100), nullable=False)
    neighborhood = db.Column(db.String(100), nullable=False)
    house_number = db.Column(db.String(50), nullable=False)
    query = db.Column(db.Text, nullable=True)


with app.app_context():
    db.create_all()


try:
    with open("instance/arabic_words.txt", "r", encoding="utf-8") as f:
        arabic_words = set(f.read().splitlines())
except FileNotFoundError:
    print("Error: 'arabic_words.txt' file not found. Please ensure it exists.")
    arabic_words = set()  # Empty set to prevent errors if file is missing


def detect_language(text):
    try:
        return detect(text)
    except Exception as e:
        print(f"Language detection failed: {e}")
        return None


def is_real_word(word, language):
    if language == "ar":
        return word in arabic_words
    return False


def classify_text(text):
    language = detect_language(text)
    if language not in ["ar", "en"]:
        return "Unknown Language"

    words_list = text.split()
    real_word_count = 0

    # Check if each word is real based on language
    for word in words_list:
        if is_real_word(word, language):
            real_word_count += 1

    # Define threshold for fake vs. real
    threshold = 0.6
    real_ratio = real_word_count / len(words_list)

    if real_ratio >= threshold:
        return "Real Message"
    else:
        return "Fake Message"

def validate_submission(full_name, phone_number, query):
    # Check if the name is in Arabic or English and appears valid
    if not re.match(r'^[\u0600-\u06FFa-zA-Z\s]{2,}$', full_name):
        return False, "الاسم غير صالح. يرجى إدخال اسم حقيقي باللغة العربية أو الإنجليزية."

    # Check if the phone number is valid for Syria (starts with '09' and has 10 digits)
    if not re.match(r'^09\d{8}$', phone_number):
        return False, "رقم الهاتف غير صالح. يجب أن يبدأ الرقم السوري بـ '09' ويحتوي على 10 أرقام."

    # Check if the query is a real question (basic check for words and question structure)
    if len(query.split()) < 3 or not re.match(r'^[\u0600-\u06FFa-zA-Z\s,.\?]+$', query):
        return False, "السؤال لا يبدو كاستفسار صالح. يرجى تقديم مزيد من التفاصيل."

    # Check for duplicate phone number with different name
    existing_submission = db.session.query(Submission).filter_by(phone_number=phone_number).first()
    if existing_submission and existing_submission.full_name != full_name:
        return False, "هذا الرقم مرتبط باسم مختلف. تم تجاهل التقديم المكرر."

    # Validate the message content
    message_status = classify_text(query)
    if message_status == "Fake Message":
        return False, "السؤال لا يبدو كاستفسار صالح. يرجى تقديم استفسار صالح."

    return True, ""



@app.route('/')
def index():
    return render_template("index.html", current_user=current_user)


@app.route('/submit', methods=['POST'])
def submit():
    # Retrieve form data
    full_name = request.form['full_name']
    phone_number = request.form['phone_number']
    governorate = request.form['governorate']
    region = request.form['region']
    neighborhood = request.form['neighborhood']
    house_number = request.form['house_number']
    query = request.form['query']
    print(full_name)
    # Validate submission data
    is_valid, message = validate_submission(full_name, phone_number, query)
    if not is_valid:
        return render_template_string("<h1>Submission Ignored</h1><p>{{ message }}</p>", message=message)

    # Save the data to the database if validation passes
    new_submission = Submission(
        full_name=full_name,
        phone_number=phone_number,
        governorate=governorate,
        region=region,
        neighborhood=neighborhood,
        house_number=house_number,
        query=query
    )

    db.session.add(new_submission)
    db.session.commit()
    # Redirect back to the home page
    return redirect(url_for('index'))

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True)