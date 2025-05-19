# server/Dockerfile
FROM node:23-alpine

WORKDIR /app

# only install production deps
COPY package*.json ./
RUN npm install --production

# copy source
COPY . .

# expose port & run
EXPOSE 3000
CMD ["node", "server.js"]
