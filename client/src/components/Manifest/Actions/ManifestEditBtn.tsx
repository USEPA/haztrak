import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ManifestContext } from 'components/Manifest/ManifestForm';
import { HtButton } from 'components/UI';
import React, { useContext } from 'react';
import { ButtonProps } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface ManifestEditBtnProps extends ButtonProps {}

export function ManifestEditBtn({ children, ...props }: ManifestEditBtnProps) {
  const navigate = useNavigate();
  const { readOnly, trackingNumber, viewingAsSiteId } = useContext(ManifestContext);
  if (!readOnly) return <></>;
  return (
    <HtButton
      {...props}
      variant="info"
      type="button"
      name="edit"
      onClick={() => navigate(`/site/${viewingAsSiteId}/manifest/${trackingNumber}/edit`)}
    >
      <span>Edit </span>
      <FontAwesomeIcon icon={faPenToSquare} />
    </HtButton>
  );
}
