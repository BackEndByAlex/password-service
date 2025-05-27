[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

# Password-Service

> Node.js/Express-mikrotjänst för säker lagring och hantering av lösenord, med historik och JWT-baserad autentisering.

---

## 🚀 Funktioner

- **CRUD för lösenordsinlägg**  
  - Skapa nytt lösenordsinlägg  
    `POST /api/v1/password`  
  - Hämta alla lösenord för inloggad användare  
    `GET  /api/v1/password`  
  - Hämta ett enskilt lösenord  
    `GET  /api/v1/password/:id`  
  - Uppdatera ett lösenord  
    `PUT  /api/v1/password/:id`  
  - Ta bort ett lösenord  
    `DELETE /api/v1/password/:id`  
- **Historik**  
  - Visa historiska versioner av ett lösenord  
    `GET /api/v1/password/:id/history`  
- **Säkerhet & Middleware**  
  - JWT-autentisering via `authMiddleware.js`  
  - Loggning med `winston` (app-logs) och `morgan` (HTTP-logs)
- **Databas**  
  - MongoDB med Mongoose-modell `PasswordEntry.js`
- **Konfiguration**  
  - Centraliserad inställning av DB-anslutning, logger och HTTP-logs i `src/config`

---

## 📁 Projektstruktur

```text
password-service/
├── src/
│   ├── config/
│   │   ├── mongoose.js       # MongoDB-anslutning
│   │   ├── morgan.js         # HTTP-loggning
│   │   └── winston.js        # App-loggning
│   ├── controllers/
│   │   └── api/
│   │       └── v1/
│   │           ├── savePassword.js
│   │           ├── getUserPasswords.js
│   │           ├── getPasswordById.js
│   │           ├── changePassword.js
│   │           ├── deletePassword.js
│   │           └── passwordHistory.js
│   ├── middlewares/
│   │   └── authMiddleware.js  # JWT-skydd av API
│   ├── models/
│   │   └── PasswordEntry.js   # Mongoose-schema
│   ├── routes/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── passwordRoutes.js
│   │   └── router.js          # Versionerad API-mount
│   ├── app.js                 # Express-app + global middleware
│   └── server.js              # Startar servern
├── tests/                     # Enhets- och integrationstester
│   └── password.spec.js
├── Dockerfile                 # Produktions-Docker image
├── docker-compose.yml         # LOKAL docker-setup
├── .env.example               # Exempel på miljövariabler
├── package.json
└── README.md                  # Denna fil


## ⚙️ Installation

1. **Kloning**  
   ```bash
   git clone git@github.com:din-org/password-service.git
   cd auth-service

## ⚙️ Installation

1. Klona repot:

   ```bash
   git clone git@github.com:min-org/password-service.git
   cd password-service
   ```
2. Installera beroenden:

   ```bash
   npm install
   ```
3. Skapa `.env` i projektroten och lägg till:

   ```dotenv
   # Server
   PORT=3000  
   MONGODB_URI=...
   ENCRYPTION_KEY=...
   ```

---

## 🏃‍♂️ Köra applikationen

* **Utveckling** (med automatisk reload):

  ```bash
  npm run dev
  ```
* **Produktion**:

  ```bash
  npm start
  ```
* **Environment**:

  * `.env.development`, `.env.production` kan hanteras med `dotenv-flow` om önskas.

---

## 📦 Scripts i `package.json`

| Script           | Beskrivning                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Startar app med `nodemon`            |
| `npm start`      | Kör app i produktion (`node app.js`) |
| `npm run lint/lint:fix`   | Kör ESLint                           |
| `npm run test:unit` | Kör alla vitest tester                       |
---

## ✅ Testning

> *(Kommer snart flera: enhetstester, integrationstester, systemtester)*

```bash
npm run test:unit
```

---

## 🚦 CI/CD

* **GitHub Actions**: bygg- och lint-steg på varje PR
* **Deploy**: Docker
* **Docker**: inkludera `Dockerfile` och `docker-compose.yml` för lokale testing

---

## 📄 Contributing

1. Forka projektet
2. Skapa feature-branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "feat: beskriver vad som gjordes"`
4. Push: `git push origin feature/my-feature`
5. Öppna PR och beskriv ditt ärende

---

## 📖 Kodstandard & Styleguide

* **ESLint**: följer `.eslintrc.js` (Airbnb-regler)
* **Prettier**: egenskaper i `.prettierrc`
* **Branch-naming**: `refactor/`

---

## 📄 Licens

Detta projekt är licensierat under Creative Commons BY 4.0.
Se [LICENSE.md](LICENSE.md) för detaljer.
