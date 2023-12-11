import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faFloppyDisk, faPen, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ManifestStatus } from 'components/Manifest/manifestSchema';
import { FloatingActionBtn } from 'components/UI';
import React from 'react';

interface ManifestActionBtnsProps {
  manifestStatus?: ManifestStatus;
  readOnly?: boolean;
  signAble?: boolean;
}

export function ManifestFABs({ manifestStatus, readOnly, signAble }: ManifestActionBtnsProps) {
  let variant: string | undefined = undefined;
  let text: string | undefined = undefined;
  let icon: IconProp | undefined = undefined;
  let type: 'button' | 'submit' | 'reset' | undefined = undefined;
  let name: string | undefined = undefined;
  if (!readOnly || manifestStatus === 'NotAssigned') {
    variant = 'success';
    icon = faFloppyDisk;
    text = 'Save';
    type = 'submit';
    name = 'saveFAB';
  } else if (signAble) {
    variant = 'primary';
    icon = faPen;
    text = 'Sign';
    name = 'signFAB';
    type = 'button';
  } else if (readOnly) {
    variant = 'primary';
    icon = faPenToSquare;
    text = 'Edit';
    name = 'editFAB';
    type = 'button';
  } else {
    return <></>;
  }

  return (
    <FloatingActionBtn name={name} variant={variant} type={type} position="bottom-left" extended>
      <span className="h5 me-3">{text}</span>
      <span className="h5">
        <FontAwesomeIcon icon={icon} />
      </span>
    </FloatingActionBtn>
  );
}
