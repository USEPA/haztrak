import { useEffect, useState } from 'react';
import { ManifestStatus } from 'components/Manifest/manifestSchema';
import { useAppDispatch, useAppSelector } from 'store';
import { selectManifestStatus, setManifestStatus } from 'store/manifestSlice/manifest.slice';

/** State management for the e-Manifest status (e.g., 'NotAssigned', 'Scheduled')
 * @example const [status, setStatus] = useManifestStatus(optionalDefault);
 * */
export function useManifestStatus(propStatus?: ManifestStatus) {
  const reduxStatus = useAppSelector(selectManifestStatus);
  const dispatch = useAppDispatch();

  const defaultValue = propStatus ? propStatus : reduxStatus ? reduxStatus : undefined;

  const [status, setStatus] = useState<ManifestStatus | undefined>(defaultValue);

  useEffect(() => {
    dispatch(setManifestStatus(status));
  }, [status]);

  useEffect(() => {
    setStatus(reduxStatus);
  }, [reduxStatus]);

  /** Set the manifest status */
  const handleStatusChange = (newStatus: ManifestStatus | undefined) => {
    setStatus(newStatus);
  };

  return [status, handleStatusChange] as const;
}
