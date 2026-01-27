const { createClient } = require('@supabase/supabase-js');

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address.');
    console.log('Usage: node --env-file=.env.local scripts/promote-admin.js <email>');
    process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables.');
    console.log('Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
    console.log('And run with: node --env-file=.env.local scripts/promote-admin.js <email>');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function promoteToAdmin() {
    console.log(`Promoting ${email} to admin...`);

    // 1. Get User ID
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
        console.error('Error fetching users:', userError.message);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error(`User with email ${email} not found.`);
        return;
    }

    console.log(`Found user: ${user.id}`);

    // 2. Update Profile
    // We assume the profiles table is linked by id.
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

    if (updateError) {
        console.error('Error updating profile:', updateError.message);
        return;
    }

    console.log('Success! User is now an admin.');
}

promoteToAdmin();
