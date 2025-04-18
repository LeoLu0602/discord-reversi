import { DiscordSDK } from '@discord/embedded-app-sdk';
import { useEffect, useState } from 'react';

export default function App() {
    const [p1, setP1] = useState(null);
    const [p2, setP2] = useState(null);
    const [user, setUser] = useState(null);
    const isUserP1 = p1 && user && p1.id === user.id;
    const isUserP2 = p2 && user && p2.id === user.id;

    useEffect(() => {
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

                const auth = await discordSdk.commands.authenticate({
                    access_token,
                });

                if (auth === null) {
                    throw new Error('Authenticate command failed');
                }

                const { user } = auth;
                const { id, username, global_name, avatar } = user;

                setUser({
                    id,
                    username,
                    global_name,
                    avatar,
                });

                if (
                    discordSdk.channelId !== null &&
                    discordSdk.guildId !== null
                ) {
                    const channel = await discordSdk.commands.getChannel({
                        channel_id: discordSdk.channelId,
                    });

                    if (channel.name !== null) {
                        console.log(channel.id);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }

        setUp();
    }, []);

    return (
        <>
            <div className="w-full h-screen bg-[#302e2b] flex justify-center items-center">
                <div className="h-screen aspect-square bg-emerald-500"></div>
                <div className="absolute right-0 p-2 top-0 w-48 h-screen bg-[#262522] text-white flex-col gap-4 overflow-auto">
                    {user && (
                        <>
                            <div className="mb-2">Black</div>
                            {p1 ? (
                                <div className="w-full h-24 p-2 bg-[#373633] flex items-center mb-2">
                                    <img
                                        className="h-full aspect-square"
                                        src={`https://cdn.discordapp.com/avatars/${p1.id}/${p1.avatar}.png`}
                                    />
                                    <div className="h-full grow px-2">
                                        <div>{p1.global_name}</div>
                                        <div>1000</div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="block w-full h-24 bg-[#373633] hover:bg-[#5b5954] text-4xl cursor-pointer mb-2"
                                    onClick={() => {
                                        if (isUserP2) {
                                            setP2(null);
                                        }

                                        setP1(user);
                                    }}
                                >
                                    &#43;
                                </button>
                            )}
                            <div className="mb-2">White</div>
                            {p2 ? (
                                <div className="w-full h-24 p-2 bg-[#373633] flex items-center mb-2">
                                    <img
                                        className="h-full aspect-square"
                                        src={`https://cdn.discordapp.com/avatars/${p2.id}/${p2.avatar}.png`}
                                    />
                                    <div className="h-full grow px-2">
                                        <div>{p2.global_name}</div>
                                        <div>1000</div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="block w-full h-24 bg-[#373633] hover:bg-[#5b5954] text-4xl cursor-pointer mb-2"
                                    onClick={() => {
                                        if (isUserP1) {
                                            setP1(null);
                                        }

                                        setP2(user);
                                    }}
                                >
                                    &#43;
                                </button>
                            )}
                            {(isUserP1 || isUserP2) && (
                                <button
                                    className="block w-full h-8 bg-red-500 hover:bg-red-400 text-lg cursor-pointer"
                                    onClick={() => {
                                        if (isUserP1) {
                                            setP1(null);
                                        } else if (isUserP2) {
                                            setP2(null);
                                        }
                                    }}
                                >
                                    Leave
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
