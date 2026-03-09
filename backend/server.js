const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let messaggi = [{ text: "Funziona!" }];

app.get('/api/messages', (req, res) => {
    res.json(messaggi);
});

app.post('/api/messages', (req, res) => {
    messaggi.push(req.body);
    res.json({ status: "Inviato" });
});
app.get('/', (req, res) => {
    res.send("Il server è attivo e funzionante!");
});


app.listen(3000, () => console.log("Server su http://localhost:3000"));
