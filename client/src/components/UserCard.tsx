import { UserType } from '../app/Activity';
import clsx from 'clsx';

export default function UserCard({
    user,
    isUserTurn,
}: {
    user: UserType;
    isUserTurn: boolean;
}) {
    return (
        <div
            className={clsx(
                'w-full h-24 p-2 bg-[#373633] flex items-center mb-2',
                {
                    'bg-emerald-500': isUserTurn,
                }
            )}
        >
            <img
                className="h-full aspect-square"
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
            />
            <div className="h-full grow px-2">
                <div>{user.global_name}</div>
                <div>1000</div>
            </div>
        </div>
    );
}
