import useTitle from 'hooks/useTitle';
import React, { ReactElement, useEffect } from 'react';
import { addMsg, RootState, useAppDispatch, useAppSelector } from 'store';
import { getProfile } from 'store/rcraProfileSlice/rcraProfile.slice';
import { UserState } from 'types/store';
import { HtButton } from 'components/Ht';

/**
 * Home page for logged-in user, currently does not really include anything
 * @constructor
 */
function Home(): ReactElement {
  useTitle(`Haztrak`, false, true);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector<UserState>((state: RootState) => state.user);

  useEffect(() => {
    // get user profile information when the user changes
    dispatch(getProfile());
  }, [user]);

  return (
    <div>
      <h1>{`Hello ${user}!`}</h1>
      <HtButton
        align="start"
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
      </HtButton>
    </div>
  );
}

export default Home;
