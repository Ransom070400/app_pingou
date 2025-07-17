/*
  # Create events and networking system

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `location` (text)
      - `start_date` (timestamp)
      - `end_date` (timestamp)
      - `created_by` (uuid, references user_profiles)
      - `is_active` (boolean, default true)
      - `max_participants` (integer)
      - `event_code` (text, unique)
      - `created_at` (timestamp)

    - `event_participants`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `user_id` (uuid, references user_profiles)
      - `joined_at` (timestamp)
      - `is_admin` (boolean, default false)

  2. Security
    - Enable RLS on both tables
    - Add appropriate policies for event management
    - Add policies for participant management

  3. Functions
    - Function to generate unique event codes
    - Function to join events
</sql>

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  location text DEFAULT '',
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  created_by uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  max_participants integer DEFAULT 1000,
  event_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create event_participants table
CREATE TABLE IF NOT EXISTS event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  is_admin boolean DEFAULT false,
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Anyone can read active events"
  ON events
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Event creators can update their events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Event participants policies
CREATE POLICY "Users can read event participants"
  ON event_participants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join events"
  ON event_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave events"
  ON event_participants
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to generate unique event code
CREATE OR REPLACE FUNCTION generate_event_code()
RETURNS text AS $$
BEGIN
  RETURN upper(substring(encode(gen_random_bytes(4), 'hex') from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Function to join event
CREATE OR REPLACE FUNCTION join_event(event_code_param text)
RETURNS json AS $$
DECLARE
  event_record events%ROWTYPE;
  participant_count integer;
  result json;
BEGIN
  -- Find the event
  SELECT * INTO event_record FROM events WHERE event_code = event_code_param AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Event not found or inactive');
  END IF;
  
  -- Check if already joined
  IF EXISTS (SELECT 1 FROM event_participants WHERE event_id = event_record.id AND user_id = auth.uid()) THEN
    RETURN json_build_object('success', false, 'message', 'Already joined this event');
  END IF;
  
  -- Check participant limit
  SELECT COUNT(*) INTO participant_count FROM event_participants WHERE event_id = event_record.id;
  
  IF participant_count >= event_record.max_participants THEN
    RETURN json_build_object('success', false, 'message', 'Event is full');
  END IF;
  
  -- Join the event
  INSERT INTO event_participants (event_id, user_id) VALUES (event_record.id, auth.uid());
  
  RETURN json_build_object('success', true, 'message', 'Successfully joined event', 'event', row_to_json(event_record));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;