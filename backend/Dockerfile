FROM continuumio/anaconda

WORKDIR /server

COPY requirements.txt .

COPY . server

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD [ "python server.py"]