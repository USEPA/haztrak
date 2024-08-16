import {
  faEllipsisVertical,
  faEye,
  faEyeSlash,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Manifest } from '~/components/Manifest';
import React, { MouseEventHandler, ReactElement, useState } from 'react';
import { Col, Dropdown, Row, useAccordionButton } from 'react-bootstrap';
import { UseFieldArrayReturn } from 'react-hook-form';

interface WasteRowActionProps {
  index: number;
  wasteForm: UseFieldArrayReturn<Manifest, 'wastes'>;
  toggleWLModal: () => void;
  setEditWasteLine: (index: number) => void;
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
 * WasteRowActions - actions for controlling wast lines on a manifest
 * @constructor
 */
function WasteRowActions({
  index,
  wasteForm,
  setEditWasteLine,
  toggleWLModal,
  eventKey,
}: WasteRowActionProps) {
  const [open, setOpen] = useState(false);
  const decoratedOnClick = useAccordionButton(eventKey, () => setOpen(!open));

  const actions: RowDropdownItems[] = [
    {
      text: 'Remove',
      icon: <FontAwesomeIcon icon={faTrash} className="text-danger" />,
      onClick: () => {
        wasteForm.remove(index);
      },
      disabled: false,
      label: `remove waste line ${index}`,
    },
    {
      text: 'Edit',
      icon: <FontAwesomeIcon icon={faPen} className="text-primary" />,
      onClick: () => {
        setEditWasteLine(index);
        toggleWLModal();
      },
      disabled: false,
      label: `edit waste line ${index}`,
    },
    {
      text: open ? 'Close' : 'Details',
      icon: <FontAwesomeIcon icon={open ? faEyeSlash : faEye} className="text-info" />,
      onClick: (event) => {
        decoratedOnClick(event);
      },
      disabled: false,
      label: `view waste line ${index} details`,
    },
  ];

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          title={`transporter ${index + 1} actions`}
          className="bg-transparent border-0 text-dark no-caret justify-content-end"
        >
          <FontAwesomeIcon icon={faEllipsisVertical} className="pe-2 shadow-none" />
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

export { WasteRowActions };
