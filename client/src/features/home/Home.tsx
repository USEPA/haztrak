import React, { ReactElement, useEffect } from 'react';
import { getUser, RootState } from 'redux/store';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import useTitle from '../../hooks/useTitle';

/**
 * Home page for logged-in user, currently does not really include anything
 * @constructor
 */
function Home(): ReactElement {
  useTitle(`Haztrak`, false, true);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    // get user profile information when the user changes
    dispatch(getUser());
  }, [user]);

  return (
    <div>
      <h1>{`Hello ${user}!`}</h1>
    </div>
  );
}

export default Home;
