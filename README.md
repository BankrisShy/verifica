# Progetto E-Commerce Distribuito
## 1. Architettura
Il client è un **Thin Client**. Tutta la logica di business (controllo saldo e stock) risiede nel Backend. Il Frontend si occupa solo della visualizzazione.
## 2. Endpoint API
- `GET /api/products`: Restituisce il catalogo prodotti.
- `GET /api/user/:id`: Restituisce i crediti dell'utente.
- `POST /api/buy`: Esegue l'acquisto con validazione lato server.
- `POST /api/admin/products`: Permette all'admin di inserire nuovi prodotti.
## 3. Sicurezza
Il server verifica che lo stock sia > 0 e che i crediti dell'utente siano sufficienti prima di aggiornare il database. Se i controlli falliscono, restituisce un errore HTTP 400.
## 4. Uso IA
L'IA è stata utilizzata per la strutturazione del backend Node.js e per il debug della comunicazione CORS.
## 5. Link
- Backend: [[URL DI RENDER](https://mio-backend-verifica.onrender.com/)]
- Frontend: [[URL DI VERCEL/GITHUB PAGES](https://verifica-eta.vercel.app/index.html)]
"Il sistema di login è implementato lato server (Thin Client).
 Il frontend invia le credenziali, ma è il backend che interroga il database PostgreSQL (Supabase) per convalidare l'esistenza dell'utente.
 Questo garantisce che la logica di accesso non sia manipolabile dall'utente finale."
