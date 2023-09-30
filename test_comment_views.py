"""Message View tests."""

# run these tests like:
#
#    FLASK_ENV=production python -m unittest test_message_views.py


import os
from unittest import TestCase

from models import db, connect_db, Comment, User

os.environ['DATABASE_URL'] = "postgresql:///metacity-test"

from app import app, CURR_USER_KEY

with app.app_context():
    db.create_all()

app.config['WTF_CSRF_ENABLED'] = False


class MessageViewTestCase(TestCase):

    def setUp(self):

        with app.app_context():
            db.drop_all()
            db.create_all()

            self.client = app.test_client()

            self.testuser = User.signup(username="testuser",
                                        email="test@test.com",
                                        password="testuser"
                                        )
            self.testuser_id = 8989
            self.testuser.id = self.testuser_id

            db.session.commit()

    def test_add_comment(self):

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser_id

            resp = c.post("/heroes/3/comment", data={"text": "Hello"})

            self.assertEqual(resp.status_code, 302)

            cmt = Comment.query.one()
            self.assertEqual(cmt.text, "Hello")

    def test_add_no_session(self):
        with self.client as c:
            resp = c.post("/heroes/3/comment", data={"text": "Hello"}, follow_redirects=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Please login to write a comment", str(resp.data))

    def test_add_invalid_user(self):
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = 99222224

            resp = c.post("/heroes/3/comment", data={"text": "Hello"}, follow_redirects=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Please login to write a comment", str(resp.data))
    
    def test_comment_show(self):
        with app.app_context():
            cmt = Comment(
                id=1234,
                text="a test message",
                heroId = 3,
                user_id=self.testuser_id
            )
            
            db.session.add(cmt)
            db.session.commit()

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = self.testuser_id
                
                cmt = Comment.query.get(1234)

                resp = c.get('/heroes/3')

                self.assertEqual(resp.status_code, 200)
                self.assertIn(cmt.text, str(resp.data))

    def test_invalid_comment_show(self):
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser_id
            
            resp = c.get('/messages/99999999')

            self.assertEqual(resp.status_code, 404)

    def test_comment_delete(self):
        with app.app_context():
            cmt = Comment(
                id=1234,
                text="a test message",
                heroId = 3,
                user_id=self.testuser_id
            )
            db.session.add(cmt)
            db.session.commit()

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser_id

            resp = c.post("/heroes/3/comment/delete/1234", follow_redirects=True)
            self.assertEqual(resp.status_code, 200)

            cmt = Comment.query.get(1234)
            self.assertIsNone(cmt)

    def test_unauthorized_comment_delete(self):

        with app.app_context():
            u = User.signup(username="unauthorized-user",
                            email="testtest@test.com",
                            password="password")
            u.id = 76543

            cmt = Comment(
                id=1234,
                text="a test message",
                heroId = 3,
                user_id=self.testuser_id
            )
            db.session.add_all([u, cmt])
            db.session.commit()

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = 76543

            resp = c.post("/heroes/3/comment/delete/1222", follow_redirects=True)
            self.assertEqual(resp.status_code, 404)

            cmt = Comment.query.get_or_404(1234)
            self.assertIsNotNone(cmt)

    def test_comment_delete_no_authentication(self):
        with app.app_context():
            cmt = Comment(
                id=1234,
                text="a test message",
                heroId = 3,
                user_id=self.testuser_id
            )
            db.session.add(cmt)
            db.session.commit()

        with self.client as c:
            resp = c.post("/heroes/3/comment/delete/1234", follow_redirects=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Please login to delete a comment", str(resp.data))

            cmt = Comment.query.get(1234)
            self.assertIsNotNone(cmt)
