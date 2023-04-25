# build frontend
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

# COPY ./requirements.txt /app/requirements.txt
# RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt
RUN pip install openai

COPY ./app /app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8005"]