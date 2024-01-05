import { ManifestStatus } from 'components/Manifest/manifestSchema';
import { useState } from 'react';

/** State management for whether a manifest is editable/read only
 * @example const [status, setStatus] = useReadOnly();
 * */
export function useReadOnly(propStatus?: ManifestStatus) {
  const [readOnly, setReadonly] = useState<boolean>(true);

  return [readOnly, setReadonly] as const;
}
