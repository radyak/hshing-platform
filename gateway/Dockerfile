ARG BASE_IMAGE=arm32v7/node


FROM node:10 AS frontend-build


WORKDIR /usr/src/frontend

COPY ./static/package*.json ./

RUN npm install

COPY ./static ./

RUN npm run build




FROM ${BASE_IMAGE} AS runtime

COPY ./qemu-arm-static /usr/bin/qemu-arm-static

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

#Copy frontend build
COPY --from=frontend-build /usr/src/frontend /usr/src/frontend

EXPOSE 80:80
EXPOSE 443:443

CMD [ "npm", "start" ]
