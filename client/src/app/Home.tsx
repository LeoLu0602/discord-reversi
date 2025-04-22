import { useNavigate } from 'react-router';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-screen bg-[#302e2b] flex flex-col gap-8 justify-center items-center">
            <h1 className="text-white text-5xl font-bold">Reversi</h1>
            <button
                className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-white py-2 px-4 font-bold rounded-lg"
                onClick={() => {
                    navigate('/game');
                }}
            >
                Quick Game
            </button>
        </div>
    );
}
