import useTitle from 'hooks/useTitle';
import React, { ReactElement, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { addMsg, RootState, useAppDispatch, useAppSelector } from 'store';
import { getProfile } from 'store/rcraProfileSlice/rcraProfile.slice';

/**
 * Home page for logged-in user, currently does not really include anything
 * @constructor
 */
function Home(): ReactElement {
  useTitle(`Haztrak`, false, true);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.rcraProfile);

  useEffect(() => {
    // get user profile information when the user changes
    dispatch(getProfile());
  }, [user]);

  return (
    <div>
      <h1>{`Hello ${user}!`}</h1>
      <Button
        onClick={() =>
          dispatch(
            addMsg({
              uniqueId: Date.now(),
              createdDate: new Date().toISOString(),
              message: 'que paso? blah blah blah',
              alertType: 'Error',
              read: false,
              timeout: 5000,
            })
          )
        }
      >
        Click me
      </Button>
    </div>
  );
}

export default Home;
