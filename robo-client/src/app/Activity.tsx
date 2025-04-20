import { useEffect, useState } from 'react';
import { useDiscordSdk } from '../hooks/useDiscordSdk';
import { useSyncState } from '@robojs/sync';

interface UserType {
    id: string;
    username: string;
    global_name: string;
    avatar: string;
}

export function Activity() {
    const { session, discordSdk } = useDiscordSdk();
    const [p1, setP1] = useSyncState<UserType | null>(null, [
        'p1',
        discordSdk.channelId,
    ]);
    const [p2, setP2] = useSyncState<UserType | null>(null, [
        'p2',
        discordSdk.channelId,
    ]);
    const [user, setUser] = useState<UserType | null>(null);
    const isUserP1 = p1 && user && p1.id === user.id;
    const isUserP2 = p2 && user && p2.id === user.id;

    console.log('p1: ', p1);

    useEffect(() => {
        if (session) {
            const { id, username, global_name, avatar } = session.user;

            setUser({
                id,
                username,
                global_name: global_name ?? '',
                avatar: avatar ?? '',
            });
        }
    }, [session]);

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

                                        setP1({ ...user });
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
