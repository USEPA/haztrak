import React, { useEffect } from 'react';
import { getUser, RootState } from 'app/store';
import { useAppDispatch, useAppSelector } from 'app/hooks';

/**
 * Home page for logged in user, currently does not really include anything
 * @returns {JSX.Element}
 * @constructor
 */
function Home() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    // get user profile information when the user changes
    dispatch(getUser());
  }, [user]);

  return (
    <div>
      <h1>Hello {user}!</h1>
    </div>
  );
}

export default Home;
