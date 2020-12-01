# Securely install npm dependencies
FROM node:10-alpine AS dependencies

ARG NPM_RC
ENV NODE_ENV="production"

WORKDIR /home/node/app/

COPY .npmrc ./
COPY package*.json ./

RUN echo ${NPM_RC} > ~/.npmrc && \
    npm install --only=production && \
    rm -f ~/.npmrc

# Build final image
FROM node:10-alpine

ENV CONFIG_PATH="/data/etc/config.json"
ENV NODE_ENV="production"

WORKDIR /home/node/app/

COPY --from=dependencies /home/node/app/ ./
COPY ./ ./

EXPOSE 3000

CMD node ./server/server.js
