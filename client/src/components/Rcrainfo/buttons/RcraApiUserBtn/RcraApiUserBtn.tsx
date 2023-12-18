import { Button, ButtonProps } from 'react-bootstrap';
import { useGetProfileQuery } from 'store';

interface HtApiUserBtnProps extends ButtonProps {}

/**
 * A button that is disabled if the user Organization is not set up to interface with
 * RCRAInfo/e-Manifest or disabled prop is passed
 * @constructor
 */
export function RcraApiUserBtn({ children, ...props }: HtApiUserBtnProps) {
  const { rcrainfoIntegrated } = useGetProfileQuery(undefined, {
    selectFromResult: ({ data }) => ({ rcrainfoIntegrated: data?.org?.rcrainfoIntegrated }),
  });
  const active = !props.disabled && rcrainfoIntegrated;

  return (
    <>
      <Button {...props} disabled={!active}>
        {children}
      </Button>
    </>
  );
}
