import os
from flask import Flask, render_template, request, g, session, flash, redirect
from flask_debugtoolbar import DebugToolbarExtension
from models import User, Comment, db, connect_db
from forms import UserAddForm, LoginForm, CommentForm
from sqlalchemy import inspect
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS

app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
app.config['SQLALCHEMY_DATABASE_URI'] = (os.environ.get('DATABASE_URL', 'postgresql:///metacity'))
toolbar = DebugToolbarExtension(app)

CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5000", "https://metacity.onrender.com"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
    }
})

CURR_USER_KEY = "curr_user"

connect_db(app)
with app.app_context():
     inspector = inspect(db.engine)
     if not inspector.has_table('users'):
        db.create_all()


@app.before_request
def add_user_to_g():

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])

    else:
        g.user = None

def do_login(user):

    session[CURR_USER_KEY] = user.id

def do_logout():

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]

@app.route('/')
def homepage():
    return render_template('home-anon.html')
    
@app.route('/heroes')
def heroes():
    return render_template('/heroes/home-heroes.html', search="")

@app.route('/heroes/<int:hero_id>', methods=["GET", "POST"])
def hero_detail(hero_id):
    comments = (Comment
                .query
                .filter(Comment.heroId == hero_id)
                .order_by(Comment.id.desc())
                .limit(100)
                .all())
    return render_template('/heroes/hero-details.html', id=hero_id, comments=comments)

@app.route('/heroes/search')
def search():
    search = request.args.get('q')
    return render_template('/heroes/home-heroes.html', search=search)

@app.route('/signup', methods=["GET", "POST"])
def signup():
    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]

    form = UserAddForm()

    if form.validate_on_submit():
        try:
            user = User.signup(
                username=form.username.data,
                password=form.password.data,
                email=form.email.data,
            )
            db.session.commit()

        except IntegrityError:
            flash("Username already taken", 'danger')
            return render_template('users/signup.html', form=form)

        do_login(user)

        return redirect("/heroes")

    else:
        return render_template('users/signup.html', form=form)
    
@app.route('/login', methods=["GET", "POST"])
def login():

    form = LoginForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data, form.password.data)

        if user:
            do_login(user)
            return redirect("/heroes")

        flash("Invalid credentials.", 'danger')

    return render_template('users/login.html', form=form)

@app.route('/logout')
def logout():

    do_logout()
    flash("You have successfully logged out.", 'success')
    return redirect("/login")

@app.route('/heroes/<int:hero_id>/comment', methods=["GET", "POST"])
def comment_add(hero_id):

    if not g.user:
        flash("Please login to write a comment.", "danger")
        return redirect("/login")

    form = CommentForm()

    if form.validate_on_submit():
        cmt = Comment(text=form.text.data, heroId=hero_id, user_id = g.user.id)
        db.session.add(cmt)
        db.session.commit()

        return redirect(f"/heroes/{hero_id}")

    return render_template('comments/new.html', form=form)

@app.route('/heroes/<int:hero_id>/comment/delete/<int:cmt_id>', methods=['GET', 'POST'])
def deleteCmt(hero_id, cmt_id):
    if not g.user:
        flash("Please login to delete a comment.", "danger")
        return redirect("/login")

    cmt = Comment.query.get_or_404(cmt_id)
    db.session.delete(cmt)
    db.session.commit()

    return redirect(f'/heroes/{hero_id}')

if __name__ == "__main__":
    app.run(debug=True)
