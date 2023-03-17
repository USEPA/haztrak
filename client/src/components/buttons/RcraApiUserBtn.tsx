import { Button, ButtonProps } from 'react-bootstrap';
import { useAppSelector } from 'store';
import { RcraProfileState } from 'types/store';

interface HtApiUserBtnProps extends ButtonProps {}

function RcraApiUserBtn(props: HtApiUserBtnProps) {
  const profile = useAppSelector<RcraProfileState>((state) => state.rcraProfile);
  let { children, ...btnProps } = props;
  return (
    <Button {...btnProps} disabled={!profile.apiUser}>
      {props.children}
    </Button>
  );
}

export default RcraApiUserBtn;
