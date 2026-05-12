import { createClient } from '@supabase/supabase-js';

// The Project URL from your link
const supabaseUrl = 'https://sybfsqeybpdqxyekeksg.supabase.co';

// The long 'eyJ...' key you found earlier
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5YmZzcWV5YnBkcXh5ZWtla3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1ODgxMzMsImV4cCI6MjA5NDE2NDEzM30.JjmsIHTpQJ1uMzue7d5-f-ypv8t35yfrFpHCZDPqziw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);