FROM alpine

ARG UID=1000
ARG GID=1000

RUN apk add --no-cache nodejs yarn && \
  addgroup -S -g "$UID" app && \
  adduser -S -u "$UID" -G app app

WORKDIR /home/app/src

USER app
