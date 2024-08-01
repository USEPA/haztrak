import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HtButton } from '~/components/UI';
import { useReadOnly } from '~/hooks/manifest';
import React from 'react';
import { ButtonProps } from 'react-bootstrap';

interface ManifestSaveBtnProps extends ButtonProps {}

export function ManifestSaveBtn({ children: _unused, ...props }: ManifestSaveBtnProps) {
  const [readOnly] = useReadOnly();
  if (readOnly) return <></>;
  return (
    <HtButton variant="success" type="submit" name="save" {...props}>
      <span>Save </span>
      <FontAwesomeIcon icon={faFloppyDisk} />
    </HtButton>
  );
}
