from flask import Flask, render_template, request, make_response, redirect, url_for
import base64

app = Flask(__name__)
app.secret_key = "super_secret_key_for_this_challenge"

# In-memory user store for simplicity
users = {"admin": "admin"} # Initial admin user (but players won't know this)

def encode_cookie(user_id, role, name):
    cookie_str = f"id:{user_id},role:{role},name:{name}"
    return base64.b64encode(cookie_str.encode()).decode()

def decode_cookie(cookie_val):
    try:
        decoded = base64.b64decode(cookie_val).decode()
        # Simple parser for "id:1,role:user,name:name"
        parts = {p.split(":")[0]: p.split(":")[1] for p in decoded.split(",")}
        return parts
    except Exception:
        return None

@app.route("/")
def index():
    user_cookie = request.cookies.get("user_session")
    if user_cookie:
        user_data = decode_cookie(user_cookie)
        if user_data:
            return render_template("index.html", user=user_data)
    return render_template("index.html")

@app.route("/register", methods=["POST"])
def register():
    username = request.form.get("username")
    password = request.form.get("password")
    if username and password:
        users[username] = password
        return redirect(url_for("index", msg="Registered successfully! Please login."))
    return redirect(url_for("index", msg="Registration failed."))

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")
    
    if username in users and users[username] == password:
        # Default role is always user, id is 1
        cookie_val = encode_cookie(1, "user", username)
        resp = make_response(redirect(url_for("index")))
        resp.set_cookie("user_session", cookie_val)
        return resp
    return redirect(url_for("index", msg="Login failed."))

@app.route("/admin")
def admin():
    user_cookie = request.cookies.get("user_session")
    if user_cookie:
        user_data = decode_cookie(user_cookie)
        if user_data and user_data.get("role") == "admin" and user_data.get("id") == "0" and user_data.get("name") == "admin":
            return render_template("admin.html", flag="Secora{C00k13_M4n1pul4t10n_Is_Fun}")
    return "Access Denied. Only admins allowed.", 403

@app.route("/logout")
def logout():
    resp = make_response(redirect(url_for("index")))
    resp.delete_cookie("user_session")
    return resp

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
