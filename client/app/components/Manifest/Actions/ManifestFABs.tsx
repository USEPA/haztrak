import { FloatingActionBtn } from 'app/components/legacyUi';
import React, { ReactElement, useContext } from 'react';
import { ManifestEditBtn } from '~/components/Manifest/Actions/ManifestEditBtn';
import { ManifestSaveBtn } from '~/components/Manifest/Actions/ManifestSaveBtn';
import { ManifestContext } from '~/components/Manifest/ManifestForm';
import { QuickSignBtn } from '~/components/Manifest/QuickerSign';
import { useReadOnly } from '~/hooks/manifest';

interface ManifestActionBtnsProps {
  onSignClick: () => void;
}

export function ManifestFABs({ onSignClick }: ManifestActionBtnsProps) {
  const { signAble } = useContext(ManifestContext);
  const [readOnly] = useReadOnly();
  let component: ReactElement | undefined = undefined;
  if (!readOnly) {
    component = <ManifestSaveBtn />;
  } else if (signAble) {
    component = <QuickSignBtn onClick={onSignClick} />;
  } else if (readOnly) {
    component = <ManifestEditBtn />;
  } else {
    return <></>;
  }

  return <FloatingActionBtn position="bottom-left" component={component} extended />;
}
