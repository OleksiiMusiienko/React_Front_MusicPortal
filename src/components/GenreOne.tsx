import type {Genre} from '../types/types';

type GenreProps = {
    genre: Genre,
    onSelect: (id: number) => void
}
export default function GenreOne ({genre, onSelect}: GenreProps){
  return(<li onClick={() => onSelect(genre.id)}>
    {genre.name}
  </li>);

}