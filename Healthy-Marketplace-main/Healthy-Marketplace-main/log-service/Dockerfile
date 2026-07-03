# Log service Dockerfile
# Use a lightweight Node 18 image for the log aggregation service.
FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY . ./
# Service listens on port 8090
EXPOSE 8090
CMD ["npm", "start"]
