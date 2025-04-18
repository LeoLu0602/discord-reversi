import { useEffect, useState } from 'react';
import { useDiscordSdk } from '../hooks/useDiscordSdk';
import { useSyncState } from '@robojs/sync';
import UserCard from '../components/UserCard';
import Board from '../components/Board';

export interface UserType {
    id: string;
    username: string;
    global_name: string;
    avatar: string;
}

export function Activity() {
    const { session, discordSdk } = useDiscordSdk();
    const [user, setUser] = useState<UserType | null>(null);
    const [p1, setP1] = useSyncState<UserType | null>(null, [
        'p1',
        discordSdk.channelId,
    ]);
    const [p2, setP2] = useSyncState<UserType | null>(null, [
        'p2',
        discordSdk.channelId,
    ]);
    const [board, setBoard] = useSyncState<number[][]>(
        new Array(8).fill(null).map(() => new Array(8).fill(0)),
        ['board', discordSdk.channelId]
    ); // 0: empty, 1: black, 2: white
    const isUserP1 = p1 && user && p1.id === user.id;
    const isUserP2 = p2 && user && p2.id === user.id;

    useEffect(() => {
        if (session) {
            const { id, username, global_name, avatar } = session.user;

            setUser({
                id,
                username,
                global_name: global_name ?? '',
                avatar: avatar ?? '',
            });

            setBoard((oldVal) => {
                oldVal[3][3] = 2;
                oldVal[3][4] = 1;
                oldVal[4][3] = 1;
                oldVal[4][4] = 2;

                return oldVal;
            });
        }
    }, [session]);

    if (!user) {
        <div className="w-full h-screen bg-[#302e2b] flex justify-center items-center" />;
    }

    return (
        <>
            <div className="w-full h-screen bg-[#302e2b] flex justify-center items-center">
                <Board board={board} />
                <div className="absolute right-0 p-2 top-0 w-48 h-screen bg-[#262522] text-white flex-col gap-4 overflow-auto">
                    <div className="mb-2">Black</div>
                    {p1 ? (
                        <UserCard user={p1} />
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
                        <UserCard user={p2} />
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
                </div>
            </div>
        </>
    );
}
