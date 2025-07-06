/*
  # Add INSERT policy for users table

  1. Security Changes
    - Add INSERT policy for users table to allow user registration
    - Policy allows inserting user records when the user ID matches the authenticated user's ID
  
  This fixes the RLS violation error that occurs during user registration.
*/

-- Add INSERT policy for users table
CREATE POLICY "Users can insert own profile during registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);