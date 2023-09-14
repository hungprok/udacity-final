### Build
# FROM beevelop/ionic:latest AS ionic
FROM node:12 as build-stage
## Create app directory
WORKDIR /app
## Install app dependencies
## A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install
## Bundle app source
COPY . .
RUN npm run build
### Run 
FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/
#COPY www /usr/share/nginx/html
COPY --from=build-stage /app/build /usr/share/nginx/html
