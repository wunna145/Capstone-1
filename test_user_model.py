import os
from unittest import TestCase
from sqlalchemy import exc

from models import db, User, Comment

os.environ['DATABASE_URL'] = "postgresql:///metacity-test"

from app import app

with app.app_context():  
    db.create_all()


class UserModelTestCase(TestCase):

    def setUp(self):
        with app.app_context():  
            db.drop_all()
            db.create_all()

            u1 = User.signup("test1", "email1@email.com", "password")
            uid1 = 1111
            u1.id = uid1

            u2 = User.signup("test2", "email2@email.com", "password")
            uid2 = 2222
            u2.id = uid2

            db.session.commit()

            u1 = User.query.get(uid1)
            u2 = User.query.get(uid2)

            self.u1 = u1
            self.uid1 = uid1

            self.u2 = u2
            self.uid2 = uid2

            self.client = app.test_client()

    def tearDown(self):
        with app.app_context():  
            res = super().tearDown()
            db.session.rollback()
            return res


    def test_user_model(self):
        with app.app_context():  
            u = User(
                email="test@test.com",
                username="testuser",
                password="HASHED_PASSWORD"
            )

            db.session.add(u)
            db.session.commit()

            self.assertEqual(len(u.comments), 0)

    def test_valid_signup(self):
        with app.app_context():  
            u_test = User.signup("testtesttest", "testtest@test.com", "password")
            uid = 99999
            u_test.id = uid
            db.session.commit()

            u_test = User.query.get(uid)
            self.assertIsNotNone(u_test)
            self.assertEqual(u_test.username, "testtesttest")
            self.assertEqual(u_test.email, "testtest@test.com")
            self.assertNotEqual(u_test.password, "password")

            self.assertTrue(u_test.password.startswith("$2b$"))

    def test_invalid_username_signup(self):
        with app.app_context():  
            invalid = User.signup(None, "test@test.com", "password")
            uid = 123456789
            invalid.id = uid
            with self.assertRaises(exc.IntegrityError) as context:
                db.session.commit()

    def test_invalid_email_signup(self):
        with app.app_context():  
            invalid = User.signup("testtest", None, "password")
            uid = 123789
            invalid.id = uid
            with self.assertRaises(exc.IntegrityError) as context:
                db.session.commit()
    
    def test_invalid_password_signup(self):
        with app.app_context():  
            with self.assertRaises(ValueError) as context:
                User.signup("testtest", "email@email.com", "")
            
            with self.assertRaises(ValueError) as context:
                User.signup("testtest", "email@email.com", None)

    def test_valid_authentication(self):
        with app.app_context():  
            u = User.authenticate(self.u1.username, "password")
            self.assertIsNotNone(u)
            self.assertEqual(u.id, self.uid1)
    
    def test_invalid_username(self):
        with app.app_context():  
            self.assertFalse(User.authenticate("badusername", "password"))

    def test_wrong_password(self):
        with app.app_context():  
            self.assertFalse(User.authenticate(self.u1.username, "badpassword"))




        




        

