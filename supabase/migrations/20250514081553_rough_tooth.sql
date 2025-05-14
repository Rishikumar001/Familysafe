/*
  # Create incidents table for Guardian Watch

  1. New Tables
    - `incidents`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `location` (point, required)
      - `status` (text, default: 'pending')
      - `severity` (text, default: 'medium')
      - `created_at` (timestamp with timezone)
      - `user_id` (uuid, references auth.users)
      - `image_url` (text)

  2. Security
    - Enable RLS on `incidents` table
    - Add policies for:
      - Users can read all incidents
      - Users can only create/update their own incidents
*/

CREATE TABLE incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  location point NOT NULL,
  status text DEFAULT 'pending',
  severity text DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  image_url text
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read incidents
CREATE POLICY "Users can read all incidents"
  ON incidents
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to create their own incidents
CREATE POLICY "Users can create their own incidents"
  ON incidents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own incidents
CREATE POLICY "Users can update their own incidents"
  ON incidents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);