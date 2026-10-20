import { AddButton } from "../components/AddButton"
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { UserOne } from "./UserOne";
import type { User } from "../types/types"
import { useRef, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/usersApi"
import { SearchPlugin } from "./SearchPlugin";


export default function UserComponent() {
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers
  });

  const idRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const loginRef = useRef<HTMLInputElement>(null);
  const statusAdminRef = useRef<HTMLSelectElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfRef = useRef<HTMLInputElement>(null);
  const registerStatusRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  // список для фильтра (как в оригинале)
  const [filtered, setFiltered] = useState<User[]>([]);

  // текущий список для отображения
  const list = filtered.length ? filtered : users;

  // выбранный пользователь
  const [selected, setSelected] = useState<User | null>(null);

  useEffect(() => {
    if (selected) {
      if (idRef.current) idRef.current.value = String(selected.id);
      if (nameRef.current) nameRef.current.value = selected.name;
      if (loginRef.current) loginRef.current.value = selected.loginMail;
      if (statusAdminRef.current) {statusAdminRef.current.value = selected.statusAdmin ? "true" : "false";}     
      if (registerStatusRef.current)
        registerStatusRef.current.value = selected.register ? "Зарегистрирован" : "Требует подтверждения";
      if (dateRef.current)
        dateRef.current.value = selected.dateReg || '';
    }
  }, [selected]);

  const filter = (text: string) => {
    const re = new RegExp('^' + text, 'i');
    setFiltered(users.filter(u => re.test(u.name)));
  }
  const selectUser = async (Id: number) => {
    try {
      const user = await api.getUser(Id);
      setSelected(user);
    } catch (error) {
      console.error("Пользователь не найден!", error);
      alert("Не удалось загрузить данные пользователя.");
    }
  }


  const clearForm = () => {
    if (idRef.current) idRef.current.value = '';
    if (nameRef.current) nameRef.current.value = '';
    if (loginRef.current) loginRef.current.value = '';
    if (passwordRef.current) passwordRef.current.value = '';
    if (passwordConfRef.current) passwordConfRef.current.value = '';
    if (statusAdminRef.current) statusAdminRef.current.value = '';
    if (registerStatusRef.current) registerStatusRef.current.value = '';
    if (dateRef.current) dateRef.current.value = '';
    setSelected(null);
  }
  const refresh = () => {
    setFiltered([]);
    // Помечает один или несколько запросов как устаревшие (stale), 
    // чтобы при следующем их использовании TanStack Query инициировал 
    // повторный запрос данных с сервера и обновил кэш, обеспечивая 
    // актуальность информации. 
    // Это ключевой механизм для инвалидации кэша после мутаций 
    // (создания/изменения/удаления данных). 
    queryClient.invalidateQueries({ queryKey: ['users'] });
  }

  const addUser = async () => {
    try {
      if (!selected) {
        await api.addUser({
          name: nameRef.current!.value,
          loginMail: loginRef.current!.value,
          password: passwordRef.current!.value,
          passwordConfirm: passwordConfRef.current!.value,
          statusAdmin: false,
          register: true,
          dateReg: dateRef.current!.value
        });
      } else {
        alert("Пользователь есть в базе данных!");
      }
    }
    catch (error: any) {
      // 1. Проверяем наличие ответа от сервера
      if (error.response && error.response.data) {
        const data = error.response.data;

        // 2. Обработка стандартных ошибок валидации ASP.NET (объект errors)
        if (data.errors) {
          // Превращаем объект ошибок в плоский массив сообщений и объединяем через перенос строки
          const messages = Object.values(data.errors).flat().join('\n');
          alert("Ошибка валидации:\n" + messages);
        }
        // 3. Если сервер прислал просто текстовое сообщение
        else if (typeof data === 'string') {
          alert(data);
        }
        // 4. Запасной вариант (заголовок ошибки)
        else if (data.title) {
          alert(data.title);
        }
      } else {
        alert("Произошла ошибка: " + error.message);
      }
    }
    clearForm();
    refresh();
  }

  const editUser = async () => {

    try {
      if (!selected) {
        alert("Сначала выберите пользователя из списка!");
        return;
      } else {

        await api.editUser({
          id: selected.id,
          name: nameRef.current?.value || selected.name,
          loginMail: loginRef.current?.value || selected.loginMail,
          statusAdmin: statusAdminRef.current?.value === "true",
          password: passwordRef.current!.value,
          passwordConfirm: passwordConfRef.current!.value,
          register: statusAdminRef.current?.value === "true",
          dateReg: selected.dateReg
        });
      }
    }
    catch (error: any) {
      // 1. Проверяем наличие ответа от сервера
      if (error.response && error.response.data) {
        const data = error.response.data;

        // 2. Обработка стандартных ошибок валидации ASP.NET (объект errors)
        if (data.errors) {
          // Превращаем объект ошибок в плоский массив сообщений и объединяем через перенос строки
          const messages = Object.values(data.errors).flat().join('\n');
          alert("Ошибка валидации:\n" + messages);
        }
        // 3. Если сервер прислал просто текстовое сообщение
        else if (typeof data === 'string') {
          alert(data);
        }
        // 4. Запасной вариант (заголовок ошибки)
        else if (data.title) {
          alert(data.title);
        }
      } else {
        alert("Произошла ошибка: " + error.message);
      }
    }
    clearForm();
    refresh();
  }

  const deleteUser = async () => {
    if (selected) {
      if (!confirm('Вы действительно желаете удалить пользователя?')) return;
      await api.deleteUser(Number(idRef.current!.value));
    }
    clearForm();
    refresh();
  }
//пароль с базы возвращается в зашифроваом виде, поэтому нам следует устанавливать каждый раз новый, вопрос преподавателю

  return (

    <div className="formDiv">
      <SearchPlugin onFilter={filter} />
      <ul >
        {list.map(user => (
          <UserOne
            key={user.id} //важен в самом реакте как уникальный ключ при работе с бд, это используется реактом
            user={user}
            onSelect={selectUser}
          />
        ))}
      </ul>
      <input type="hidden" ref={idRef} />
      <input placeholder="Имя" ref={nameRef} />
      <input placeholder="Логин" ref={loginRef} type="email" />      
      <input type="password" placeholder="Пароль" ref={passwordRef}/>
      <input type="password" placeholder="Подтверждение пароля" ref={passwordConfRef} />
      {selected && <select key = {selected.id} ref={statusAdminRef} defaultValue={selected.statusAdmin ? "true" : "false"}>
        <option value="false">Пользователь</option>
        <option value="true">Администратор</option>
      </select>}
      <input placeholder="Статус регистрации" disabled={true} ref={registerStatusRef} defaultValue={"Зарегистрирован"} />
      <input placeholder="Дата регистрации" disabled={true} ref={dateRef} />
      
      <AddButton onAdd={addUser}></AddButton>
      <EditButton onEdit={editUser} ></EditButton>
      <DeleteButton onDelete={deleteUser}></DeleteButton>
      <p>Для изменения статуса пользователя укажите Пользователь или Администратор</p>

    </div>
  );
}