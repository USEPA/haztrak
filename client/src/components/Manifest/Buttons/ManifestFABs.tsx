import { ManifestEditBtn } from 'components/Manifest/Buttons/ManifestEditBtn';
import { ManifestSaveBtn } from 'components/Manifest/Buttons/ManifestSaveBtn';
import { ManifestContext } from 'components/Manifest/ManifestForm';
import { QuickSignBtn } from 'components/Manifest/QuickerSign';
import { FloatingActionBtn } from 'components/UI';
import React, { useContext } from 'react';

interface ManifestActionBtnsProps {
  onSignClick: () => void;
}

export function ManifestFABs({ onSignClick }: ManifestActionBtnsProps) {
  const { nextSigningSite, readOnly, status, signAble } = useContext(ManifestContext);
  let component: any = undefined;
  if (!readOnly || status === 'NotAssigned') {
    component = <ManifestSaveBtn />;
  } else if (signAble) {
    component = (
      // @ts-ignore
      <QuickSignBtn siteType={nextSigningSite?.siteType} handleClick={onSignClick} />
    );
  } else if (readOnly) {
    component = <ManifestEditBtn />;
  } else {
    return <></>;
  }

  return <FloatingActionBtn position="bottom-left" component={component} extended />;
}
