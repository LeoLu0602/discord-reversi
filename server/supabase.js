import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_KEY
);

export async function createRoom(channel_id) {
    const { error } = await supabase.from('room').insert({ channel_id });
}
