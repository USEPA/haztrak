import { Button, ButtonProps } from 'react-bootstrap';
import { selectHaztrakProfile, useAppSelector } from 'store';

interface HtApiUserBtnProps extends ButtonProps {}

/**
 * A button that is disabled if the user Organization is not set up to interface with
 * RCRAInfo/e-Manifest or disabled prop is passed
 * @constructor
 */
export function RcraApiUserBtn(props: HtApiUserBtnProps) {
  const profile = useAppSelector(selectHaztrakProfile);
  let { children, ...btnProps } = props;
  const active = !btnProps.disabled && profile.org?.rcrainfoIntegrated;

  return (
    <Button {...btnProps} disabled={!active}>
      {props.children}
    </Button>
  );
}
