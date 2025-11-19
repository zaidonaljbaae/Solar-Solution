import secrets

def generate_key():
    return secrets.token_hex(64)

secret_key = generate_key()
jwt_secret_key = generate_key()

with open("backend/.env", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.startswith("SECRET_KEY="):
        new_lines.append(f"SECRET_KEY={secret_key}\n")
    elif line.startswith("JWT_SECRET_KEY="):
        new_lines.append(f"JWT_SECRET_KEY={jwt_secret_key}\n")
    else:
        new_lines.append(line)

with open("backend/.env", "w") as f:
    f.writelines(new_lines)

