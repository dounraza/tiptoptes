import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = 3000;

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// Log pour voir ce qui se passe
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// --- ROUTES PUBLIQUES ---

// GET /api/products (Récupérer les produits)
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    
    // Si la DB est vide ou erreur, on renvoie des produits de test obligatoirement
    if (error || !data || data.length === 0) {
      console.log("Envoi des packs Free Fire (DB vide)");
      return res.json([
        { id: '1', name: 'LEVEL UP - 120 💎', price: 3500, image_url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800', category: 'LEVEL UP' },
        { id: '2', name: 'LEVEL UP - 200 💎', price: 4400, image_url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800', category: 'LEVEL UP' },
        { id: '3', name: 'LEVEL UP - 350 💎', price: 6400, image_url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800', category: 'LEVEL UP' },
        { id: '4', name: 'TOP UP - 100 + 10 💎', price: 4900, image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', category: 'TOP UP BONUS' },
        { id: '5', name: 'TOP UP - 200 + 20 💎', price: 9500, image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', category: 'TOP UP BONUS' },
        { id: '6', name: 'TOP UP - 500 + 50 💎', price: 25000, image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', category: 'TOP UP BONUS' },
        { id: '7', name: 'Abonnement Weekly 💜', price: 11500, image_url: 'https://images.unsplash.com/photo-1624396115567-b03cd022d15c?w=800', category: 'ABONNEMENT' },
        { id: '8', name: 'Abonnement Monthly 🧡', price: 49900, image_url: 'https://images.unsplash.com/photo-1624396115567-b03cd022d15c?w=800', category: 'ABONNEMENT' },
      ]);
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  res.json({ token: 'fake-jwt-token', user: { email: req.body.email } });
});

// POST /api/orders (Passer une commande)
app.post('/api/orders', async (req, res) => {
  const { 
    client_name, 
    client_email, 
    phone, 
    uid_game, 
    pseudo_game, 
    payment_ref, 
    total_amount, 
    items 
  } = req.body;
  
  console.log("Nouveau Top-up:", { pseudo_game, uid_game, payment_ref });

  try {
    // 1. Insérer dans la table orders
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ 
        client_name, 
        client_email, 
        phone, 
        uid_game, 
        pseudo_game, 
        payment_ref, 
        total_amount,
        status: 'pending'
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insérer dans order_items
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: String(item.product_id),
        product_name: item.product_name,
        quantity: item.quantity || 1,
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    res.status(201).json({ message: 'Top-up enregistré avec succès', order });
  } catch (err: any) {
    console.error("Erreur insertion:", err.message);
    res.status(500).json({ error: "Erreur lors de la création", details: err.message });
  }
});

// --- ROUTES ADMIN ---

// GET /api/admin/orders (Récupérer toutes les commandes avec leurs articles)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: "Erreur lors de la récupération", details: err.message });
  }
});

// GET /api/admin/stats (Statistiques réelles du tableau de bord)
app.get('/api/admin/stats', async (req, res) => {
  try {
    // 1. Total Revenue (somme des commandes 'completed')
    const { data: revenueData } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'completed');
    
    const total_revenue = revenueData?.reduce((sum, row) => sum + Number(row.total_amount), 0) || 0;

    // 2. Total Orders
    const { count: total_orders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // 3. Pending Orders
    const { count: pending_orders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // 4. Total Products
    const { count: total_products } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // 5. Recent Sales (10 dernières complétées)
    const { data: recent_sales } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(10);

    res.json({
      total_revenue,
      total_orders: total_orders || 0,
      pending_orders: pending_orders || 0,
      total_products: total_products || 0,
      recent_sales: recent_sales || []
    });
  } catch (err: any) {
    res.status(500).json({ error: "Erreur stats", details: err.message });
  }
});

// PATCH /api/admin/orders/:id/status (Mettre à jour le statut dans Supabase)
app.patch('/api/admin/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json({ message: 'Statut mis à jour', data });
  } catch (err: any) {
    res.status(500).json({ error: "Erreur lors de la mise à jour", details: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Serveur API sur http://localhost:${port}/api`);
});
