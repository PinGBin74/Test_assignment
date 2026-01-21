FROM node:20-alpine

WORKDIR /app

COPY ../package*.json ../package-lock.json ./

RUN npm ci && npm cache clean --force

COPY ../src/ ./src/
COPY ../tsconfig.json ./
COPY ../nest-cli.json ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
