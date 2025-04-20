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
    const [board, setBoard] = useSyncState<(0 | 1 | 2 | 3)[][]>(
        [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 3, 0, 0, 0, 0],
            [0, 0, 3, 2, 1, 0, 0, 0],
            [0, 0, 0, 1, 2, 3, 0, 0],
            [0, 0, 0, 0, 3, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ],
        ['board', discordSdk.channelId]
    );
    const isUserP1 = p1 && user && p1.id === user.id;
    const isUserP2 = p2 && user && p2.id === user.id;

    function isInBound(i: number, j: number): boolean {
        return i >= 0 && i < ROWS && j >= 0 && j < COLS;
    }

    function searchLegalMoves(
        board: number[][],
        turn: 1 | 2
    ): [number, number][] {
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

    function getScores(board: (0 | 1 | 2 | 3)[][]): [number, number] {
        return [0, 0];
    }

    function updateBoard(i: number, j: number) {
        if (
            board[i][j] !== 3 ||
            (turn === 1 && !isUserP1) ||
            (turn === 2 && !isUserP2)
        ) {
            return;
        }

        const newBoard = structuredClone(board);

        newBoard[i][j] = turn;

        // replace all 3s with 0s
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[0].length; j++) {
                if (newBoard[i][j] === 3) {
                    newBoard[i][j] = 0;
                }
            }
        }

        let ii;
        let jj;
        let tmp;

        // ↑
        ii = i - 1;
        jj = j;
        tmp = [];

        while (isInBound(ii, jj)) {
            if (newBoard[ii][jj] === 0) {
                break;
            }

            if (newBoard[ii][jj] === turn) {
                for (const [i, j] of tmp) {
                    newBoard[i][j] = turn;
                }

                break;
            }

            tmp.push([ii, jj]);
            ii--;
        }

        // ↓
        ii = i + 1;
        jj = j;
        tmp = [];

        while (isInBound(ii, jj)) {
            if (newBoard[ii][jj] === 0) {
                break;
            }

            if (newBoard[ii][jj] === turn) {
                for (const [i, j] of tmp) {
                    newBoard[i][j] = turn;
                }

                break;
            }

            tmp.push([ii, jj]);
            ii++;
        }

        // ←
        ii = i;
        jj = j - 1;
        tmp = [];

        while (isInBound(ii, jj)) {
            if (newBoard[ii][jj] === 0) {
                break;
            }

            if (newBoard[ii][jj] === turn) {
                for (const [i, j] of tmp) {
                    newBoard[i][j] = turn;
                }

                break;
            }

            tmp.push([ii, jj]);
            jj--;
        }

        // →
        ii = i;
        jj = j + 1;
        tmp = [];

        while (isInBound(ii, jj)) {
            if (newBoard[ii][jj] === 0) {
                break;
            }

            if (newBoard[ii][jj] === turn) {
                for (const [i, j] of tmp) {
                    newBoard[i][j] = turn;
                }

                break;
            }

            tmp.push([ii, jj]);
            jj++;
        }

        // ↖
        ii = i - 1;
        jj = j - 1;
        tmp = [];

        while (isInBound(ii, jj)) {
            if (newBoard[ii][jj] === 0) {
                break;
            }

            if (newBoard[ii][jj] === turn) {
                for (const [i, j] of tmp) {
                    newBoard[i][j] = turn;
                }

                break;
            }

            tmp.push([ii, jj]);
            ii--;
            jj--;
        }

        // ↙
        ii = i + 1;
        jj = j - 1;
        tmp = [];

        while (isInBound(ii, jj)) {
            if (newBoard[ii][jj] === 0) {
                break;
            }

            if (newBoard[ii][jj] === turn) {
                for (const [i, j] of tmp) {
                    newBoard[i][j] = turn;
                }

                break;
            }

            tmp.push([ii, jj]);
            ii++;
            jj++;
        }

        // ↗
        ii = i - 1;
        jj = j + 1;
        tmp = [];

        while (isInBound(ii, jj)) {
            if (newBoard[ii][jj] === 0) {
                break;
            }

            if (newBoard[ii][jj] === turn) {
                for (const [i, j] of tmp) {
                    newBoard[i][j] = turn;
                }

                break;
            }

            tmp.push([ii, jj]);
            ii--;
            jj++;
        }

        // ↘
        ii = i + 1;
        jj = j + 1;
        tmp = [];

        while (isInBound(ii, jj)) {
            if (newBoard[ii][jj] === 0) {
                break;
            }

            if (newBoard[ii][jj] === turn) {
                for (const [i, j] of tmp) {
                    newBoard[i][j] = turn;
                }

                break;
            }

            tmp.push([ii, jj]);
            ii++;
            jj++;
        }

        const legalMoves = searchLegalMoves(newBoard, turn === 1 ? 2 : 1);

        for (const [i, j] of legalMoves) {
            newBoard[i][j] = 3;
        }

        const [blackScore, whiteScore] = getScores(newBoard);

        setBoard(newBoard);
        setTurn((oldVal) => (oldVal === 1 ? 2 : 1));
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
