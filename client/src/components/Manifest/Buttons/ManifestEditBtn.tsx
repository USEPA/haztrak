import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ManifestContext } from 'components/Manifest/ManifestForm';
import { HtButton } from 'components/UI';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export function ManifestEditBtn() {
  const navigate = useNavigate();
  const { readOnly, mtn, manifestingSiteID } = useContext(ManifestContext);
  if (!readOnly) return <></>;
  return (
    <HtButton
      variant="outline-info"
      type="button"
      name="edit"
      onClick={() => navigate(`/site/${manifestingSiteID}/manifest/${mtn}/edit`)}
    >
      <span>Edit </span>
      <FontAwesomeIcon icon={faPenToSquare} />
    </HtButton>
  );
}
