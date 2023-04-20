import { useTitle } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { RootState, useAppDispatch, useAppSelector } from 'store';
import { getExampleTask } from 'store/notificationSlice/notification.slice';
import { getProfile } from 'store/rcraProfileSlice';
import { UserState } from 'store/userSlice/user.slice';
import { HtButton } from 'components/Ht';

/**
 * Home page for logged-in user, currently does not really include anything
 * @constructor
 */
export function Home(): ReactElement {
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
        onClick={() => {
          dispatch(getExampleTask());
        }}
      >
        Click me
      </HtButton>
    </div>
  );
}
