FROM node:10-alpine AS dependencies
ENV NODE_ENV="production"
WORKDIR /home/node/app/

COPY package*.json ./
COPY node_modules ./node_modules

FROM node:10-alpine
ENV CONFIG_PATH="/data/etc/config.json"
ENV NODE_ENV="production"
WORKDIR /home/node/app/

# kopiujemy to, co przygotowaliśmy w pierwszym etapie (package.json + node_modules)
COPY --from=dependencies /home/node/app/ ./

# kopiujemy cały kod aplikacji + zbudowany katalog .next
COPY ./ ./

EXPOSE 3000

CMD node ./server/server.js
