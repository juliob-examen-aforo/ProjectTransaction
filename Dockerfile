FROM node:12-alpine
ENV NACOS_ENV="config-service-test"
ENV NACOS_SERVERADDR="143.244.222.245:8848"
ENV NACOS_NAMESPACE="config-service-test"
ENV NACOS_IDENTITYKEY="nacos"
ENV NACOS_IDENTITYVALUE="nacos"
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package.json ./
USER node
RUN npm install
RUN npm i node-fetch@2.6.9
COPY --chown=node:node . .
EXPOSE 80
CMD [ "node", "app.js" ]