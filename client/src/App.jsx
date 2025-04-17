import { DiscordSDK } from '@discord/embedded-app-sdk';
import { useEffect } from 'react';

export default function App() {
    useEffect(() => {
        async function setUp() {
            const discordSdk = new DiscordSDK(
                import.meta.env.VITE_DISCORD_CLIENT_ID
            );

            try {
                await discordSdk.ready();
                console.log('Discord SDK is ready');
            } catch (err) {}
        }

        setUp();
    }, []);

    return (
        <>
            <h1 className="font-bold">Discord Reversi</h1>
        </>
    );
}
