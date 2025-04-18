import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const app = express();
const port = 3001;

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

app.use(express.json());

app.post('/api/token', async (req, res) => {
    const response = await fetch(`https://discord.com/api/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: process.env.VITE_DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: req.body.code,
        }),
    });

    const { access_token } = await response.json();

    res.send({ access_token });
});

app.get('/api/room/:channelId', async (req, res) => {
    console.log(`GET /api/room/${req.params.channelId}`);

    const { data, error } = await supabase
        .from('room')
        .select('*')
        .eq('channel_id', req.params.channelId);

    if (error) {
        console.error(error);

        return res.status(500);
    }

    if (data.length > 0) {
        res.send({ room: data[0] });
    } else {
        res.send({ room: null });
    }
});

app.post('/api/room', async (req, res) => {
    console.log(`POST /api/room`);

    const { channel_id } = req.body;
    const { error } = await supabase.from('room').insert({ channel_id });

    if (error) {
        console.error(error);

        return res.status(500);
    }

    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
