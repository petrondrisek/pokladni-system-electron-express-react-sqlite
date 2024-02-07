- npm start - spustí React
- node server.js - spouští Express.js
- npm run electron:start -> spustí React i Express v Electron app
- npm run electron:package:win -> Spustí vytvoření .exe souboru

- U Reactu v src/components/uploadFile.js se musí přenastavit URL pro vybrání obrázku (pro Electron a webovou verzi jsou odlišné).

Stack: React, Express, Electronjs, SQLite databaze (database.db)

.env FILE:
BROWSER=none
BACKEND_PORT=8000
FRONTEND_PORT=3000


Aby se nainstalovaly potrebne node_moduly je potreba dat npm install do terminalu