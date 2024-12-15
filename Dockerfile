FROM node:20.18

WORKDIR /app

COPY package*.json ./


RUN npm install

COPY . .

RUN chmod +x start.sh

EXPOSE 8000

CMD ["./start.sh"]