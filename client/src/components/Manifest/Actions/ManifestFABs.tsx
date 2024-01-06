import { ManifestEditBtn } from 'components/Manifest/Actions/ManifestEditBtn';
import { ManifestSaveBtn } from 'components/Manifest/Actions/ManifestSaveBtn';
import { ManifestContext } from 'components/Manifest/ManifestForm';
import { QuickSignBtn } from 'components/Manifest/QuickerSign';
import { FloatingActionBtn } from 'components/UI';
import { useReadOnly } from 'hooks/manifest';
import React, { ReactElement, useContext } from 'react';
import { manifest } from 'services';

interface ManifestActionBtnsProps {
  onSignClick: () => void;
}

export function ManifestFABs({ onSignClick }: ManifestActionBtnsProps) {
  const { nextSigningSite, signAble } = useContext(ManifestContext);
  const [readOnly] = useReadOnly();
  const rcraSiteType = manifest.siteTypeToRcraSiteType(nextSigningSite?.siteType);
  let component: ReactElement | undefined = undefined;
  if (!readOnly) {
    component = <ManifestSaveBtn />;
  } else if (signAble) {
    component = <QuickSignBtn siteType={rcraSiteType} onClick={onSignClick} />;
  } else if (readOnly) {
    component = <ManifestEditBtn />;
  } else {
    return <></>;
  }

  return <FloatingActionBtn position="bottom-left" component={component} extended />;
}
