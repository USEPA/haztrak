import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { ManifestContext } from '~/components/Manifest/ManifestForm';
import { Manifest } from '~/components/Manifest/manifestSchema';
import { HtButton } from '~/components/legacyUi';
import { useReadOnly } from '~/hooks/manifest';

export function ManifestCancelBtn() {
  const form = useFormContext<Manifest>();
  const navigate = useNavigate();
  const { trackingNumber, viewingAsSiteId } = useContext(ManifestContext);
  const [readOnly] = useReadOnly();
  if (readOnly) return <></>;
  return (
    <HtButton
      variant="danger"
      type="button"
      name="edit"
      onClick={() => {
        form.reset();
        if (!trackingNumber) {
          navigate(-1);
        } else {
          navigate(`/site/${viewingAsSiteId}/manifest/${trackingNumber}/view`);
        }
      }}
    >
      <span>Cancel </span>
      <FaTrash className="tw-inline" />
    </HtButton>
  );
}
