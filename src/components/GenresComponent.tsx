import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchPlugin } from "./SearchPlugin";
import * as api from "../api/genresApi";
import { useEffect, useRef, useState } from "react";
import type { Genre } from "../types/types";
import { AddButton } from "./AddButton";
import { DeleteButton } from "./DeleteButton";
import GenreOne from "./GenreOne";


export default function GenresComponent() {

    const queryClient = useQueryClient();

    const { data: genres = [] } = useQuery({
        queryKey: ['genres'],
        queryFn: api.getGenres
    });

    const idRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);

    const [filtered, setFiltered] = useState<Genre[]>([]);

    const list = filtered.length ? filtered : genres;

    const [selected, setSelected] = useState<Genre | null>(null);

    useEffect(() => {
        if (selected) {
            if (idRef.current) idRef.current.value = String(selected.id);
            if (nameRef.current) nameRef.current.value = selected.name;
        }
    }, [selected])

    const filter = (text: string) => {
        const re = new RegExp('^' + text, 'i');
        setFiltered(genres.filter(u => re.test(u.name)));
    }
    const selectGenre = async (id: number) => {
        try {
            const genre = await api.getGenre(id);
            setSelected(genre);
        } catch (error) {
            console.error("Жанр не найден!", error);
            alert("Не удалось загрузить данные.");
        }
    }

    const clearForm = () => {
        if (idRef.current) idRef.current.value = '';
        if (nameRef.current) nameRef.current.value = '';
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
    queryClient.invalidateQueries({ queryKey: ['genres'] });
  }

    const addGenre = async() => {
  try {
      if (!selected) {
        await api.addGenre({
          name: nameRef.current!.value,
        });
      } else {
        alert("Жанр есть в базе данных!");
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

    const deleteGenre = async () =>{
         if (selected) {
              if (!confirm('Удалить жанр?')) return;
              await api.deleteGenre(Number(idRef.current!.value));
            }
            clearForm();
            refresh();
    }

    return (
        <div className="formDiv">
            <SearchPlugin onFilter={filter} />
            <ul >
                {list.map(genre => (
                    <GenreOne
                        key={genre.id}
                        genre={genre}
                        onSelect={selectGenre}
                    />
                ))}
            </ul>
            <input type="hidden" ref={idRef} />
            <input placeholder="Имя" ref={nameRef} />

            <AddButton onAdd={addGenre}></AddButton>
            <DeleteButton onDelete={deleteGenre}></DeleteButton>

        </div>
    );
}