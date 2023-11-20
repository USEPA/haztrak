import { Notification } from 'components/Notifications/Notification';
import { useAppSelector } from 'store';
import { LongRunningTask, selectAllTasks } from 'store/notification.slice';

export function Notifications() {
  const tasks: LongRunningTask[] = useAppSelector(selectAllTasks);
  return (
    <>
      {tasks.map((task) => (
        <Notification task={task} key={task.taskId} />
      ))}
    </>
  );
}
