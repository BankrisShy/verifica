const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = 'https://eyfqsteqbaqzuxgabzuy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZnFzdGVxYmFxenV4Z2FienV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODU0NDQsImV4cCI6MjA4ODY2MTQ0NH0.aucuCfI9SxN3OjQSiFhtHi8meVGw1Bnk0dw1oa6ZZ1E';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. GET CATALOGO PRODOTTI
app.get('/api/products', async (req, res) => {
    const { data } = await supabase.from('prodotti').select('*').order('id');
    res.json(data);
});

// 2. GET DATI UTENTE (Saldo)
app.get('/api/user/:id', async (req, res) => {
    const { data } = await supabase.from('utenti').select('*').eq('id', req.params.id).single();
    res.json(data);
});

// 3. POST ACQUISTO (Logica di Sicurezza)
app.post('/api/buy', async (req, res) => {
    const { prodottoId, utenteId } = req.body;

    const { data: prodotto } = await supabase.from('prodotti').select('*').eq('id', prodottoId).single();
    const { data: utente } = await supabase.from('utenti').select('*').eq('id', utenteId).single();

    // CONTROLLI LATO SERVER (Obbligatori per la consegna)
    if (!prodotto || prodotto.stock <= 0) return res.status(400).json({ error: "Prodotto esaurito!" });
    if (!utente || utente.crediti < prodotto.prezzo) return res.status(400).json({ error: "Crediti insufficienti!" });

    // Esegui transazione
    await supabase.from('prodotti').update({ stock: prodotto.stock - 1 }).eq('id', prodottoId);
    await supabase.from('utenti').update({ crediti: utente.crediti - prodotto.prezzo }).eq('id', utenteId);

    res.json({ success: true });
});

// 4. ADMIN: AGGIUNGI/MODIFICA PRODOTTO
app.post('/api/admin/products', async (req, res) => {
    const { nome, prezzo, stock } = req.body;
    const { data, error } = await supabase.from('prodotti').insert([{ nome, prezzo, stock }]);
    res.json({ success: !error });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server e-commerce pronto su porta ${PORT}`));
