import { faEllipsisVertical, faEye, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEventHandler, ReactElement } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface SiteTableRowActionsProps {
  siteId: string;
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
export function SiteListItemActions({ siteId }: SiteTableRowActionsProps) {
  const navigate = useNavigate();

  const actions: RowDropdownItems[] = [
    {
      text: 'View Site',
      icon: <FontAwesomeIcon icon={faEye} className="text-primary" />,
      onClick: () => {
        navigate(`/site/${siteId}`);
      },
      disabled: false,
      label: 'View Site',
    },
    {
      text: 'View Manifests',
      icon: <FontAwesomeIcon icon={faFileLines} className="text-primary" />,
      onClick: () => {
        navigate(`/site/${siteId}/manifest`);
      },
      disabled: false,
      label: 'View Site Manifests',
    },
  ];

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          title={`${siteId} actions`}
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
