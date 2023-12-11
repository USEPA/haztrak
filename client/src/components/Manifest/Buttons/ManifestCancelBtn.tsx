import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ManifestContext } from 'components/Manifest/ManifestForm';
import { Manifest } from 'components/Manifest/manifestSchema';
import { HtButton } from 'components/UI';
import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export function ManifestCancelBtn() {
  const form = useFormContext<Manifest>();
  const navigate = useNavigate();
  const { readOnly, mtn, manifestingSiteID } = useContext(ManifestContext);
  if (readOnly) return <></>;
  return (
    <HtButton
      variant="danger"
      type="button"
      name="edit"
      onClick={() => {
        form.reset();
        if (!mtn) {
          navigate(-1);
        } else {
          navigate(`/site/${manifestingSiteID}/manifest/${mtn}/view`);
        }
      }}
    >
      <span>Cancel </span>
      <FontAwesomeIcon icon={faTrash} />
    </HtButton>
  );
}
