/*
  # Event Management Platform Schema

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `title` (text)
      - `description` (text)
      - `date` (timestamp)
      - `location` (text)
      - `category` (text)
      - `user_id` (uuid, references auth.users)
      - `image_url` (text, nullable)
    
    - `attendees`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `event_id` (uuid, references events)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL,
  location text NOT NULL,
  category text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  image_url text
);

-- Create attendees table
CREATE TABLE IF NOT EXISTS attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  event_id uuid REFERENCES events ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Attendees policies
CREATE POLICY "Anyone can view attendees"
  ON attendees FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can register for events"
  ON attendees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own attendance"
  ON attendees FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);