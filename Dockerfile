FROM cypress/browsers:node16.5.0-chrome94-ff93
RUN mkdir -p /usr/src/app
ADD package*.json /usr/src/app/
ADD index.js /usr/src/app/
WORKDIR /usr/src/app
RUN npm install
ARG APP_VERSION
ENV APP_VERSION $APP_VERSION
ENV NODE_ENV "production"
ENV PORT 9442
CMD npm start
