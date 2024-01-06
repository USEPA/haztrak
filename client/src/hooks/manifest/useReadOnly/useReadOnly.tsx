import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { selectManifestReadOnly, setManifestReadOnly } from 'store/manifestSlice/manifest.slice';

/** State management for whether a manifest is editable/read only
 * @example const [status, setStatus] = useReadOnly();
 * */
export function useReadOnly(initialValue?: boolean) {
  const dispatch = useAppDispatch();
  const reduxReadOnly = useAppSelector(selectManifestReadOnly);
  const defaultReadOnly = initialValue !== undefined ? initialValue : reduxReadOnly;
  const [readOnly, setReadonly] = useState<boolean>(defaultReadOnly);

  useEffect(() => {
    dispatch(setManifestReadOnly(readOnly));
  }, [readOnly]);

  useEffect(() => {
    if (initialValue !== undefined) {
      dispatch(setManifestReadOnly(initialValue));
      setReadonly(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    setReadonly(reduxReadOnly);
  }, [reduxReadOnly]);

  /** Set the manifest readOnly*/
  const handleReadOnlyChange = (newReadOnly: boolean) => {
    setReadonly(newReadOnly);
  };

  return [readOnly, handleReadOnlyChange] as const;
}
