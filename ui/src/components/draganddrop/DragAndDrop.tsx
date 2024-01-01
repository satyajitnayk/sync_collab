import { Status } from '../../interfaces';
import { ContainerCards } from './ContainerCards';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { data } from '../../assets';
import '../../css/DragAndDrop.css';

const projectStatuses: Status[] = [
  'New',
  'Backlog',
  'Spike',
  'Ready',
  'Progress',
  'In review',
  'Done',
  'Released',
];

export const DragAndDrop = () => {
  const { isDragging, listItems, handleDragging, handleUpdateList } =
    useDragAndDrop(data);
  return (
    <div className="dnd-grid">
      {projectStatuses.map((status) => (
        <ContainerCards
          items={listItems}
          status={status}
          key={status}
          isDragging={isDragging}
          handleDragging={handleDragging}
          handleUpdateList={handleUpdateList}
        />
      ))}
    </div>
  );
};
