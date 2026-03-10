const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

// CONFIGURAZIONE SUPABASE (Sostituisci con i tuoi dati)
const SUPABASE_URL = "https://eyfqsteqbaqzuxgabzuy.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZnFzdGVxYmFxenV4Z2FienV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODU0NDQsImV4cCI6MjA4ODY2MTQ0NH0.aucuCfI9SxN3OjQSiFhtHi8meVGw1Bnk0dw1oa6ZZ1E";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors());
app.use(express.json());

// GET PRODOTTI
app.get("/api/products", async (req, res) => {
  const { data } = await supabase.from("prodotti").select("*");
  res.json(data);
});

// POST ACQUISTO (La parte difficile)
app.post("/api/buy", async (req, res) => {
  const { prodottoId, utenteId } = req.body;

  // 1. Recupera prodotto e utente
  const { data: prodotto } = await supabase
    .from("prodotti")
    .select("*")
    .eq("id", prodottoId)
    .single();
  const { data: utente } = await supabase
    .from("utenti")
    .select("*")
    .eq("id", utenteId)
    .single();

  // 2. CONTROLLI DI SICUREZZA (Requisito del Prof)
  if (prodotto.stock <= 0) {
    return res.status(400).json({ error: "Prodotto esaurito!" });
  }
  if (utente.crediti < prodotto.prezzo) {
    return res.status(400).json({ error: "Crediti insufficienti!" });
  }

  // 3. Esegui transazione (Semplificata)
  await supabase
    .from("prodotti")
    .update({ stock: prodotto.stock - 1 })
    .eq("id", prodottoId);
  await supabase
    .from("utenti")
    .update({ crediti: utente.crediti - prodotto.prezzo })
    .eq("id", utenteId);

  res.json({ success: true, nuovoSaldo: utente.crediti - prodotto.prezzo });
});

// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server pronto sulla porta ${PORT}`));
