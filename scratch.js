import supabase from './src/supabaseClient.js';
async function test() {
  const { data: uData, error: uError } = await supabase.from('users').select('*').limit(1);
  console.log("users table schema sample:", uData);
  process.exit(0);
}
test();
