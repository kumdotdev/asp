FROM nginx as base
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./public /usr/share/nginx/html
