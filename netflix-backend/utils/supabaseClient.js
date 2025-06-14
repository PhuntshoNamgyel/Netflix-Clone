const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = proccess.env.REACT_APP_SUPABASE_URL
const supabaseKey = proccess.env.REACT_APP_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey);
 
export default supabase