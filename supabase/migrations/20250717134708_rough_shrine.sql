/*
  # Create users and profiles system

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `nickname` (text)
      - `phone` (text)
      - `instagram` (text)
      - `twitter` (text)
      - `linkedin` (text)
      - `wallet_address` (text)
      - `ping_tokens` (integer, default 0)
      - `qr_code_data` (text, unique)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to read/update their own profiles
    - Add policy for users to read other profiles (for networking)

  3. Functions
    - Trigger to auto-create profile on user signup
    - Function to generate unique QR code data
</sql>

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text DEFAULT '',
  nickname text DEFAULT '',
  phone text DEFAULT '',
  instagram text DEFAULT '',
  twitter text DEFAULT '',
  linkedin text DEFAULT '',
  wallet_address text DEFAULT '',
  ping_tokens integer DEFAULT 0,
  qr_code_data text UNIQUE NOT NULL,
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read other profiles for networking"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to generate unique QR code data
CREATE OR REPLACE FUNCTION generate_qr_code_data()
RETURNS text AS $$
BEGIN
  RETURN 'pingu_' || encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, email, qr_code_data)
  VALUES (
    NEW.id,
    NEW.email,
    generate_qr_code_data()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();