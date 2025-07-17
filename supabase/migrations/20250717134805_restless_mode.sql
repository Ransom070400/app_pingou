/*
  # Create rewards and achievements system

  1. New Tables
    - `rewards`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `cost` (integer) -- ping tokens required
      - `reward_type` (text) -- 'voucher', 'feature', 'access'
      - `is_active` (boolean, default true)
      - `metadata` (jsonb)
      - `created_at` (timestamp)

    - `user_rewards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `reward_id` (uuid, references rewards)
      - `redeemed_at` (timestamp)
      - `status` (text) -- 'redeemed', 'used', 'expired'

    - `achievements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `icon` (text)
      - `requirement_type` (text) -- 'connections', 'events', 'streak'
      - `requirement_value` (integer)
      - `is_active` (boolean, default true)

    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `achievement_id` (uuid, references achievements)
      - `earned_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies

  3. Functions
    - Function to redeem rewards
    - Function to check and award achievements
</sql>

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  cost integer NOT NULL CHECK (cost > 0),
  reward_type text NOT NULL CHECK (reward_type IN ('voucher', 'feature', 'access')),
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create user_rewards table
CREATE TABLE IF NOT EXISTS user_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  reward_id uuid REFERENCES rewards(id) ON DELETE CASCADE,
  redeemed_at timestamptz DEFAULT now(),
  status text DEFAULT 'redeemed' CHECK (status IN ('redeemed', 'used', 'expired')),
  UNIQUE(user_id, reward_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '🏆',
  requirement_type text NOT NULL CHECK (requirement_type IN ('connections', 'events', 'streak', 'ping_tokens')),
  requirement_value integer NOT NULL CHECK (requirement_value > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Rewards policies
CREATE POLICY "Anyone can read active rewards"
  ON rewards
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User rewards policies
CREATE POLICY "Users can read their rewards"
  ON user_rewards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can redeem rewards"
  ON user_rewards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Anyone can read active achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User achievements policies
CREATE POLICY "Users can read their achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can award achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default rewards
INSERT INTO rewards (title, description, cost, reward_type, metadata) VALUES
('Coffee Voucher', 'Get a free coffee at participating cafes', 25, 'voucher', '{"partner": "local_cafes"}'),
('Premium Features', 'Unlock advanced profile customization', 50, 'feature', '{"features": ["custom_themes", "advanced_analytics"]}'),
('Event VIP Access', 'Skip the line at select events', 100, 'access', '{"access_type": "vip_entry"}'),
('Networking Badge', 'Special badge for your profile', 75, 'feature', '{"badge_type": "networking_pro"}');

-- Insert default achievements
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value) VALUES
('First Connection', 'Made your first connection', '🤝', 'connections', 1),
('Networking Novice', 'Connected with 5 people', '🌱', 'connections', 5),
('Networking Pro', 'Connected with 10+ people', '🌟', 'connections', 10),
('Super Connector', 'Connected with 25+ people', '⚡', 'connections', 25),
('Event Attendee', 'Attended your first event', '🎪', 'events', 1),
('Event Explorer', 'Attended 3+ events', '🗺️', 'events', 3),
('Event Master', 'Attended 5+ events', '🎯', 'events', 5),
('Ping Collector', 'Earned 50+ ping tokens', '💰', 'ping_tokens', 50),
('Ping Master', 'Earned 100+ ping tokens', '👑', 'ping_tokens', 100);

-- Function to redeem reward
CREATE OR REPLACE FUNCTION redeem_reward(reward_id_param uuid)
RETURNS json AS $$
DECLARE
  current_user_id uuid;
  reward_record rewards%ROWTYPE;
  user_ping_tokens integer;
BEGIN
  current_user_id := auth.uid();
  
  -- Get reward details
  SELECT * INTO reward_record FROM rewards WHERE id = reward_id_param AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Reward not found or inactive');
  END IF;
  
  -- Check if already redeemed
  IF EXISTS (SELECT 1 FROM user_rewards WHERE user_id = current_user_id AND reward_id = reward_id_param) THEN
    RETURN json_build_object('success', false, 'message', 'Reward already redeemed');
  END IF;
  
  -- Check user's ping tokens
  SELECT ping_tokens INTO user_ping_tokens FROM user_profiles WHERE id = current_user_id;
  
  IF user_ping_tokens < reward_record.cost THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient ping tokens');
  END IF;
  
  -- Redeem reward
  INSERT INTO user_rewards (user_id, reward_id) VALUES (current_user_id, reward_id_param);
  
  -- Deduct ping tokens
  UPDATE user_profiles SET ping_tokens = ping_tokens - reward_record.cost WHERE id = current_user_id;
  
  -- Record transaction
  INSERT INTO ping_transactions (user_id, amount, transaction_type, description)
  VALUES (current_user_id, -reward_record.cost, 'spent', 'Redeemed: ' || reward_record.title);
  
  RETURN json_build_object('success', true, 'message', 'Reward redeemed successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements(user_id_param uuid DEFAULT NULL)
RETURNS json AS $$
DECLARE
  current_user_id uuid;
  achievement_record achievements%ROWTYPE;
  user_connections_count integer;
  user_events_count integer;
  user_ping_tokens integer;
  new_achievements text[] := '{}';
BEGIN
  current_user_id := COALESCE(user_id_param, auth.uid());
  
  -- Get user stats
  SELECT COUNT(*) INTO user_connections_count 
  FROM connections 
  WHERE user1_id = current_user_id OR user2_id = current_user_id;
  
  SELECT COUNT(DISTINCT event_id) INTO user_events_count 
  FROM event_participants 
  WHERE user_id = current_user_id;
  
  SELECT ping_tokens INTO user_ping_tokens 
  FROM user_profiles 
  WHERE id = current_user_id;
  
  -- Check each achievement
  FOR achievement_record IN 
    SELECT * FROM achievements 
    WHERE is_active = true 
    AND id NOT IN (SELECT achievement_id FROM user_achievements WHERE user_id = current_user_id)
  LOOP
    CASE achievement_record.requirement_type
      WHEN 'connections' THEN
        IF user_connections_count >= achievement_record.requirement_value THEN
          INSERT INTO user_achievements (user_id, achievement_id) 
          VALUES (current_user_id, achievement_record.id);
          new_achievements := array_append(new_achievements, achievement_record.title);
        END IF;
      WHEN 'events' THEN
        IF user_events_count >= achievement_record.requirement_value THEN
          INSERT INTO user_achievements (user_id, achievement_id) 
          VALUES (current_user_id, achievement_record.id);
          new_achievements := array_append(new_achievements, achievement_record.title);
        END IF;
      WHEN 'ping_tokens' THEN
        IF user_ping_tokens >= achievement_record.requirement_value THEN
          INSERT INTO user_achievements (user_id, achievement_id) 
          VALUES (current_user_id, achievement_record.id);
          new_achievements := array_append(new_achievements, achievement_record.title);
        END IF;
    END CASE;
  END LOOP;
  
  RETURN json_build_object(
    'success', true, 
    'new_achievements', new_achievements,
    'count', array_length(new_achievements, 1)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;