from celery import Celery
from app import app, check_new_matches_and_deadlines

celery = Celery(app.name, broker='redis://localhost:6379/0')
celery.conf.update(app.config)

@celery.task
def check_matches_and_deadlines_task():
    with app.app_context():
        check_new_matches_and_deadlines()