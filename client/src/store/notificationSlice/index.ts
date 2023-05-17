import notificationReducer, {
  addNotification,
  removeNotification,
  updateNotification,
  selectNotifications,
} from 'store/notificationSlice/notification.slice';
import Notification from './notification.slice';

export default notificationReducer;
export { addNotification, removeNotification, updateNotification, selectNotifications };
export type { Notification };
