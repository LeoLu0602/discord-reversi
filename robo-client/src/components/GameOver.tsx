import { UserType } from '../app/Activity';
import clsx from 'clsx';

export default function GameOver({
    score1,
    score2,
    p1,
    p2,
    cleanUp,
}: {
    score1: number;
    score2: number;
    p1: UserType | null;
    p2: UserType | null;
    cleanUp: () => void;
}) {
    if (!p1 || !p2) {
        return <></>;
    }

    const result =
        score1 > score2 || score2 === 0
            ? 1
            : score2 > score1 || score1 === 0
            ? 2
            : 0;

    return (
        <div className="fixed text-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#262522] w-72 h-72 flex flex-col justify-center gap-4 rounded-lg">
            <button
                className="text-white cursor-pointer font-bold absolute right-4 top-4"
                onClick={() => {
                    cleanUp();
                }}
            >
                &#10005;
            </button>
            <div className="flex justify-center items-center text-white font-bold">
                {result === 0
                    ? 'TIE'
                    : result === 1
                    ? 'BLACK WON'
                    : 'WHITE WON'}
            </div>
            <div className="flex justify-center gap-4 items-center text-white font-bold">
                <img
                    className="h-16 aspect-square rounded-full"
                    src={`https://cdn.discordapp.com/avatars/${p1.id}/${p1.avatar}.png`}
                />
                <div>
                    <span
                        className={clsx({
                            'text-green-500': result === 1,
                            'text-red-500': result === 2,
                        })}
                    >
                        {score1}
                    </span>{' '}
                    :{' '}
                    <span
                        className={clsx({
                            'text-green-500': result === 2,
                            'text-red-500': result === 1,
                        })}
                    >
                        {score2}
                    </span>
                </div>
                <img
                    className="h-16 aspect-square rounded-full"
                    src={`https://cdn.discordapp.com/avatars/${p2.id}/${p2.avatar}.png`}
                />
            </div>
        </div>
    );
}
