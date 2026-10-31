import express from 'express';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// Configuração de caminhos para o Node.js encontrar o seu HTML na mesma pasta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURAÇÃO DIRETA (Chaves inseridas diretamente para evitar falhas de leitura)
const supabaseUrl = 'https://supabase.co';
const supabaseKey = 'sb_publishable_C_DWRO6qNOG94znZmHQs7w_wJb-nI1K';

// Inicialização do cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. ROTA PRINCIPAL: Carrega o MacFilipe.html diretamente ao aceder a http://localhost:3009
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'MacFilipe.html'));
});

// 2. ROTA DA API: Usada internamente pelo HTML em segundo plano para ler os pedidos
app.get('/api/data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mac_data')
      .select('*');
    
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. ROTA DA API: Usada internamente pelo HTML em segundo plano para criar/atualizar pedidos
app.post('/api/data', async (req, res) => {
  try {
    const { title, content, metadata } = req.body;
    const { data, error } = await supabase
      .from('mac_data')
      .insert([{ title, content, metadata }])
      .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicia o servidor fixo na porta 3009
const PORT = 3009;
app.listen(PORT, () => console.log(`Servidor a correr na porta http://localhost:${PORT}/`));
