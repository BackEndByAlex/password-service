# ─────────────────────────────────────────────────────────────
# Produktion: Node‐app med konfigurations-filer från config/
# ─────────────────────────────────────────────────────────────

FROM node:23-slim
WORKDIR /app

# Steg 1: ta med certifikatet i sitt eget lager
COPY public.pem ./

# Ta med miljöfilen i sitt eget lager
COPY .env ./

# 2) Installera beroenden (endast production för snabbhet)
COPY package*.json ./
RUN npm install

# 3) Kopiera resten av applikationen
COPY . .

# 4) Sätt NODE_ENV
ENV NODE_ENV=production

# 5) Exponera port
EXPOSE 3001

# 6) Starta appen
CMD ["npm", "start"]
