import { faEllipsisVertical, faEye, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEventHandler, ReactElement } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface MtnRowActionsProps {
  mtn: string;
}

interface RowDropdownItems {
  text: string;
  icon: ReactElement;
  onClick: MouseEventHandler<HTMLElement>;
  disabled: boolean;
  label: string;
}

export function MtnRowActions({ mtn }: MtnRowActionsProps) {
  const navigate = useNavigate();

  const actions: RowDropdownItems[] = [
    {
      text: 'View ',
      icon: <FontAwesomeIcon icon={faEye} className="text-primary" />,
      onClick: () => {
        navigate(`./${mtn}/view`);
      },
      disabled: false,
      label: 'View',
    },
    {
      text: 'Edit',
      icon: <FontAwesomeIcon icon={faPen} className="text-primary" />,
      onClick: () => {
        navigate(`./${mtn}/edit`);
      },
      disabled: false,
      label: 'Edit',
    },
  ];

  return (
    <div className="d-flex justify-content-evenly">
      <Dropdown>
        <Dropdown.Toggle
          title={`${mtn} actions`}
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
    </div>
  );
}
