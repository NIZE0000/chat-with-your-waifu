FROM continuumio/anaconda

WORKDIR /server

COPY requirements.txt .

COPY . server

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

ENV FLASK_APP=server.py

# Start the Flask application
CMD ["flask", "run", "--host=0.0.0.0"]