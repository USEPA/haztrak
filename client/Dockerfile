# Mutlistage dockerize dpgraham.com react.js front end
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm ci --silent
RUN npm run build


# test
FROM builder as test
WORKDIR /app
CMD ["npm", "run", "test"]

# local development
FROM builder as dev
WORKDIR /app
EXPOSE 3000
CMD ["npm", "start"]

# Production
FROM nginx:1.24.0-alpine as production
WORKDIR /app
ENV NODE_ENV production
# copy build from builder stage
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
