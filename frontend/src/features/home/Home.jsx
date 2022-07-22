import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getUser } from '../../store';
import { getUser } from '../../app/store';

function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    // get user profile information when the user changes
    dispatch(getUser());
  }, [user]);

  return (
    <div>
      <h1>Hi {user}!</h1>
    </div>
  );
}

export default Home;
