# Använd officiell Node.js-bild
FROM node:23-slim

# Sätt arbetskatalogen i containern
WORKDIR /app

# Kopiera package-filer och installera beroenden
COPY package*.json ./
RUN npm install

# Kopiera resten av koden
COPY . .

# Exponera port som appen kör på
EXPOSE 4001

# Starta applikationen
CMD ["npm", "start"]
