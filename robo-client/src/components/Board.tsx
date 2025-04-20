import clsx from 'clsx';

export default function Board({ board }: { board: number[][] }) {
    return (
        <div className="h-screen aspect-square bg-emerald-500">
            {board.map((row, i) => (
                <div
                    key={i}
                    className={clsx('h-1/8 w-full flex', {
                        'border-b-2': i < board.length - 1,
                    })}
                >
                    {row.map((cell, j) => (
                        <div
                            key={j}
                            className={clsx(
                                'h-full grow cursor-pointer flex justify-center items-center',
                                {
                                    'border-r-2': j < row.length - 1,
                                }
                            )}
                        >
                            {cell === 1 ? (
                                <div className="bg-black w-4/5 h-4/5 rounded-full" />
                            ) : cell === 2 ? (
                                <div className="bg-white w-4/5 h-4/5 rounded-full" />
                            ) : (
                                <></>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
