import React from 'react';
import { FloatingActionBtn } from 'components/UI';
import { ManifestStatus } from 'components/Manifest/manifestSchema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faPen, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

interface ManifestActionBtnsProps {
  manifestStatus?: ManifestStatus;
  readonly?: boolean;
  signAble?: boolean;
}

export function ManifestActionBtns({
  manifestStatus,
  readonly,
  signAble,
}: ManifestActionBtnsProps) {
  let variant = 'success';
  let text = '';
  let icon = faFloppyDisk;
  let type: 'button' | 'submit' | 'reset' | undefined = 'button';
  console.log('signAble', signAble);
  if (signAble) {
    variant = 'primary';
    icon = faPen;
    text = 'Sign';
  } else if (readonly) {
    variant = 'primary';
    icon = faPenToSquare;
    text = 'Edit';
  } else if (!readonly) {
    variant = 'success';
    icon = faFloppyDisk;
    text = 'Save';
    type = 'submit';
  } else {
    return <></>;
  }

  return (
    <FloatingActionBtn variant={variant} type={type} position="bottom-left" extended>
      <span className="h5 me-3">{text}</span>
      <span className="h5">
        <FontAwesomeIcon icon={icon} />
      </span>
    </FloatingActionBtn>
  );
}
