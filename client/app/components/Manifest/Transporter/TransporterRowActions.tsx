import React, { MouseEventHandler, ReactElement, useState } from 'react';
import { Col, Dropdown, Row, useAccordionButton } from 'react-bootstrap';
import { UseFieldArrayRemove, UseFieldArraySwap } from 'react-hook-form';
import { FaArrowDown, FaArrowUp, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa';
import { FaEllipsisVertical } from 'react-icons/fa6';

interface TranRowActionProps {
  index: number;
  length: number;
  removeTransporter: UseFieldArrayRemove;
  swapTransporter: UseFieldArraySwap;
  eventKey: string;
}

interface RowDropdownItems {
  text: string;
  icon: ReactElement;
  onClick: MouseEventHandler<HTMLElement>;
  disabled: boolean;
  label: string;
}

/**
 * TransporterRowActions uses index and length to disable and display
 * different actions for eah row, expected to be part of a mapped table or list.
 * @constructor
 */
export function TransporterRowActions({
  index,
  removeTransporter,
  swapTransporter,
  length,
  eventKey,
}: TranRowActionProps) {
  const isFirst = index === 0;
  const isLast = index + 1 === length;
  const [open, setOpen] = useState(false);
  const decoratedOnClick = useAccordionButton(eventKey, () => setOpen(!open));

  const actions: RowDropdownItems[] = [
    {
      text: 'Move up',
      icon: <FaArrowUp className={isFirst ? 'text-secondary' : 'text-primary'} />,
      onClick: () => {
        swapTransporter(index, index - 1);
      },
      disabled: isFirst,
      label: `move transporter ${index + 1} up`,
    },
    {
      text: 'Move Down',
      icon: <FaArrowDown className={isLast ? 'text-secondary' : 'text-primary'} />,
      onClick: () => {
        swapTransporter(index, index + 1);
      },
      disabled: isLast,
      label: `move transporter ${index + 1} down`,
    },
    {
      text: 'Remove',
      icon: <FaTrash className="text-danger" />,
      onClick: () => {
        removeTransporter(index);
      },
      disabled: false,
      label: `remove transporter ${index + 1}`,
    },
    {
      text: open ? 'Close' : 'Details',
      icon: open ? <FaEyeSlash /> : <FaEye />,
      onClick: (event) => {
        decoratedOnClick(event);
      },
      disabled: false,
      label: `View transporter ${index + 1} details`,
    },
  ];

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          title={`transporter ${index + 1} actions`}
          className="bg-transparent border-0 text-dark no-caret justify-content-end"
        >
          <FaEllipsisVertical className="pe-2 shadow-none" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {actions.map((action, i) => {
            return (
              <Dropdown.Item
                key={i}
                disabled={action.disabled}
                onClick={action.onClick}
                title={action.label}
              >
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
