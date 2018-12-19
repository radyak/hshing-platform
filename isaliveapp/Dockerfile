#ARG BASE_IMAGE=node:8
ARG BASE_IMAGE=arm32v7/node

FROM ${BASE_IMAGE}

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

EXPOSE 3001
CMD [ "npm", "start" ]
