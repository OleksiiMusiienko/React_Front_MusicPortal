export const DeleteButton = ({onDelete: onDelete}: {onDelete: () => void}) => (
    <button onClick={onDelete}>Удалить</button>
);