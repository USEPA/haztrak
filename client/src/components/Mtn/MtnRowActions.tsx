import { faEye, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HtTooltip } from 'components/Ht';
import React from 'react';
import { Link } from 'react-router-dom';

interface MtnRowActionsProps {
  mtn: string;
}

export function MtnRowActions({ mtn }: MtnRowActionsProps) {
  return (
    <div className="d-flex justify-content-evenly">
      <HtTooltip text={`View: ${mtn}`}>
        <Link to={`./${mtn}/view`} aria-label={`viewManifest${mtn}`}>
          <FontAwesomeIcon icon={faEye} />
        </Link>
      </HtTooltip>
      <HtTooltip text={`Edit ${mtn}`}>
        <Link to={`./${mtn}/edit`} aria-label={`editManifest${mtn}`}>
          <FontAwesomeIcon icon={faPen} />
        </Link>
      </HtTooltip>
    </div>
  );
}
