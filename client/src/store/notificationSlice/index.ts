import notificationReducer, {
  addNotification,
  removeNotification,
  updateNotification,
} from 'store/notificationSlice/notification.slice';
import Notification from './notification.slice';

export default notificationReducer;
export { addNotification, removeNotification, updateNotification };
export type { Notification };
