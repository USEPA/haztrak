import userReducer, {
  login,
  selectUserName,
  selectUser,
  selectUserState,
} from 'store/authSlice/auth.slice';
import { HaztrakUser } from 'store/authSlice/auth.slice';

export default userReducer;
export { login, selectUserName, selectUser, selectUserState };
export type { HaztrakUser };
