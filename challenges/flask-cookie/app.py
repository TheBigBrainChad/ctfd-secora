from flask import Flask, session, render_template_string

app = Flask(__name__)
# The secret key you generated: ninho!
app.config['SECRET_KEY'] = 'theninho!' 

# Combined HTML with Tailwind CSS for a sleek, dark-mode look
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureVault - Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #0f172a; }
        .glass { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
    </style>
</head>
<body class="text-slate-200 font-sans min-h-screen flex items-center justify-center">

    <div class="max-w-md w-full p-8 rounded-2xl glass shadow-2xl">
        <div class="flex flex-col items-center mb-8">
            <div class="p-4 bg-indigo-600 rounded-full mb-4 shadow-lg shadow-indigo-500/50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h1 class="text-3xl font-bold text-white tracking-tight">SecureVault <span class="text-indigo-400">v2.0</span></h1>
            <p class="text-slate-400 text-sm">Internal Personnel Dashboard</p>
        </div>

        <div class="space-y-6">
            <div class="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p class="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">Current Authorization</p>
                <p class="text-xl font-mono {% if role == 'admin' %}text-green-400{% else %}text-amber-400{% endif %}">
                    {{ role.upper() }}
                </p>
            </div>

            <div class="min-h-[100px] flex items-center justify-center border-t border-slate-700 pt-6">
                {% if role == 'admin' %}
                    <div class="text-center animate-bounce">
                        <p class="text-sm text-slate-400 mb-2">System Clearance Granted:</p>
                        <div class="bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded-md font-bold text-lg">
                            Secora{n1nh0_1s_th3_b3st_53cur1ty_3ng1n33r}
                        </div>
                    </div>
                {% else %}
                    <div class="text-center">
                        <p class="text-slate-500 italic">"Restricted: Administrative privileges required to view sensitive flag data."</p>
                    </div>
                {% endif %}
            </div>
        </div>

        <div class="mt-8 text-center">
            <a href="/logout" class="text-xs text-slate-600 hover:text-indigo-400 transition-colors uppercase tracking-widest">Terminate Session</a>
        </div>
    </div>

</body>
</html>
"""

@app.route('/')
def index():
    if 'role' not in session:
        session['role'] = 'user'
    return render_template_string(HTML_TEMPLATE, role=session.get('role', 'guest'))

@app.route('/logout')
def logout():
    session.clear()
    return "Session Cleared. <a href='/'>Go back</a>"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)