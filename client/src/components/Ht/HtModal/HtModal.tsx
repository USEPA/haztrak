import React, { ReactElement } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalHeaderProps,
  ModalProps,
  ModalTitle,
} from 'react-bootstrap';

interface HtModalProps extends ModalProps {
  showModal: boolean;
  handleClose: () => void;
  className?: string;
}

interface HtModalTitleProps extends ModalHeaderProps {
  title: string;
}

interface HtModalHeaderProps extends ModalHeaderProps {
  closeButton?: boolean;
  children: ReactElement;
}

/**
 * Modal with haztrak styling
 * @param {{ showModal: boolean, handleClose: () => void, className?: string, children: ReactElement }} props react props
 * @constructor
 * @example
 * <HtModal showModal={true} handleClose={() => {...}}>
 *  <HtModal.Title title='sample title' />
 * </HtModal>
 */
function HtModal({
  showModal,
  handleClose,
  className,
  children,
  ...otherProps
}: HtModalProps): ReactElement {
  const baseAttributes = `bg-transparent ${className ? className : ''}`;
  return (
    <Modal show={showModal} onHide={handleClose} className={baseAttributes} {...otherProps}>
      {children}
    </Modal>
  );
}

/**
 * Modal Title for haztrak which acts as wrapper around react-bootstrap Modal Title
 * @param {{title: string}} props react props
 * @constructor
 * @example
 * <HtModal.Title title='sample title' />
 */
HtModal.Title = function ({ title, ...otherProps }: HtModalTitleProps): ReactElement {
  return <ModalTitle {...otherProps}>{title}</ModalTitle>;
};

/**
 * Modal Header for haztrak which acts as wrapper around react-bootstrap Modal Header
 * @param {{closeButton: boolean, children: ReactElement}} props react props
 * @constructor
 * @example
 * <HtModal.Header closeButton={true}>{children}</HtModal.Header>
 */
HtModal.Header = function ({
  closeButton,
  children,
  ...otherProps
}: HtModalHeaderProps): ReactElement {
  return (
    <ModalHeader closeButton={closeButton} {...otherProps}>
      {children}
    </ModalHeader>
  );
};

/**
 * Modal Body for haztrak which acts as wrapper around react-bootstrap Modal Body
 * @param {{children: ReactElement}} props react props
 * @constructor
 * @example
 * <HtModal.Body>{children}</HtModal.Body>
 */
HtModal.Body = function (props: ModalProps): ReactElement {
  return <ModalBody {...props}>{props.children}</ModalBody>;
};

/**
 * Modal Footer for haztrak which acts as wrapper around react-bootstrap Modal Footer
 * @param {{children: ReactElement}} props react props
 * @constructor
 * @example
 * <HtModal.Footer>{children}</HtModal.Footer>
 */
HtModal.Footer = function (props: ModalProps): ReactElement {
  return <ModalFooter {...props}>{props.children}</ModalFooter>;
};

export default HtModal;
