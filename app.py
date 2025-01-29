from flask import Flask, render_template, request, jsonify, session
import sqlite3
import uuid

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# تعريف معرف فريد لتشغيل التطبيق
app_instance_id = str(uuid.uuid4())  # يتم تغييره عند كل تشغيل

# إنشاء قاعدة البيانات والجداول عند تشغيل التطبيق لأول مرة
def initialize_database():
    conn = sqlite3.connect('clicks.db')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS click_counts (
            session_id TEXT PRIMARY KEY,
            click_count INTEGER DEFAULT 0
        )
    ''')
    conn.close()
    print("تم التحقق من إنشاء الجدول.")

initialize_database()

# دالة لحفظ عدد النقرات في قاعدة البيانات
def save_click_count(session_id, click_count):
    conn = sqlite3.connect('clicks.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO click_counts (session_id, click_count)
        VALUES (?, ?)
        ON CONFLICT(session_id) DO UPDATE SET click_count = ?
    ''', (session_id, click_count, click_count))
    conn.commit()
    conn.close()
    print(f"تم الحفظ في قاعدة البيانات: session_id={session_id}, click_count={click_count}")

# الصفحة الرئيسية
@app.route('/')
def home():
    # تحقق من إنشاء جلسة جديدة لكل تشغيل جديد
    if 'app_instance_id' not in session or session['app_instance_id'] != app_instance_id:
        session.clear()  # مسح الجلسة السابقة
        session['app_instance_id'] = app_instance_id  # تحديث معرف تشغيل التطبيق
        session['session_id'] = str(uuid.uuid4())  # إنشاء معرف فريد جديد للجلسة
        session['click_count'] = 0
        print(f"جلسة جديدة تم إنشاؤها: {session['session_id']}")

    return render_template('first_page.html')

# مسار لتتبع النقرات
@app.route('/track_click', methods=['POST'])
def track_click():
    print("تم الوصول إلى المسار /track_click")
    # تحقق من الجلسة
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())  # إنشاء معرف جديد للجلسة
        session['click_count'] = 0

    # زيادة عدد النقرات
    session['click_count'] += 1

    # حفظ النقرات في قاعدة البيانات
    save_click_count(session['session_id'], session['click_count'])
    print(f"تم تسجيل النقر: {session['click_count']} للجلسة: {session['session_id']}")

    return jsonify({"click_count": session['click_count']})

# مسار لعرض عدد النقرات المخزنة
@app.route('/view_clicks')
def view_clicks():
    conn = sqlite3.connect('clicks.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM click_counts')
    rows = cursor.fetchall()
    conn.close()

    result_html = "<h1>Click Counts</h1><table border='1'><tr><th>Session ID</th><th>Click Count</th></tr>"
    for row in rows:
        result_html += f"<tr><td>{row[0]}</td><td>{row[1]}</td></tr>"
    result_html += "</table>"

    return result_html

if __name__ == '__main__':
    app.run(debug=True)
