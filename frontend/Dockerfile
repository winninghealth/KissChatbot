#FROM node:alpine AS prd
# build front-end
FROM node:lts-alpine AS frontend

WORKDIR /app
COPY ./ /app

COPY package.json .
RUN npm install

COPY public ./public
COPY src ./src

RUN npm run build

# Web service
FROM nginx:alpine
COPY --from=frontend /app/build /usr/share/nginx/html
 

