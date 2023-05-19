# Mutlistage dockerize dpgraham.com react.js front end
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm ci --silent
RUN npm run build

# local development
FROM builder as local
WORKDIR /app
EXPOSE 3000
RUN npm install
CMD ["npm", "start"]

# Bundle stage
FROM nginx:1.24.0-alpine as production
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/build /usr/share/nginx/html
# Add nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
