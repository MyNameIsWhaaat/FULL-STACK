FROM node
workdir /app
copy package.json .
copy controllers/ ./controllers
copy index.js .
copy modules/ ./modules
copy package-lock.json .
copy untils/ ./untils
copy uploads/ ./uploads
copy validation.js .
run npm install
entrypoint ["npm", "run", "start:dev"]
