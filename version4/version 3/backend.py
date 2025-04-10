from flask import Flask, render_template, request, redirect, flash, url_for, session, jsonify
import mysql.connector
import hashlib

# Create Flask app
app = Flask(__name__)
app.secret_key = "123456789"  # Secret key for session management

# main route
@app.route("/")
def dash():
    return render_template("dashboard.html")

# signup route
@app.route("/signup")
def signup_page():
    return render_template("signup.html")

#login route
@app.route("/login")
def login_page():
    return render_template("login.html")

#register route
@app.route("/register")
def register_page():
    return render_template("serviceprovider.html")

@app.route("/portfolio")
def portfolio_page():
    return render_template("portfolio.html")

@app.route("/view-more")  # Route matches the JavaScript redirection
def view_more():
    service_id = request.args.get("id")  # Extract ID from URL
    print(f"Service ID received: {service_id}")  # Debugging

    # Connect to database
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM electrical_services WHERE id = %s", (service_id,))
    service = cursor.fetchone()
    cursor.close()
    conn.close()

    if service:
        return render_template("view-more.html", service=service)
    else:
        return "Service not found", 404  # Handle invalid IDs

@app.route("/get_services")
def get_services():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    query = "SELECT * FROM electrical_services"
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query)
    services = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(services)

@app.route("/get_home_services")
def get_home_services():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    query = "SELECT * FROM home_services"  # always Ensure the table name is correct i spent an hour on this😂😂
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query)
    services = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(services)

@app.route("/get_catering_services")
def get_catering_services():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    query = "SELECT * FROM catering_services"  # always Ensure the table name is correct i spent an hour on this😂😂
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query)
    services = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(services)

# Register a new service provider using request.form
@app.route('/register-service-provider', methods=['POST'])
def register_service_provider():
    profile_image = request.form.get('profileimage')
    username = request.form.get('username')
    email = request.form.get('email')
    phone = request.form.get('phone')
    service_category = request.form.get('service_category')
    description = request.form.get('description')
    locations = request.form.get('locations')
    working_hours = request.form.get('working_hours')
    experience = request.form.get('experience')
    service_image = request.form.get('serviceimage')
    projects_completed = request.form.get('projects_completed')
    pricing = request.form.get('pricing')

    # Ensure service category is valid
    table_mapping = {
        "Catering": "catering_services",
        "Electrical": "electrical_services",
        "House": "home_services"
    }
    
    table_name = table_mapping.get(service_category)
    if not table_name:
        flash("Invalid service category", "danger")
        return redirect(url_for('index'))

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = f"""
            INSERT INTO {table_name} 
            (username, email, phone, service_category, description, locations, working_hours, experience, 
            projects_completed, pricing, service_image, profile_image) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (username, email, phone, service_category, description, locations, working_hours,
                              experience, projects_completed, pricing, service_image, profile_image,))
        conn.commit()
        cursor.close()
        conn.close()

        flash("Service provider registered successfully!", "success")
        return render_template("dashboard.html")

    except Exception as e:
        flash(f"Error: {str(e)}", "danger")
        return render_template("dashboard.html")



# Route to process user registration  
@app.route("/signup", methods=["POST"])
def signup():
    username = request.form["username"]
    email = request.form["email"]
    password = request.form["password"]

    add_user(username, email, password)
    return redirect(url_for("success"))  # Redirect to login page

# message for succesiful registration should redirect to login page after registering
@app.route("/success")
def success():
    return "<h1>Registration successful!!</h1>"

# route to login form
@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    if check_credentials(username, password):
        # flash("✅ Login successful!", "success")
        return redirect(url_for("dashboard"))  # Redirect to dashboard
    else:
        # flash("❌ Invalid credentials. Try again.", "error")
        return redirect(url_for("failed"))  # Redirect to login page

# Dashboard (only accessible after login)
@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

# failed login page
@app.route("/failed")
def failed():
    return "<h1>Failed to Login!!</h1>"


# Function to get database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="mally",
            password="1234",
            database="servicehub"
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        return None

# Function to hash passwords using SHA-256
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Function to insert a new user
def add_user(username, email, password):
    conn = get_db_connection()
    if conn is None:
        return "Database connection failed."

    hashed_password = hash_password(password)
    query = "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)"  # Fixed column name
    values = (username, email, hashed_password)

    try:
        cursor = conn.cursor()
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        print("User added successfully! 🎉")
        return True
    except mysql.connector.IntegrityError:
        print("Error: Username or email already exists.")
        return False
# function to  register service_provider
def add_service_provider(username, email, phone, service_category, password):
    conn = get_db_connection()
    if conn is None:
        return "Database connection failed."

    hashed_password = hash_password(password)
    query = "INSERT INTO service_provider (username, email, phone, service_category, password_hash) VALUES (%s, %s, %s, %s, %s)"  # Fixed column name
    values = (username, email, phone, service_category, hashed_password)

    try:
        cursor = conn.cursor()
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        print("User added successfully! 🎉")
        return True
    except mysql.connector.IntegrityError:
        print("Error: Username or email already exists.")
        return False
    
# function to check user credentials
def check_credentials(username, password):
    conn_db = get_db_connection()
    if conn_db is None:
        return "Database connection failed"
    
    hashed_pas = hash_password(password)
    query1 = "SELECT * FROM Users WHERE username = %s AND password_hash = %s"
    values1 = (username,  hashed_pas)

    try:
        cursor = conn_db.cursor()
        cursor.execute(query1, values1)
        conn_db.commit()
        cursor.close()
        conn_db.close()
        print("User succesifully confirmed 🎉")
        return True
    except:
        return cursor.fetchone()

@app.route("/get_service_details")
def get_service_details():
    service_id = request.args.get('id')
    service_type = request.args.get('type')

    if not service_id or not service_type:
        return jsonify({"error": "Missing 'id' or 'type' parameters"}), 400

    valid_types = ['electrical', 'home', 'catering']
    if service_type not in valid_types:
        return jsonify({"error": f"Invalid service type. Must be one of: {', '.join(valid_types)}"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        query = f"SELECT * FROM {service_type}_services WHERE id = %s"
        cursor.execute(query, (service_id,))
        service = cursor.fetchone()
        cursor.close()
        conn.close()

        if service:
            return jsonify(service)
        else:
            return jsonify({"error": "Service not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/get_all_services")
def get_all_services():
    service_type = request.args.get('type', 'electrical')  # Default to 'electrical'
    
    valid_types = ['electrical', 'home', 'catering']
    if service_type not in valid_types:
        return jsonify({"error": f"Invalid service type. Must be one of: {', '.join(valid_types)}"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    query = f"SELECT * FROM {service_type}_services"  # Dynamically select table
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query)
    services = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(services)

# run the app
if __name__ == "__main__":
    app.run(debug=True)