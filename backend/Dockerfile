FROM rasa/rasa:3.6.21-full

WORKDIR /app

COPY . /app

USER root

RUN pip install -r requirements.txt

USER 1001

EXPOSE 5005

CMD ["rasa", "run", "--enable-api", "--cors", "*", "--port", "5005"]