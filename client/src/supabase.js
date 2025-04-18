import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
);

export async function createRoom(channelId) {
    const { error } = await supabase.from('rooms').insert({
        channel_id: channelId,
        player_black: null,
        player_white: null,
        board: new Array(64).fill(0),
    });

    if (error) {
        console.error(error);

        return;
    }
}

export async function getRoom(channelId) {
    const { data, error } = await supabase.from('rooms').select();

    if (error) {
        console.error(error);

        return;
    }

    return data.length > 0 ? data[0] : null;
}

export async function updateRoom(channelId, player_black, player_white, board) {
    const { error } = await supabase
        .from('instruments')
        .update({ player_black, player_white, board })
        .eq('channel_id', channelId);

    if (error) {
        console.error(error);

        return;
    }
}

export async function deleteRoom(channelId) {
    try {
        await supabase.from('rooms').delete().eq('channel_id', channelId);
    } catch (err) {
        console.error(err);
    }
}
