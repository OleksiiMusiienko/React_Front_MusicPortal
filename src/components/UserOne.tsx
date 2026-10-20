import type {User} from '../types/types';

type UserProps = {
  user: User,
  onSelect: (Id: number) => void
}
export const UserOne = ({ user, onSelect }: UserProps) => {
  return (
    <li onClick={() => onSelect(user.id)}>
      {user.name} /
      {user.loginMail} /
      {user.statusAdmin ? "Администратор" : "Пользователь"} /
      {user.register ? "Зарегистрирован" : "Не зарегистрирован"} /
      {user.dateReg}
    </li>
  );
};