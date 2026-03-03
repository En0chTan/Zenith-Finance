require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDates() {
    const { error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'Password123!'
    });

    const { data, error } = await supabase.from('transactions').select('date, amount').order('date', { ascending: true });

    // Group by Year-Month to see the distribution
    const distr = {};
    for (let d of data) {
        const ym = (d.date || "").substring(0, 7);
        distr[ym] = (distr[ym] || 0) + 1;
    }
    console.log("Distribution:", distr);
}
checkDates();
