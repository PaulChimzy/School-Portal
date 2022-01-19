from flask import current_app, Flask, url_for, render_template, request, redirect, flash
from flaskext.mysql import MySQL
import pymysql.cursors
import os
from decouple import config 

webApp = Flask(__name__)
webApp.secret_key = config('SECRET_KEY')

webApp.config['MYSQL_DATABASE_HOST'] = config('DB_HOST')
webApp.config['MYSQL_DATABASE_DB'] = config('DB_NAME')
webApp.config['MYSQL_DATABASE_USER'] = config('DB_USER')
webApp.config['MYSQL_DATABASE_PASSWORD'] = config('DB_PASSWORD')


mysql = MySQL(webApp, cursorclass = pymysql.cursors.DictCursor)



@webApp.route('/')
def home():
    return render_template('Home.html')

@webApp.route('/about')
def About_us():
    return render_template('About.html')

@webApp.route('/registration')
def Registration():
    return render_template('Registration.html')

@webApp.route('/profile', methods=['GET', 'POST'])
def Profile():

    user_email = request.form["Email"]
    user_jamb_score = int(request.form["jamb_score"])
    conn = mysql.get_db()
    cursor = conn.cursor()

    cursor.execute('select Email from registeredStudents where Email=%s', user_email)
    registeredEmails = cursor.fetchall()

    if (len(registeredEmails) > 0) :
        flash("You have already been registered or perhaps this email has previously been used for registeration", "flash_error")
        return redirect('/registration')
    else:
        if (user_jamb_score < 230):
            student_status = "Rejected"
        elif (230 < user_jamb_score < 280):
            student_status = "Pending"
        else :
            student_status = 'Admitted'
        

        image = request.files['profile-pics']
        filepath = os.path.join(current_app.root_path, 'static/images/profile/' + request.form['firstname'] + "_" + request.form['lastname'] + '.png')
        image.save(filepath)

        cursor.execute('insert into registeredStudents(firstname, middlename, lastname, Email, DOB, gender, address, city, state, telephone, kin_name,\
            state_of_origin, local_government, jamb_score, Department, profile_image, student_status) values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', \
            (request.form['firstname'], request.form['middlename'], request.form['lastname'], request.form['Email'], request.form['DOB'], request.form['gender'],\
            request.form['address'], request.form['city'], request.form['state'], request.form['telephone'], request.form['kinname'], request.form['state_of_origin'],\
            request.form['local_government'], request.form['jamb_score'], request.form['Department'], filepath, student_status))
        
        cursor.execute('Select * from registeredStudents')
        allStudentData = cursor.fetchall()
        recentStudentData = allStudentData[len(allStudentData) - 1] 
        conn.commit()
        cursor.close

        return render_template('Profile.html', user_response=recentStudentData)

@webApp.route('/dashboard')
def Dashboard():

    conn = mysql.get_db()
    cursor = conn.cursor()
    cursor.execute('Select student_id, firstname, lastname, gender, Email, jamb_score, student_status from registeredStudents')
    requiredInfo = cursor.fetchall()

    return render_template('Dashboard.html', studentData = requiredInfo)

@webApp.route('/student/<id>/profile')
def Profile_name(id):
    student_id = id
    conn = mysql.get_db()
    cursor = conn.cursor()
    cursor.execute('Select * from registeredStudents where student_id=%s', (student_id))
    selectedUser = cursor.fetchall()

    return render_template('Profile.html', user_response=selectedUser[0])

if __name__ == "__main__":
    webApp.run(debug=True)