import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ManifestContext } from 'components/Manifest/ManifestForm';
import { HtButton } from 'components/UI';
import React, { useContext } from 'react';
import { ButtonProps } from 'react-bootstrap';

interface ManifestSaveBtnProps extends ButtonProps {}

export function ManifestSaveBtn({ children, ...props }: ManifestSaveBtnProps) {
  const { readOnly } = useContext(ManifestContext);
  if (readOnly) return <></>;
  return (
    <HtButton variant="success" type="submit" name="save" {...props}>
      <span>Save </span>
      <FontAwesomeIcon icon={faFloppyDisk} />
    </HtButton>
  );
}
