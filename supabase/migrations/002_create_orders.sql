-- Migration 002: Create orders table

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  cin text NOT NULL,
  telephone text,
  adresse text,
  produit_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  produit_nom text NOT NULL,
  quantite integer NOT NULL DEFAULT 1,
  prix_total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'en_attente',
  created_at timestamptz NOT NULL DEFAULT now()
);
