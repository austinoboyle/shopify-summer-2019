FROM node:8.12.0-alpine
LABEL Author="Austin O'Boyle <14arob@queensu.ca>"

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json /opt/app
RUN yarn --production
COPY . /opt/app
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# run
EXPOSE 4000
CMD ["yarn", "start"]
