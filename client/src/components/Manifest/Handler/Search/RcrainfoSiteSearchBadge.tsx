import React from 'react';
import { Badge } from 'react-bootstrap';
import { HtSpinner } from 'components/UI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

interface RcrainfoInfoStatusProps {
  isFetching: boolean;
  error: any;
  data: any;
  rcraInfoIntegrated: boolean;
}

export function RcrainfoSiteSearchBadge({
  isFetching,
  error,
  data,
  rcraInfoIntegrated,
}: RcrainfoInfoStatusProps) {
  let bg = 'secondary';
  let text = 'white';
  let message = 'Ready to search RCRAInfo';
  if (!rcraInfoIntegrated) {
    message = 'RCRAInfo not integrated';
    bg = 'warning';
    text = 'dark';
  }
  if (error) {
    message = 'Error searching RCRAInfo';
    bg = 'danger';
  } else if (isFetching) {
    message = 'Searching RCRAInfo ';
    bg = 'primary';
  } else if (data) {
    message = 'Sites Retrieved from RCRAInfo ';
    bg = 'success';
  }

  return (
    <div className="my-2">
      <Badge className="p-2" bg={bg} text={text} pill>
        <span>{message}</span>
        {isFetching ? (
          <HtSpinner size="lg" />
        ) : error ? (
          <FontAwesomeIcon icon={faXmark} />
        ) : data ? (
          <FontAwesomeIcon icon={faCheck} />
        ) : (
          <></>
        )}
      </Badge>
    </div>
  );
}
