import {
  selectIsAuthenticated,
  useAppSelector,
  useGetSessionQuery,
  useLoginMutation,
} from '~/store';

export const useAuth = () => {
  // ToDo: add user loading state
  useGetSessionQuery();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [login, loginState] = useLoginMutation();

  return {
    isAuthenticated,
    login: { login, ...loginState },
  };
};
