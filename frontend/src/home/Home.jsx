import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../store';

function Home() {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.user);

  useEffect(() => {
    // get user profile information first time login redirects to home page
    dispatch(getUser());
  }, []);

  return (
    <div>
      <h1>Hi {user}!</h1>
    </div>
  );
}

export default Home;
