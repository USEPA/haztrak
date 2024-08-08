import { selectCurrentUser, useAppSelector, useGetUserQuery, useLoginMutation } from '~/store';

export const useAuth = () => {
  useGetUserQuery();
  const user = useAppSelector(selectCurrentUser);
  const [login, loginState] = useLoginMutation();

  return {
    user,
    login: { login, ...loginState },
  };
};
