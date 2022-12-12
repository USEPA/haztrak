import React, { ReactElement, useEffect } from 'react';
import { addMsg, getUser, RootState } from 'store/store';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import useTitle from '../../hooks/useTitle';
import { Button } from 'react-bootstrap';

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
      <Button onClick={() => dispatch(addMsg('test'))}>Click me</Button>
    </div>
  );
}

export default Home;
