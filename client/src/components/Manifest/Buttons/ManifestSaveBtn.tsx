import { ManifestContext } from 'components/Manifest/ManifestForm';
import { HtButton } from 'components/UI';
import React, { useContext } from 'react';

export function ManifestSaveBtn() {
  const { readOnly } = useContext(ManifestContext);
  if (readOnly) return <></>;
  return (
    <HtButton variant="success" type="submit" name="save">
      Save
    </HtButton>
  );
}
