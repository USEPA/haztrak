import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {Placement} from 'react-bootstrap/types';

// see react-bootstrap OverlayTrigger for additional props that could be added
// https://react-bootstrap.github.io/components/overlays/#overlay-trigger-props
interface props {
  text: string;
  children: JSX.Element;
  placement?: Placement;
  defaultShow?: boolean;
}

// renderTooltip function passed to OverlayTrigger's overlay property
const renderTooltip = (text: string) => <Tooltip>{text}</Tooltip>;

function HtTooltip(props: props): JSX.Element {
  return (
    <OverlayTrigger
      {...props}
      delay={{show: 250, hide: 400}}
      overlay={renderTooltip(props.text)}
    >
      {props.children}
    </OverlayTrigger>
  );
}

export default HtTooltip;
