import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { TooltipProps } from 'react-bootstrap';
import { ReactElement } from 'react';

// see react-bootstrap OverlayTrigger for additional props that could be added
// https://react-bootstrap.github.io/components/overlays/#overlay-trigger-props
interface HtToolTipProps extends TooltipProps {
  text: string;
  children: ReactElement;
}

// renderTooltip function passed to OverlayTrigger's overlay property
const renderTooltip = (text: string) => <Tooltip>{text}</Tooltip>;

function HtTooltip(props: HtToolTipProps): ReactElement {
  // create copy of props intended for the OverlayTrigger
  const overlayProps = (({ text, children, ...props }: HtToolTipProps) => props)(props);
  return (
    <OverlayTrigger
      {...overlayProps}
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip(props.text)}
    >
      {props.children}
    </OverlayTrigger>
  );
}

interface InfoTooltipProps {
  message: string;
}

/**
 * Returns an info icon with a tooltip message
 * that explains that this Field is set by EPA's RCRAInfo.
 * @constructor
 */
function InfoIconTooltip({ message }: InfoTooltipProps) {
  return (
    <HtTooltip text={message}>
      <FontAwesomeIcon icon={faInfoCircle} size={'1x'} className={'pb-1 text-muted'} />
    </HtTooltip>
  );
}

export default HtTooltip;
export { InfoIconTooltip };
