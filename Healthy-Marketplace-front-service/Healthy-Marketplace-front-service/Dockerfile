# Angular frontend Dockerfile
# Build the frontend using Node.js, then serve with Nginx for production.
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine
# Use custom Nginx configuration and deploy static files
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/healthy-marketplace-front /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
