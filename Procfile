web: gunicorn backend.wsgi
worker: celery -A core worker -l info
beat: celery -A core beat -l info