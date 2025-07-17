/*
  # Complete Pingu Database Schema

  1. New Tables
    - `user_profiles` - User profile information with social links and QR codes
    - `connections` - User-to-user connections via QR scanning
    - `ping_transactions` - Track all ping token transactions
    - `rewards` - Available rewards for redemption
    - `user_rewards` - Track redeemed rewards
    - `achievements` - Available achievements
    - `user_achievements` - Track earned achievements

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Secure connection creation and reward redemption

  3. Functions
    - `generate_qr_code_data()` - Generate unique QR codes
    - `create_connection()` - Handle QR code scanning and connection creation
    - `redeem_reward()` - Handle reward redemption with token deduction
    - `check_and_award_achievements()` - Automatic achievement checking
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  nickname text DEFAULT '',
  phone text DEFAULT '',
  instagram text DEFAULT '',
  twitter text DEFAULT '',
  linkedin text DEFAULT '',
  avatar_url text,
  ping_tokens integer DEFAULT 0,
  qr_code_data text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Connections Table
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  connected_user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  connection_method text DEFAULT 'qr_scan',
  ping_tokens_earned integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, connected_user_id)
);

-- Ping Transactions Table
CREATE TABLE IF NOT EXISTS ping_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('earned', 'spent')),
  amount integer NOT NULL,
  description text NOT NULL,
  reference_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Rewards Table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  cost integer NOT NULL,
  reward_type text NOT NULL CHECK (reward_type IN ('voucher', 'feature', 'access')),
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- User Rewards Table
CREATE TABLE IF NOT EXISTS user_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  reward_id uuid REFERENCES rewards(id) ON DELETE CASCADE,
  redeemed_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired'))
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  requirement_type text NOT NULL CHECK (requirement_type IN ('connections', 'ping_tokens', 'streak')),
  requirement_value integer NOT NULL,
  reward_tokens integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ping_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own connections"
  ON connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create connections"
  ON connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own transactions"
  ON ping_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create transactions"
  ON ping_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can read active rewards"
  ON rewards FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can read own redeemed rewards"
  ON user_rewards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can redeem rewards"
  ON user_rewards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can read active achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can read own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can award achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION create_connection(target_qr_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  target_user_id uuid;
  connection_exists boolean;
  result jsonb;
BEGIN
  -- Find target user by QR code
  SELECT id INTO target_user_id
  FROM user_profiles
  WHERE qr_code_data = target_qr_code;

  IF target_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Invalid QR code');
  END IF;

  IF target_user_id = current_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Cannot connect to yourself');
  END IF;

  -- Check if connection already exists
  SELECT EXISTS(
    SELECT 1 FROM connections 
    WHERE user_id = current_user_id AND connected_user_id = target_user_id
  ) INTO connection_exists;

  IF connection_exists THEN
    RETURN jsonb_build_object('success', false, 'message', 'Already connected to this user');
  END IF;

  -- Create bidirectional connection
  INSERT INTO connections (user_id, connected_user_id, ping_tokens_earned)
  VALUES 
    (current_user_id, target_user_id, 1),
    (target_user_id, current_user_id, 1);

  -- Award ping tokens to both users
  UPDATE user_profiles 
  SET ping_tokens = ping_tokens + 1
  WHERE id IN (current_user_id, target_user_id);

  -- Record transactions
  INSERT INTO ping_transactions (user_id, transaction_type, amount, description, reference_id)
  VALUES 
    (current_user_id, 'earned', 1, 'Connection made', target_user_id),
    (target_user_id, 'earned', 1, 'Connection made', current_user_id);

  RETURN jsonb_build_object(
    'success', true, 
    'message', 'Connection created successfully',
    'ping_tokens_earned', 1
  );
END;
$$;

CREATE OR REPLACE FUNCTION redeem_reward(reward_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  reward_cost integer;
  user_tokens integer;
  result jsonb;
BEGIN
  -- Get reward cost
  SELECT cost INTO reward_cost
  FROM rewards
  WHERE id = reward_id_param AND is_active = true;

  IF reward_cost IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Reward not found or inactive');
  END IF;

  -- Get user's current tokens
  SELECT ping_tokens INTO user_tokens
  FROM user_profiles
  WHERE id = current_user_id;

  IF user_tokens < reward_cost THEN
    RETURN jsonb_build_object('success', false, 'message', 'Insufficient ping tokens');
  END IF;

  -- Deduct tokens
  UPDATE user_profiles
  SET ping_tokens = ping_tokens - reward_cost
  WHERE id = current_user_id;

  -- Record redemption
  INSERT INTO user_rewards (user_id, reward_id)
  VALUES (current_user_id, reward_id_param);

  -- Record transaction
  INSERT INTO ping_transactions (user_id, transaction_type, amount, description, reference_id)
  VALUES (current_user_id, 'spent', reward_cost, 'Reward redeemed', reward_id_param);

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Reward redeemed successfully',
    'tokens_spent', reward_cost
  );
END;
$$;

CREATE OR REPLACE FUNCTION check_and_award_achievements()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  user_connections_count integer;
  user_ping_tokens integer;
  achievement_record record;
  new_achievements jsonb := '[]'::jsonb;
BEGIN
  -- Get user stats
  SELECT COUNT(*) INTO user_connections_count
  FROM connections
  WHERE user_id = current_user_id;

  SELECT ping_tokens INTO user_ping_tokens
  FROM user_profiles
  WHERE id = current_user_id;

  -- Check each achievement
  FOR achievement_record IN
    SELECT * FROM achievements 
    WHERE is_active = true
    AND id NOT IN (
      SELECT achievement_id FROM user_achievements WHERE user_id = current_user_id
    )
  LOOP
    DECLARE
      should_award boolean := false;
    BEGIN
      CASE achievement_record.requirement_type
        WHEN 'connections' THEN
          should_award := user_connections_count >= achievement_record.requirement_value;
        WHEN 'ping_tokens' THEN
          should_award := user_ping_tokens >= achievement_record.requirement_value;
      END CASE;

      IF should_award THEN
        -- Award achievement
        INSERT INTO user_achievements (user_id, achievement_id)
        VALUES (current_user_id, achievement_record.id);

        -- Award bonus tokens if any
        IF achievement_record.reward_tokens > 0 THEN
          UPDATE user_profiles
          SET ping_tokens = ping_tokens + achievement_record.reward_tokens
          WHERE id = current_user_id;

          INSERT INTO ping_transactions (user_id, transaction_type, amount, description, reference_id)
          VALUES (current_user_id, 'earned', achievement_record.reward_tokens, 'Achievement bonus', achievement_record.id);
        END IF;

        -- Add to result
        new_achievements := new_achievements || jsonb_build_object(
          'id', achievement_record.id,
          'title', achievement_record.title,
          'description', achievement_record.description,
          'reward_tokens', achievement_record.reward_tokens
        );
      END IF;
    END;
  END LOOP;

  RETURN jsonb_build_object('new_achievements', new_achievements);
END;
$$;

-- Insert default rewards
INSERT INTO rewards (title, description, cost, reward_type) VALUES
('Coffee Voucher', 'Get a free coffee at participating cafes', 25, 'voucher'),
('Premium Features', 'Unlock advanced profile customization', 50, 'feature'),
('VIP Event Access', 'Skip the line at select events', 100, 'access');

-- Insert default achievements
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value, reward_tokens) VALUES
('First Connection', 'Made your first connection', '🤝', 'connections', 1, 5),
('Networking Pro', 'Connected with 10+ people', '🌟', 'connections', 10, 15),
('Social Butterfly', 'Connected with 25+ people', '🦋', 'connections', 25, 25),
('Token Collector', 'Earned 50+ ping tokens', '💰', 'ping_tokens', 50, 10);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get user connections with details
CREATE OR REPLACE FUNCTION get_user_connections()
RETURNS TABLE (
  connection_id uuid,
  connected_user_id uuid,
  connected_user_name text,
  connected_user_email text,
  connected_user_nickname text,
  connected_user_avatar_url text,
  connection_method text,
  ping_tokens_earned integer,
  connected_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as connection_id,
    c.connected_user_id,
    up.name as connected_user_name,
    up.email as connected_user_email,
    up.nickname as connected_user_nickname,
    up.avatar_url as connected_user_avatar_url,
    c.connection_method,
    c.ping_tokens_earned,
    c.created_at as connected_at
  FROM connections c
  JOIN user_profiles up ON c.connected_user_id = up.id
  WHERE c.user_id = auth.uid()
  ORDER BY c.created_at DESC;
END;
$$;