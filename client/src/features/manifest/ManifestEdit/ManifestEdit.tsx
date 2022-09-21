import { Manifest } from 'types';
import { useParams } from 'react-router-dom';
import ManifestForm from 'components/ManifestForm/ManifestForm';

interface Props {
  manifest?: Manifest;
}

type ManifestParams = {
  mtn?: string;
};

function ManifestEdit(props: Props): JSX.Element {
  const { mtn } = useParams<ManifestParams>();
  return <ManifestForm />;
}

export default ManifestEdit;
