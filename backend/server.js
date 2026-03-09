const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// CONFIGURAZIONE SUPABASE (Sostituisci con i tuoi dati)
const SUPABASE_URL = 'https://eyfqsteqbaqzuxgabzuy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_oB99lrTn1sTNK3O1KoML1Q_meNnqNy-';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors());
app.use(express.json());

// 1. GET: Legge i messaggi dal database
app.get('/api/messages', async (req, res) => {
    const { data, error } = await supabase
        .from('messaggi') // Il nome della tabella creata su Supabase
        .select('*');
    
    if (error) return res.status(500).json(error);
    res.json(data);
});

// 2. POST: Salva un nuovo messaggio nel database
app.post('/api/messages', async (req, res) => {
    const { data, error } = await supabase
        .from('messaggi')
        .insert([{ text: req.body.text }]); // Inserisce l'oggetto inviato dal frontend
    
    if (error) return res.status(500).json(error);
    res.json({ status: "Messaggio salvato!" });
});

// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server pronto sulla porta ${PORT}`));
