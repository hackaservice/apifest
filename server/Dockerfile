FROM ubuntu:14.10

MAINTAINER "hack-a-service"

ENV REFRESHED_AT 2015-06-05

ENV NODE_VERSION 0.12.4

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

RUN apt-get -yqq update && apt-get -yqq upgrade
RUN apt-get install -yqq --no-install-recommends \
    apt-transport-https \
    build-essential \
    ca-certificates \
    curl \
    git \
    libssl-dev \
    python \
    rsync \
    software-properties-common \
    wget \
    gcc

RUN useradd -ms /bin/bash docker

USER docker
WORKDIR /home/docker

RUN mkdir -p /home/docker/source

# Install nvm with node and npm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash \
    && source ~/.nvm/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default \
    && npm install -g --verbose node-gyp gulp pm2

COPY package.json /home/docker/package.json
RUN source ~/.nvm/nvm.sh \
    && npm install --verbose

ENV NODE_PATH ~/.nvm/v$NODE_VERSION/lib/node_modules
ENV PATH      ~/.nvm/v$NODE_VERSION/bin:$PATH
