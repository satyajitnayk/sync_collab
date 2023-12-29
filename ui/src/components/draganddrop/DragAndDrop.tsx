import { Status } from '../../interfaces';
import { ContainerCards } from './ContainerCards';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { data } from '../../assets';

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
      {projectStatuses.map((container) => (
        <ContainerCards
          items={listItems}
          status={container}
          key={container}
          isDragging={isDragging}
          handleDragging={handleDragging}
          handleUpdateList={handleUpdateList}
        />
      ))}
    </div>
  );
};
