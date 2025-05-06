# Använd officiell Node.js-bild
FROM node:23-slim

# Steg 1: ta med certifikatet i sitt eget lager
COPY public.pem ./

# Ta med miljöfilen i sitt eget lager
COPY .env ./

# Sätt arbetskatalogen i containern
WORKDIR /app

# Kopiera package-filer och installera beroenden
COPY package*.json ./
RUN npm install

# Kopiera resten av applikationen
COPY . .

# Sätt miljövariabler direkt i Docker (om du inte kör env_file)
ENV NODE_ENV=production

# Exponera porten
EXPOSE 3001

# Starta applikationen
CMD ["npm", "start"]