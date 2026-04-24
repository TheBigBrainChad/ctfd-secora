from flask import Flask, request, render_template_string
import re

app = Flask(__name__)

def is_safe(user_input):
    blacklist = ['os', 'eval', 'exec', 'bind', 'connect', 'python', 'socket', 'ls', 'cat', 'shell']
    for word in blacklist:
        if word in user_input.lower():
            return False, f"L-kalima '{word}' mamnou3a!"

    regex_filter = r'0x[0-9A-Fa-f]+|\\u[0-9A-Fa-f]{4}|%[0-9A-Fa-f]{2}|\.[A-Za-z0-9]{1,3}\b|[\\\/]|\.\.'
    if re.search(regex_filter, user_input):
        return False, "Dakchi li derti fih l-choubouhat (Filtered)!"

    return True, ""

@app.route('/', methods=['GET', 'POST'])
def index():
    result = ""
    error = ""
    calc_input = ""

    if request.method == 'POST':
        calc_input = request.form.get('expression', '')
        safe, msg = is_safe(calc_input)
        
        if safe:
            try:
                result = eval(calc_input)
            except Exception as e:
                error = f"Khata2: {e}"
        else:
            error = msg

    # ENIAD Styled UI
    html = """
    <!DOCTYPE html>
    <html lang="ar">
    <head>
        <meta charset="UTF-8">
        <title>ENIAD Calculator</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e; color: #e9ecef; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .container { background-color: #16213e; padding: 2rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 450px; border: 1px solid #0f3460; }
            h2 { color: #e94560; text-align: center; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px; }
            p { font-size: 0.9rem; color: #95a5a6; text-align: center; }
            input[type="text"] { width: 100%; padding: 12px; margin: 15px 0; border: none; border-radius: 5px; background: #0f3460; color: white; box-sizing: border-box; font-size: 1.1rem; }
            input[type="submit"] { width: 100%; padding: 12px; border: none; border-radius: 5px; background-color: #e94560; color: white; cursor: pointer; font-weight: bold; transition: 0.3s; }
            input[type="submit"]:hover { background-color: #c62841; }
            .res-box { margin-top: 20px; padding: 15px; border-radius: 5px; text-align: center; font-weight: bold; }
            .success { background-color: rgba(46, 204, 113, 0.2); color: #2ecc71; border: 1px solid #2ecc71; }
            .error { background-color: rgba(231, 76, 60, 0.2); color: #e74c3c; border: 1px solid #e74c3c; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>ENIAD CALC v2.0</h2>
            <p>Dkhel l-hissab dial l-credit hna (mital: 5000 * 0.05):</p>
            <form method="POST">
                <input type="text" name="expression" placeholder="7seb hna..." value="{{ calc_input }}">
                <input type="submit" value="7seb l-Kharij">
            </form>
            
            {% if result %}
                <div class="res-box success">Natija: {{ result }}</div>
            {% endif %}
            
            {% if error %}
                <div class="res-box error">{{ error }}</div>
            {% endif %}
        </div>
    </body>
    </html>
    """
    return render_template_string(html, result=result, error=error, calc_input=calc_input)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
