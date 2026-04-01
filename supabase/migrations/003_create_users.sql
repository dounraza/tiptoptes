-- Migration 003: Create users table

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  nom text,
  prenom text,
  telephone text,
  adresse text,
  created_at timestamptz NOT NULL DEFAULT now()
);
