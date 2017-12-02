FROM node:8.7

MAINTAINER TranHuyTiep

# Create app directory
RUN mkdir -p /src/app
WORKDIR /src/app

# Install NPM
COPY package.json src/app
RUN npm install

# Bundle app source
COPY . /src/app

# Install and run Bower
#RUN npm install -g bower
#RUN bower install

EXPOSE 3000:3000

CMD ["npm","start"]
