import { useParams } from 'react-router';
import { ManifestForm } from '~/components/Manifest';
import { Spinner } from '~/components/ui';
import { useTitle } from '~/hooks';
import { useReadOnly } from '~/hooks/manifest';
import { useGetManifestQuery } from '~/store';

export function ManifestDetails() {
  const { mtn, action, siteId } = useParams();
  useTitle(`${mtn}`);
  const { data, error, isLoading } = useGetManifestQuery(mtn ?? '', { skip: !mtn });
  useReadOnly(true);

  const readOnly = action !== 'edit';

  if (error) {
    return (
      <div className="text-danger">
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return isLoading ? (
    <Spinner />
  ) : data ? (
    <ManifestForm manifestData={data} readOnly={readOnly} manifestingSiteID={siteId} mtn={mtn} />
  ) : (
    <div className="text-danger">
      <h2>Something went wrong</h2>
    </div>
  );
}
