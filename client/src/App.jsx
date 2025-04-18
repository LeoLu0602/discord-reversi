import { DiscordSDK } from '@discord/embedded-app-sdk';
import { useEffect } from 'react';

export default function App() {
    useEffect(() => {
        let auth;

        async function setUp() {
            const discordSdk = new DiscordSDK(
                import.meta.env.VITE_DISCORD_CLIENT_ID
            );

            try {
                await discordSdk.ready();
                console.log('Discord SDK is ready');

                const { code } = await discordSdk.commands.authorize({
                    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
                    response_type: 'code',
                    state: '',
                    prompt: 'none',
                    scope: ['identify', 'guilds', 'applications.commands'],
                });

                const response = await fetch('/.proxy/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        code,
                    }),
                });
                const { access_token } = await response.json();

                auth = await discordSdk.commands.authenticate({
                    access_token,
                });

                if (auth == null) {
                    throw new Error('Authenticate command failed');
                }

                console.log(auth);
            } catch (err) {
                console.error(err);
            }
        }

        setUp();
    }, []);

    return (
        <>
            <h1 className="font-bold">Discord Reversi</h1>
        </>
    );
}
