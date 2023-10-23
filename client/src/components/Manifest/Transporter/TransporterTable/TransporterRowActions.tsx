import {
  faArrowDown,
  faArrowUp,
  faEllipsisVertical,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEventHandler, ReactElement } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { UseFieldArrayRemove, UseFieldArraySwap } from 'react-hook-form';

interface TranRowActionProps {
  index: number;
  length: number;
  removeTransporter: UseFieldArrayRemove;
  swapTransporter: UseFieldArraySwap;
}

interface RowDropdownItems {
  text: string;
  icon: ReactElement;
  onClick: MouseEventHandler<HTMLElement>;
  disabled: boolean;
}

/**
 * TransporterRowActions uses index and length to disable and display
 * different actions for eah row, expected to be part of a mapped table or list.
 * @constructor
 */
function TransporterRowActions({
  index,
  removeTransporter,
  swapTransporter,
  length,
}: TranRowActionProps) {
  const isFirst = index === 0;
  const isLast = index + 1 === length;

  const actions: RowDropdownItems[] = [
    {
      text: 'Move up',
      icon: (
        <FontAwesomeIcon icon={faArrowUp} className={isFirst ? 'text-secondary' : 'text-primary'} />
      ),
      onClick: () => {
        swapTransporter(index, index - 1);
      },
      disabled: isFirst,
    },
    {
      text: 'Move Down',
      icon: (
        <FontAwesomeIcon
          icon={faArrowDown}
          className={isLast ? 'text-secondary' : 'text-primary'}
        />
      ),
      onClick: () => {
        swapTransporter(index, index + 1);
      },
      disabled: isLast,
    },
    {
      text: 'Remove',
      icon: <FontAwesomeIcon icon={faTrash} className="text-danger" />,
      onClick: () => {
        removeTransporter(index);
      },
      disabled: false,
    },
  ];

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle className="bg-transparent border-0 text-dark no-caret justify-content-end">
          <FontAwesomeIcon icon={faEllipsisVertical} className="pe-2 shadow-none" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {actions.map((action, i) => {
            return (
              <Dropdown.Item key={i} disabled={action.disabled} onClick={action.onClick}>
                <Row>
                  <Col xs={2}>{action.icon}</Col>
                  <Col xs={10}>
                    <span>{action.text}</span>
                  </Col>
                </Row>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export { TransporterRowActions };
