FROM node:20-alpine  as builder

WORKDIR /app 

COPY package.json .

RUN npm install

COPY . .

# ENV BACKEND_URL='http://127.0.0.1:53912'

RUN npm run build

COPY src /app/dist/src

FROM nginx:1.19-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD [ "nginx", "-g", "daemon off;" ]



# COPY src /app/dist/src

# EXPOSE 8080

# CMD ["npm", "run", "preview"]



# FROM nginx:1.19-alpine

# COPY --from=builder /app/build /usr/share/nginx/html

# COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD [ "nginx", "-g", "daemon off;" ]

