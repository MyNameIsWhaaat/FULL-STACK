FROM node
workdir /app
copy package.json .
copy public/ ./public
copy src/ ./src
run npm install
entrypoint ["npm", "start"]

