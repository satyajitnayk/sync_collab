import { Data, Status } from '../../interfaces';
import { CardItem } from './CardItem';

interface Props {
  status: Status;
  items: Data[];
  isDragging: boolean;
  handleDragging: (dragging: boolean) => void;
  handleUpdateList: (id: number, status: Status) => void;
}

export const ContainerCards = ({
  status,
  items = [],
  handleDragging,
  isDragging,
  handleUpdateList,
}: Props) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleUpdateList(+e.dataTransfer.getData('text'), status);
    handleDragging(false);
  };

  return (
    <div
      className={`container-cards ${isDragging ? 'layout-dragging' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p>{status}</p>
      {items.map(
        (item) =>
          status === item.status && (
            <CardItem
              data={item}
              key={item.id}
              handleDragging={handleDragging}
            />
          )
      )}
    </div>
  );
};
