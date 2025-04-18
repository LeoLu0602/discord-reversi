import { DiscordSDK } from '@discord/embedded-app-sdk';
import { useEffect, useState } from 'react';

export default function App() {
    const [p1, setP1] = useState(null);
    const [p2, setP2] = useState(null);
    const [user, setUser] = useState(null);

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

                if (auth == null) {
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
                    {p1 ? (
                        <div className="w-full h-24 p-2 bg-[#373633] flex items-center mb-2">
                            <img
                                className="h-full aspect-square"
                                src={`https://cdn.discordapp.com/avatars/${p1.id}/${p1.avatar}.png`}
                            />
                            <div className="h-full grow px-2">
                                <div>{p1?.global_name ?? 'Leo Lu'}</div>
                                <div>1000</div>
                            </div>
                        </div>
                    ) : (
                        <button className="block w-full h-24 bg-[#373633] hover:bg-[#5b5954] text-4xl  cursor-pointer mb-2">
                            &#43;
                        </button>
                    )}
                    {p2 ? (
                        <div className="w-full h-24 p-2 bg-[#373633] flex items-center mb-2">
                            <img
                                className="h-full aspect-square"
                                src={`https://cdn.discordapp.com/avatars/${p2.id}/${p2.avatar}.png`}
                            />
                            <div className="h-full grow px-2">
                                <div>{user?.global_name ?? 'Leo Lu'}</div>
                                <div>1000</div>
                            </div>
                        </div>
                    ) : (
                        <button className="block w-full h-24 bg-[#373633] hover:bg-[#5b5954] text-4xl cursor-pointer mb-2">
                            &#43;
                        </button>
                    )}
                    <div className="w-full h-24 p-2 bg-[#373633] flex items-center mb-2">
                        <img
                            className="h-full aspect-square"
                            src={
                                user
                                    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                                    : '/discord-icon.png'
                            }
                        />
                        <div className="h-full grow px-2">
                            <div>{user?.global_name ?? 'Leo Lu'}</div>
                            <div>1000</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
