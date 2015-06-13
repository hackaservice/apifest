#!/usr/bin/env bash

source ~/.nvm/nvm.sh
nvm use stable

pm2 --no-daemon start server.js