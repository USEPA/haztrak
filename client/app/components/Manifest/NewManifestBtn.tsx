import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

interface NewManifestBtnProps {
  siteId?: string;
}

export function NewManifestBtn({ siteId }: NewManifestBtnProps) {
  const navigate = useNavigate();

  // By default, don't create a new manifest as a specific site.
  let newManifestURL = '/manifest/new';
  if (siteId) {
    newManifestURL = `/site/${siteId}/manifest/new`;
  }

  return (
    <Button variant={'success'} onClick={() => navigate(newManifestURL)}>
      New Manifest
    </Button>
  );
}
