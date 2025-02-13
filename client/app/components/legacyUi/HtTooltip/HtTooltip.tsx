import { ReactElement, Ref, forwardRef } from 'react';
import { OverlayTrigger, Tooltip, TooltipProps } from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa';

// see react-bootstrap OverlayTrigger for additional props that could be added
// https://react-bootstrap.github.io/components/overlays/#overlay-trigger-props
interface HtToolTipProps extends TooltipProps {
  text: string;
  children: ReactElement;
}

export const HtTooltip = forwardRef<Ref<any>, HtToolTipProps>((props, _ref) => {
  const { children, text, ...rest } = props;
  return (
    <OverlayTrigger {...rest} delay={{ show: 250, hide: 400 }} overlay={<Tooltip>{text}</Tooltip>}>
      {children}
    </OverlayTrigger>
  );
});

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
      <FaInfoCircle size={12} className="text-muted tw-inline tw-align-top " />
    </HtTooltip>
  );
}
