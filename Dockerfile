# https://nodejs.org/de/docs/guides/nodejs-docker-webapp/
# https://docs.docker.com/engine/reference/builder/

FROM node:26-alpine

WORKDIR /usr/src/app

# see https://pkgs.alpinelinux.org
RUN apk --no-cache add linux-headers eudev-dev libusb-dev alsa-lib-dev

# Node 25+ images no longer ship Yarn/Corepack; the classic CLI delegates to the
# release in .yarn/releases (yarnPath)
RUN npm install -g yarn

COPY . .

RUN apk --no-cache --virtual .gyp add python3 make g++ git \
  && yarn \
  && PRODUCTION=true yarn workspaces focus -A --production \
  && yarn cache clean \
  && apk del .gyp \
  && rm -rf .linaria-cache node_modules/.cache frontend/node_modules/.cache

EXPOSE 8000

CMD ["yarn", "start"]
