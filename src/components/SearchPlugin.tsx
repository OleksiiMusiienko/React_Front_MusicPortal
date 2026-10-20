type Props = { onFilter: (text: string) => void }

export const SearchPlugin = ({ onFilter }: Props) => (
  <input placeholder="Поиск" onChange={e => onFilter(e.target.value.trim())} />
);
