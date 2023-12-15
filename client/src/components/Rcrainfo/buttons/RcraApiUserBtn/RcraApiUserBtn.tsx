import { Button, ButtonProps } from 'react-bootstrap';
import { selectHaztrakProfile, useAppSelector } from 'store';

interface HtApiUserBtnProps extends ButtonProps {}

/**
 * A button that is disabled if the user Organization is not set up to interface with
 * RCRAInfo/e-Manifest or disabled prop is passed
 * @constructor
 */
export function RcraApiUserBtn({ children, ...props }: HtApiUserBtnProps) {
  const profile = useAppSelector(selectHaztrakProfile);
  const active = !props.disabled && profile.org?.rcrainfoIntegrated;

  return (
    <>
      <Button {...props} disabled={!active}>
        {children}
      </Button>
    </>
  );
}
