import { Button, ButtonProps } from 'react-bootstrap';
import { useAppSelector } from 'store';
import { selectRcraProfile } from 'store/rcraProfileSlice';

interface HtApiUserBtnProps extends ButtonProps {}

/**
 * A wrapper around button that is disabled if the user does not have
 * the appropriate permissions to launch tasks that interface with RCRAInfo/e-Manifest
 *
 * The permissions are determined in a user's RcraProfile redux store
 * @constructor
 */
export function RcraApiUserBtn(props: HtApiUserBtnProps) {
  const profile = useAppSelector(selectRcraProfile);
  let { children, ...btnProps } = props;
  // In order for the button to be active,
  // the disabled prop needs to be falsy AND the user needs to be an API user
  const active = !btnProps.disabled && profile.apiUser;

  return (
    <Button {...btnProps} disabled={!active}>
      {props.children}
    </Button>
  );
}
