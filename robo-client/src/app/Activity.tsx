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

const ROWS = 8;
const COLS = 8;

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
    const [turn, setTurn] = useSyncState<1 | 2>(1, [
        'turn',
        discordSdk.channelId,
    ]);
    /*
		0: illegal move
		1: black
		2: white
		3: legal move
    */
    const [board, setBoard] = useSyncState<number[][]>(
        new Array(ROWS).fill(null).map(() => new Array(COLS).fill(0)),
        ['board', discordSdk.channelId]
    );
    const isUserP1 = p1 && user && p1.id === user.id;
    const isUserP2 = p2 && user && p2.id === user.id;

    function isInBound(i: number, j: number): boolean {
        return i >= 0 && i < ROWS && j >= 0 && j < COLS;
    }

    function searchLegalMoves(board: number[][]): [number, number][] {
        const set = new Set<number>();

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] !== turn) {
                    continue;
                }

                let ii;
                let jj;

                // ↑
                ii = i - 1;
                jj = j;

                while (isInBound(ii, jj)) {
                    if (board[ii][jj] === turn) {
                        break;
                    }

                    if (board[ii][jj] === 0) {
                        if (ii !== i - 1) {
                            set.add(ii * COLS + jj);
                        }

                        break;
                    }

                    ii--;
                }

                // ↓
                ii = i + 1;
                jj = j;

                while (isInBound(ii, jj)) {
                    if (board[ii][jj] === turn) {
                        break;
                    }

                    if (board[ii][jj] === 0) {
                        if (ii !== i + 1) {
                            set.add(ii * COLS + jj);
                        }

                        break;
                    }

                    ii++;
                }

                // ←
                ii = i;
                jj = j - 1;

                while (isInBound(ii, jj)) {
                    if (board[ii][jj] === turn) {
                        break;
                    }

                    if (board[ii][jj] === 0) {
                        if (jj !== j - 1) {
                            set.add(ii * COLS + jj);
                        }

                        break;
                    }

                    jj--;
                }

                // →
                ii = i;
                jj = j + 1;

                while (isInBound(ii, jj)) {
                    if (board[ii][jj] === turn) {
                        break;
                    }

                    if (board[ii][jj] === 0) {
                        if (jj !== j + 1) {
                            set.add(ii * COLS + jj);
                        }

                        break;
                    }

                    jj++;
                }

                // ↖
                ii = i - 1;
                jj = j - 1;

                while (isInBound(ii, jj)) {
                    if (board[ii][jj] === turn) {
                        break;
                    }

                    if (board[ii][jj] === 0) {
                        if (ii !== i - 1 && jj !== j - 1) {
                            set.add(ii * COLS + jj);
                        }

                        break;
                    }

                    ii--;
                    jj--;
                }

                // ↙
                ii = i + 1;
                jj = j - 1;

                while (isInBound(ii, jj)) {
                    if (board[ii][jj] === turn) {
                        break;
                    }

                    if (board[ii][jj] === 0) {
                        if (ii !== i + 1 && jj !== j - 1) {
                            set.add(ii * COLS + jj);
                        }

                        break;
                    }

                    ii++;
                    jj--;
                }

                // ↗
                ii = i - 1;
                jj = j + 1;

                while (isInBound(ii, jj)) {
                    if (board[ii][jj] === turn) {
                        break;
                    }

                    if (board[ii][jj] === 0) {
                        if (ii !== i - 1 && jj !== j + 1) {
                            set.add(ii * COLS + jj);
                        }

                        break;
                    }

                    ii--;
                    jj++;
                }

                // ↘
                ii = i + 1;
                jj = j + 1;

                while (isInBound(ii, jj)) {
                    if (board[ii][jj] === turn) {
                        break;
                    }

                    if (board[ii][jj] === 0) {
                        if (ii !== i + 1 && jj !== j + 1) {
                            set.add(ii * COLS + jj);
                        }

                        break;
                    }

                    ii++;
                    jj++;
                }
            }
        }

        return Array.from(set).map((x) => [Math.floor(x / COLS), x % COLS]);
    }

    function updateBoard(row: number, col: number) {
        // ↑
        // ↓
        // ←
        // →
        // ↖
        // ↙
        // ↗
        // ↘
    }

    useEffect(() => {
        if (session) {
            const { id, username, global_name, avatar } = session.user;

            setUser({
                id,
                username,
                global_name: global_name ?? '',
                avatar: avatar ?? '',
            });

            const newBoard = structuredClone(board);

            newBoard[3][3] = 2;
            newBoard[3][4] = 1;
            newBoard[4][3] = 1;
            newBoard[4][4] = 2;

            const legalMoves = searchLegalMoves(newBoard);

            for (const [i, j] of legalMoves) {
                newBoard[i][j] = 3;
            }

            setBoard(newBoard);
        }
    }, [session]);

    if (!user) {
        <div className="w-full h-screen bg-[#302e2b] flex justify-center items-center" />;
    }

    return (
        <>
            <div className="w-full h-screen bg-[#302e2b] flex justify-center items-center">
                <Board board={board} updateBoard={updateBoard} />
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
