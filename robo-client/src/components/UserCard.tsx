import { UserType } from '../app/Activity';

export default function UserCard({ user }: { user: UserType }) {
    return (
        <div className="w-full h-24 p-2 bg-[#373633] flex items-center mb-2">
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
