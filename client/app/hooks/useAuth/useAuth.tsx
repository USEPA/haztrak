import {
  selectIsAuthenticated,
  useAppSelector,
  useGetSessionQuery,
  useLoginMutation,
} from '~/store';

export const useAuth = () => {
  const { isLoading } = useGetSessionQuery();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [login, loginState] = useLoginMutation();

  return {
    isAuthenticated,
    isLoading,
    login: { login, ...loginState },
  };
};
