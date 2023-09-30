import os
from unittest import TestCase
from sqlalchemy import exc

from models import db, User, Comment

os.environ['DATABASE_URL'] = "postgresql:///metacity-test"

from app import app

with app.app_context():
    db.create_all()


class CommentModelTestCase(TestCase):

    def setUp(self):
        with app.app_context():
            db.drop_all()
            db.create_all()

            self.uid = 94566
            u = User.signup("testing", "testing@test.com", "password")
            u.id = self.uid
            db.session.commit()

            self.u = User.query.get(self.uid)

            self.client = app.test_client()

    def tearDown(self):
        with app.app_context():
            res = super().tearDown()
            db.session.rollback()
            return res

    def test_comment_model(self):

        with app.app_context():
            
            self.hero_id = 3
            cm = Comment(
                text="a hero",
                user_id=self.uid,
                heroId = self.hero_id
            )

            db.session.add(cm)
            db.session.commit()

            self.u = User.query.get(self.uid)

            self.assertEqual(len(self.u.comments), 1)
            self.assertEqual(self.u.comments[0].text, "a hero")


        