/*
  # Create connections and networking system

  1. New Tables
    - `connections`
      - `id` (uuid, primary key)
      - `user1_id` (uuid, references user_profiles)
      - `user2_id` (uuid, references user_profiles)
      - `event_id` (uuid, references events, nullable)
      - `connection_method` (text, default 'qr_scan')
      - `created_at` (timestamp)
      - `metadata` (jsonb)

    - `ping_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `amount` (integer)
      - `transaction_type` (text) -- 'earned', 'spent', 'bonus'
      - `description` (text)
      - `connection_id` (uuid, references connections, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for connection management
    - Add policies for ping transactions

  3. Functions
    - Function to create connection and award ping tokens
    - Function to get user's connection history
</sql>

-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  user2_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  connection_method text DEFAULT 'qr_scan',
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}',
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id != user2_id)
);

-- Create ping_transactions table
CREATE TABLE IF NOT EXISTS ping_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'bonus')),
  description text DEFAULT '',
  connection_id uuid REFERENCES connections(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ping_transactions ENABLE ROW LEVEL SECURITY;

-- Connections policies
CREATE POLICY "Users can read their connections"
  ON connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create connections"
  ON connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Ping transactions policies
CREATE POLICY "Users can read their ping transactions"
  ON ping_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create ping transactions"
  ON ping_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to create connection and award ping tokens
CREATE OR REPLACE FUNCTION create_connection(
  target_qr_code text,
  event_id_param uuid DEFAULT NULL,
  connection_method_param text DEFAULT 'qr_scan'
)
RETURNS json AS $$
DECLARE
  current_user_id uuid;
  target_user_id uuid;
  connection_record connections%ROWTYPE;
  ping_reward integer := 1;
BEGIN
  current_user_id := auth.uid();
  
  -- Find target user by QR code
  SELECT id INTO target_user_id FROM user_profiles WHERE qr_code_data = target_qr_code;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Invalid QR code');
  END IF;
  
  IF current_user_id = target_user_id THEN
    RETURN json_build_object('success', false, 'message', 'Cannot connect to yourself');
  END IF;
  
  -- Check if connection already exists (bidirectional)
  IF EXISTS (
    SELECT 1 FROM connections 
    WHERE (user1_id = current_user_id AND user2_id = target_user_id)
       OR (user1_id = target_user_id AND user2_id = current_user_id)
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Connection already exists');
  END IF;
  
  -- Create connection (always put smaller UUID first for consistency)
  INSERT INTO connections (user1_id, user2_id, event_id, connection_method)
  VALUES (
    LEAST(current_user_id, target_user_id),
    GREATEST(current_user_id, target_user_id),
    event_id_param,
    connection_method_param
  )
  RETURNING * INTO connection_record;
  
  -- Award ping tokens to both users
  INSERT INTO ping_transactions (user_id, amount, transaction_type, description, connection_id)
  VALUES 
    (current_user_id, ping_reward, 'earned', 'Connection reward', connection_record.id),
    (target_user_id, ping_reward, 'earned', 'Connection reward', connection_record.id);
  
  -- Update ping token counts
  UPDATE user_profiles SET ping_tokens = ping_tokens + ping_reward WHERE id = current_user_id;
  UPDATE user_profiles SET ping_tokens = ping_tokens + ping_reward WHERE id = target_user_id;
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Connection created successfully',
    'connection_id', connection_record.id,
    'ping_reward', ping_reward
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user connections with details
CREATE OR REPLACE FUNCTION get_user_connections(user_id_param uuid DEFAULT NULL)
RETURNS TABLE (
  connection_id uuid,
  connected_user_id uuid,
  connected_user_name text,
  connected_user_email text,
  connected_user_nickname text,
  event_name text,
  connection_method text,
  connected_at timestamptz
) AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := COALESCE(user_id_param, auth.uid());
  
  RETURN QUERY
  SELECT 
    c.id as connection_id,
    CASE 
      WHEN c.user1_id = current_user_id THEN c.user2_id
      ELSE c.user1_id
    END as connected_user_id,
    CASE 
      WHEN c.user1_id = current_user_id THEN up2.name
      ELSE up1.name
    END as connected_user_name,
    CASE 
      WHEN c.user1_id = current_user_id THEN up2.email
      ELSE up1.email
    END as connected_user_email,
    CASE 
      WHEN c.user1_id = current_user_id THEN up2.nickname
      ELSE up1.nickname
    END as connected_user_nickname,
    e.name as event_name,
    c.connection_method,
    c.created_at as connected_at
  FROM connections c
  LEFT JOIN user_profiles up1 ON c.user1_id = up1.id
  LEFT JOIN user_profiles up2 ON c.user2_id = up2.id
  LEFT JOIN events e ON c.event_id = e.id
  WHERE c.user1_id = current_user_id OR c.user2_id = current_user_id
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;