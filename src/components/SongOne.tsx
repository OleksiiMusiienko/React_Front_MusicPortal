import type { Song } from '../types/types';

type SongProps = {
  song: Song;
  onSelect: (id: number) => void;
};

export default function SongOne({ song, onSelect }: SongProps) {

  return (

    <li onClick={() => onSelect(song.id)}>

      {song.name} /
      {song.author} /
      {song.genre}
      <audio
        controls
        src={`http://localhost:5000${song.path}`}
        onClick={(e) => e.stopPropagation()}
      />

    </li>
  );
}