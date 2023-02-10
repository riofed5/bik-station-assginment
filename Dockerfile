FROM node:alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY --from=builder /app/dist ./
EXPOSE 7000
CMD sh -c "while ! nc -z mysql_server 3306; do sleep 1; done && node server.js"
