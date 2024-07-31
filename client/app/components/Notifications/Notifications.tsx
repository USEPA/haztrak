import { ProgressTracker } from 'components/Notifications/ProgressTracker';
import { LongRunningTask, selectAllTasks, useAppSelector } from 'store';

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
