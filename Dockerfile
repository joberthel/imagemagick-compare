FROM alpine:3.14.2

RUN apk add --no-cache --virtual .build-deps \
    && apk add --no-cache \
        python3 \
        pkgconfig \
        make \
        g++ \
        imagemagick imagemagick-dev \
        nodejs \
        npm \
        git \
    && apk del .build-deps
