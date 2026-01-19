from flask import Flask, render_template, request, redirect, url_for, session, send_file
import sqlite3
import pandas as pd
import io

app = Flask(__name__)
app.secret_key = 'mi_llave_secreta_muy_segura' # Esto permite manejar sesiones

def conectar_db():
    return sqlite3.connect('clientes.db')

# Asegurar tabla
with conectar_db() as conn:
    conn.execute('''CREATE TABLE IF NOT EXISTS Clientes 
                    (id INTEGER PRIMARY KEY AUTOINCREMENT, empresa TEXT, contacto TEXT, telefono TEXT, correo TEXT)''')

@app.route('/')
def inicio():
    return render_template('index.html')

@app.route('/enviar', methods=['POST'])
def enviar():
    with conectar_db() as conn:
        conn.execute("INSERT INTO Clientes (empresa, contacto, telefono, correo) VALUES (?, ?, ?, ?)",
                     (request.form['empresa'], request.form['contacto'], request.form['telefono'], request.form['correo']))
    return render_template('index.html', enviado=True)

# --- NUEVA RUTA DE LOGIN ---
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        # Aquí defines tu usuario y contraseña
        if request.form['username'] == 'admin' and request.form['password'] == '1234':
            session['logeado'] = True
            return redirect(url_for('admin'))
        else:
            error = 'Usuario o contraseña incorrectos'
    return render_template('login.html', error=error)

@app.route('/admin')
def admin():
    if not session.get('logeado'):
        return redirect(url_for('login'))
    
    with conectar_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Clientes")
        datos = cursor.fetchall()
    return render_template('admin.html', clientes=datos)

@app.route('/logout')
def logout():
    session.pop('logeado', None)
    return redirect(url_for('login'))

@app.route('/descargar')
def descargar():
    if not session.get('logeado'): return redirect(url_for('login'))
    with conectar_db() as conn:
        df = pd.read_sql_query("SELECT * FROM Clientes", conn)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)
    output.seek(0)
    return send_file(output, download_name="clientes.xlsx", as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)