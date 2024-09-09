from flask import Blueprint, flash
from flask_login import login_required, current_user
from flask import  flash, redirect, url_for, request
from flask_login import current_user,  login_required
from functools import wraps
from flask import render_template
from flask import  request, jsonify
from .models import UserAction, ACCESS, Lesson, UserAction, User
from .auth import session
from . import db
from datetime import datetime

views = Blueprint('views', __name__)

### custom wrap to determine access level ###
def requires_access_level(access_level):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated: #the user is not logged in
                return redirect(url_for('login'))
            #user = User.query.filter_by(id=current_user.id).first()
            if not current_user.allowed(access_level):
                flash('You do not have access to this resource.', 'Error')
                return redirect(url_for('auth.login'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator


@views.route('/', methods=['GET'])
def home():
    return render_template("index.html")


@views.route('/lessons', methods=['GET'])
@login_required
def lesson():
    lessons = Lesson.query.limit(2).all()
    return render_template("lessons.html", lessons=lessons)


@views.route('/admin')
@requires_access_level(ACCESS['admin']) 
@login_required
def admin_dashboard():
    users = db.session.query(User).all()
    lessons = db.session.query(Lesson).all()
    return render_template('admin.html', users=users, lessons=lessons)


@views.route('/admin/user/<user_id>')
@requires_access_level(ACCESS['admin']) 
@login_required
def admin_user(user_id):
    user = db.session.query(User).filter_by(id=user_id)[0]
    #to get the lessons that user contribute in 
    #ChatGPT wrote this code not me :> 
    # Query to get all UserActions for the specific user_id
    user_actions = db.session.query(UserAction).filter_by(user_id=user_id).all()
    # Extract lesson_ids from the user actions
    lesson_ids = [action.lesson_id for action in user_actions]
    # Query to get all lessons that match the lesson_ids
    lessons = db.session.query(Lesson).filter(Lesson.id.in_(lesson_ids)).all()
    return render_template('admin_user.html', user= user, lessons= lessons)

@views.route('/admin/lesson/<lesson_id>')
@requires_access_level(ACCESS['admin']) 
@login_required
def admin_lessons(lesson_id):
    #find THE lesson
    lesson = db.session.query(Lesson).filter_by(id=lesson_id)[0]
    #find the actions the belong to THAT lesson
    #added the join to show the name of the user in table not only its id 
    user_actions = db.session.query(UserAction, User).join(User, UserAction.user_id == User.id).filter(UserAction.lesson_id == lesson_id).all()
    print(user_actions)
    title = f"سجلات الأحداث  {lesson.name}"
    return render_template('actions.html', user_actions= user_actions, title=title)


@views.route('/admin/<user_id>/<lesson_id>')
@requires_access_level(ACCESS['admin']) 
@login_required
def admin_user_lesson(user_id,lesson_id):
    #find the user
    user = db.session.query(User).filter_by(id=user_id).first() 
    lesson = db.session.query(Lesson).filter_by(id=lesson_id).first()
    user_actions = db.session.query(UserAction, User).join(User, UserAction.user_id == User.id).filter(UserAction.user_id == user_id, UserAction.lesson_id == lesson_id).all() 
    title = f"سجلات الأحداث {lesson.name} للمستخدم {user.first_name} {user.last_name}"
    return render_template('actions.html' ,user_actions= user_actions, title=title)



@views.route('/submit', methods=['POST'])
@login_required
def submit():
    print("here")
    data = request.get_json()
    print(request.get_json())
    print(data)
    lesson_id = data.get('lesson_id')
    action_id = data.get('action_id')
    time_clicked_str = data.get('time_clicked')
    print(lesson_id)
    time_clicked = datetime.strptime(time_clicked_str, '%Y-%m-%dT%H:%M:%S.%fZ')
    user_id = current_user.id
    session_id = session.get('session_id')
    user_action = UserAction(user_id=user_id, session_id=session_id, lesson_id=lesson_id, action_id=action_id, time_clicked=time_clicked)
    db.session.add(user_action)
    db.session.commit()
    # Return a response
    return jsonify({'status': 'success', 'lesson_id': lesson_id, 'action_id': action_id, 'time_clicked': time_clicked})

@views.route('/lessons/<item_id>')
@login_required
def show_lessons(item_id):
    # Fetch the lesson from the database based on item_id
    lesson = Lesson.query.get(item_id)
    return render_template('show_lesson.html', lesson=lesson)

