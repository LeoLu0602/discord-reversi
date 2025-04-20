export default function Scores({
    score1,
    score2,
}: {
    score1: number;
    score2: number;
}) {
    return (
        <div className="w-full h-full flex flex-col justify-between bg-[#262522]">
            <div
                className="w-full bg-red-500 text-white flex justify-center items-center"
                style={{ height: `${(score1 / 64) * 100}%` }}
            />
            <div
                className="w-full bg-blue-500 text-white flex justify-center items-center"
                style={{ height: `${(score2 / 64) * 100}%` }}
            />
        </div>
    );
}
