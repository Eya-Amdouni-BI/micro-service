# Delivery service Dockerfile
# Build a lightweight Node.js container for the delivery microservice.
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

# Expose delivery API port
EXPOSE 3000

CMD ["npm", "start"]
