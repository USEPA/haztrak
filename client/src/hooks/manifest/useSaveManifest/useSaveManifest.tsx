import { useEffect, useState } from 'react';
import { Manifest } from 'components/Manifest';
import {
  useCreateManifestMutation,
  useSaveEManifestMutation,
  useUpdateManifestMutation,
} from 'store';

/**
 * encapsulates the logic for making requests to the back end to save a manifest (create, update, or save to e-Manifest)
 * */
export function useSaveManifest() {
  const [data, setData] = useState<Manifest | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | undefined>();
  const [error, setError] = useState<any | undefined>(null);

  const [createManifest, { data: createData, error: createError, isLoading: createIsLoading }] =
    useCreateManifestMutation();

  const [updateManifest, { data: updateResults, error: updateError, isLoading: updateIsLoading }] =
    useUpdateManifestMutation();

  const [
    saveEmanifest,
    { data: eManifestResult, error: eManifestError, isLoading: eManifestIsLoading },
  ] = useSaveEManifestMutation();

  useEffect(() => {
    if (eManifestResult) {
      setTaskId(eManifestResult.taskId);
    }
  }, [eManifestResult]);

  // create or update draft manifest results
  useEffect(() => {
    if (createData) setData(createData);
    if (updateResults) setData(updateResults);
    setIsLoading(false);
  }, [createData, updateResults]);

  // create or update draft manifest errors, and e-Manifest errors
  useEffect(() => {
    if (createError) setError(createError);
    if (updateError) setError(updateError);
    if (eManifestError) setError(eManifestError);
  }, [createError, updateError, eManifestError]);

  useEffect(() => {
    setIsLoading(updateIsLoading);
  }, [updateIsLoading]);

  useEffect(() => {
    setIsLoading(eManifestIsLoading);
  }, [eManifestIsLoading]);

  useEffect(() => {
    setIsLoading(createIsLoading);
  }, [createIsLoading]);

  const saveManifest = (manifest?: Manifest) => {
    setIsLoading(true);
    if (!manifest) {
      setIsLoading(false);
      return;
    }
    if (manifest.status === 'NotAssigned') {
      if (manifest.manifestTrackingNumber?.endsWith('DFT')) {
        updateManifest({ mtn: manifest.manifestTrackingNumber, manifest });
      } else {
        createManifest(manifest);
      }
    } else {
      saveEmanifest(manifest);
    }
  };

  return { data, isLoading, saveManifest, taskId, error } as const;
}
