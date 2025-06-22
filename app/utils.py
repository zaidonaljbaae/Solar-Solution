import os
import re
from langdetect import detect
from app.models import Submission
from app import db

try:
    with open("instance/arabic_words.txt", "r", encoding="utf-8") as f:
        arabic_words = set(f.read().splitlines())
except FileNotFoundError:
    print("Error: 'arabic_words.txt' file not found.")
    arabic_words = set()

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
    real_word_count = sum(1 for word in words_list if is_real_word(word, language))

    real_ratio = real_word_count / len(words_list) if words_list else 0

    return "Real Message" if real_ratio >= 0.6 else "Fake Message"

def validate_submission(full_name, phone_number, query):
    if not re.match(r'^[\u0600-\u06FFa-zA-Z\s]{2,}$', full_name):
        return False, "الاسم غير صالح."

    if not re.match(r'^09\d{8}$', phone_number):
        return False, "رقم الهاتف غير صالح."

    if len(query.split()) < 3 or not re.match(r'^[\u0600-\u06FFa-zA-Z\s,.\?]+$', query):
        return False, "السؤال لا يبدو كاستفسار صالح."

    existing_submission = db.session.query(Submission).filter_by(phone_number=phone_number).first()
    if existing_submission and existing_submission.full_name != full_name:
        return False, "هذا الرقم مرتبط باسم مختلف."

    if classify_text(query) == "Fake Message":
        return False, "السؤال لا يبدو كاستفسار صالح."

    return True, ""
