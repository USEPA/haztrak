import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactElement } from 'react';
import { OverlayTrigger, Tooltip, TooltipProps } from 'react-bootstrap';

// see react-bootstrap OverlayTrigger for additional props that could be added
// https://react-bootstrap.github.io/components/overlays/#overlay-trigger-props
interface HtToolTipProps extends TooltipProps {
  text: string;
  children: ReactElement;
}

export function HtTooltip(props: HtToolTipProps): ReactElement {
  const { children, text, ...rest } = props;
  return (
    <OverlayTrigger {...rest} delay={{ show: 250, hide: 400 }} overlay={<Tooltip>{text}</Tooltip>}>
      {children}
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
export function InfoIconTooltip({ message }: InfoTooltipProps) {
  return (
    <HtTooltip text={message}>
      <FontAwesomeIcon icon={faInfoCircle} size={'2xs'} className={'pb-1 text-muted'} />
    </HtTooltip>
  );
}
