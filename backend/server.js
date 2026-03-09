const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// CONFIGURAZIONE SUPABASE (Sostituisci con i tuoi dati)
const SUPABASE_URL = 'https://eyfqsteqbaqzuxgabzuy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZnFzdGVxYmFxenV4Z2FienV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODU0NDQsImV4cCI6MjA4ODY2MTQ0NH0.aucuCfI9SxN3OjQSiFhtHi8meVGw1Bnk0dw1oa6ZZ1E';
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
