# Dockerfile for React front end
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci
COPY . .
RUN npm run build

# Bundle stage
FROM nginx:1.23.0-alpine as production
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/build /usr/share/nginx/html
# Add nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
