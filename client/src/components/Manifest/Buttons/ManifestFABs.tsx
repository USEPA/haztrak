import { ManifestEditBtn } from 'components/Manifest/Buttons/ManifestEditBtn';
import { ManifestSaveBtn } from 'components/Manifest/Buttons/ManifestSaveBtn';
import { ManifestStatus } from 'components/Manifest/manifestSchema';
import { QuickSignBtn } from 'components/Manifest/QuickerSign';
import { FloatingActionBtn } from 'components/UI';
import React from 'react';

interface ManifestActionBtnsProps {
  manifestStatus?: ManifestStatus;
  readOnly?: boolean;
  signAble?: boolean;
}

export function ManifestFABs({ manifestStatus, readOnly, signAble }: ManifestActionBtnsProps) {
  let component: any = undefined;
  if (!readOnly || manifestStatus === 'NotAssigned') {
    component = <ManifestSaveBtn />;
  } else if (signAble) {
    component = <QuickSignBtn siteType={'Generator'} handleClick={() => console.log('click')} />;
  } else if (readOnly) {
    component = <ManifestEditBtn />;
  } else {
    return <></>;
  }

  return <FloatingActionBtn position="bottom-left" component={component} extended />;
}
