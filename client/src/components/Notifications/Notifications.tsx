import { ProgressTracker } from 'components/Notifications/ProgressTracker';
import { useAppSelector } from 'store';
import { LongRunningTask, selectAllTasks } from 'store/notification.slice';

export function Notifications() {
  const tasks: LongRunningTask[] = useAppSelector(selectAllTasks);
  return (
    <>
      {tasks.map((task) => (
        <ProgressTracker task={task} key={task.taskId} />
      ))}
    </>
  );
}
