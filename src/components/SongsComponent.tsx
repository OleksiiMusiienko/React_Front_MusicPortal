import { SearchPlugin } from "./SearchPlugin";
import { AddButton } from "./AddButton";
import { EditButton } from "./EditButton";
import { DeleteButton } from "./DeleteButton";
import SongOne from "./SongOne";

import type { Song } from "../types/types";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/songsApi";
import * as apiGenres from "../api/genresApi";

import { useRef, useState, useEffect } from "react";


export default function SongsComponent() {

  const queryClient = useQueryClient();

  const { data: songs = [] } = useQuery({
    queryKey: ['songs'],
    queryFn: api.getSongs
  });

  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: apiGenres.getGenres
  })


  const idRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  // const pathRef = useRef<HTMLInputElement>(null);
  const genreIdRef = useRef<HTMLSelectElement>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const [filtered, setFiltered] = useState<Song[]>([]);

  const list = filtered.length ? filtered : songs;

  const [selected, setSelected] = useState<Song | null>(null);

  useEffect(() => {

    if (selected) {

      if (idRef.current) idRef.current.value = String(selected.id);
      if (nameRef.current) nameRef.current.value = selected.name;
      if (authorRef.current) authorRef.current.value = selected.author;
      if (genreIdRef.current) genreIdRef.current.value = String(selected.genreId);
    }

  }, [selected]);

  const filter = (text: string) => {
    const re = new RegExp('^' + text, 'i');
    setFiltered(songs.filter(song => re.test(song.name)));
  };

  const selectSong = async (id: number) => {

    try {

      const song = await api.getSong(id);
      setSelected(song);

    }
    catch (error) {

      console.error("Песня не найдена", error);
      alert("Не удалось загрузить песню");
    }
  };

  const clearForm = () => {

    if (idRef.current) idRef.current.value = '';
    if (nameRef.current) nameRef.current.value = '';
    if (authorRef.current) authorRef.current.value = '';
    if (fileRef.current) fileRef.current.value = '';
    if (genreIdRef.current) genreIdRef.current.value = '';
    setSelected(null);
  };

  const refresh = () => {

    setFiltered([]);
    queryClient.invalidateQueries({
      queryKey: ['songs']
    });
  };

  const addSong = async () => {

    if (selected) {
      alert("Песня уже добавлена");
      return;
    }
    const file = fileRef.current?.files?.[0];

    if (!file) {
      alert("Выберите файл");
      return;
    }

    const genreId = Number(genreIdRef.current?.value);

    const selectedGenre = genres.find(genre => genre.id === genreId);

    if (!selectedGenre) {
      alert("Выберите жанр");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", nameRef.current!.value);
      formData.append("author", authorRef.current!.value);
      formData.append("genreId", String(genreId));
      formData.append("genre", selectedGenre.name);
      formData.append("file", file);

      await api.addSong(formData);

      clearForm();
      refresh();

    }
    catch (error: any) {

      showError(error);
    }
  };

  const editSong = async () => {

    if (!selected) {

      alert("Сначала выберите песню!");

      return;
    }

    try {

      await api.editSong({

        id: selected.id,

        name: nameRef.current!.value,

        author: authorRef.current!.value,

        path: selected.path,

        genreId: Number(genreIdRef.current!.value)
      });

    }
    catch (error: any) {

      showError(error);

      return;
    }

    clearForm();

    refresh();
  };

  const deleteSong = async () => {

    if (!selected) {

      alert("Сначала выберите песню!");

      return;
    }

    if (!confirm("Вы действительно хотите удалить песню?"))
      return;

    try {

      await api.deleteSong(selected.id);

    }
    catch (error: any) {

      showError(error);

      return;
    }

    clearForm();

    refresh();
  };

  const showError = (error: any) => {

    if (error.response && error.response.data) {

      const data = error.response.data;

      if (data.errors) {

        const messages = Object.values(data.errors)
          .flat()
          .join('\n');

        alert("Ошибка валидации:\n" + messages);

      }
      else if (typeof data === 'string') {

        alert(data);

      }
      else if (data.title) {

        alert(data.title);
      }

    }
    else {

      alert("Произошла ошибка: " + error.message);
    }
  };

  return (

    <div className="formDiv">

      <SearchPlugin onFilter={filter} />

      <ul>
        {list.map(song => (

          <SongOne
            key={song.id}
            song={song}
            onSelect={selectSong}
          />
        ))}
      </ul>

      <input
        type="hidden"
        ref={idRef}
      />
      <input
        placeholder="Название"
        ref={nameRef}
      />
      <input
        placeholder="Автор"
        ref={authorRef}
      />
      <input
        type="file"
        accept=".mp3,audio/*"
        placeholder="Файл mp3"
        ref={fileRef}
      />
      <select ref={genreIdRef} defaultValue="">
        <option value="" disabled>
          Выберите жанр
        </option>

        {genres.map(genre => (
          <option
            key={genre.id}
            value={genre.id}
          >
            {genre.name}
          </option>
        ))}
      </select>

      <AddButton onAdd={addSong} />
      <EditButton onEdit={editSong} />
      <DeleteButton onDelete={deleteSong} />

    </div>
  );
}