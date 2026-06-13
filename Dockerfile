FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY index.html styles.css app.js carbon.js storage.js server.mjs ./

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server.mjs"]
