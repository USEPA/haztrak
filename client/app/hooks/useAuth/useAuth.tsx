import { selectCurrentUser, useAppSelector, useLoginMutation } from '~/store';

export const useAuth = () => {
  const user = useAppSelector(selectCurrentUser);
  const [login, loginState] = useLoginMutation();

  return {
    user,
    login: { login, ...loginState },
  };
};
