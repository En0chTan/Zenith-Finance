require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Testing Supabase Connection...');
    const { data, error } = await supabase.from('transactions').select('*').limit(1);
    if (error) {
        console.error('Supabase Error:', error);
    } else {
        console.log('Success! Data:', data);
    }
}
check();
