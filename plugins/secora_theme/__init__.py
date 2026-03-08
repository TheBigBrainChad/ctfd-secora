from flask import render_template

def load(app):
    @app.route("/", methods=["GET"])
    def secora_index():
        return render_template("index.html")
