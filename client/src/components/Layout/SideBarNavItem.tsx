import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import React, { ReactNode } from 'react';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface NavItemProps extends FontAwesomeIconProps {
  to: string;
  text?: string;
  targetBlank?: boolean;
  children?: ReactNode;
}

export function SideBarNavItem({ children, text, to, targetBlank, className, icon }: NavItemProps) {
  return (
    <Link className="nav-link" to={`${to}`} target={targetBlank ? '_blank' : undefined}>
      <Col xs={3} className="d-flex justify-content-center">
        <FontAwesomeIcon size="lg" icon={icon} className={`me-2 text-primary ${className}`} />
      </Col>
      <Col>
        {text && `${text} `}
        {children}
      </Col>
    </Link>
  );
}
