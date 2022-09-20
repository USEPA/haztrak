import HandlerForm from 'components/ManifestForm/HandlerForm/HandlerForm';
import { Manifest } from 'types';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { HandlerType } from 'types/Handler/Handler';
import HtCard from 'components/HtCard';

interface Props {
  manifest?: Manifest;
}

type ManifestParams = {
  mtn?: string;
};

function ManifestEdit(props: Props): JSX.Element {
  const { mtn } = useParams<ManifestParams>();
  // to be replaced in the future with useEffect to retrieve manifest from server
  if (mtn?.toUpperCase() === 'NEW' && !props.manifest) {
    return (
      <Container>
        <h2 className="fw-bold">{'Draft Manifest'}</h2>
        <HtCard id="generator-form-card">
          <HtCard.Header title="Generator" />
          <HtCard.Body>
            <HandlerForm handlerType={HandlerType.Generator} />
          </HtCard.Body>
        </HtCard>
      </Container>
    );
  } else {
    return (
      <Container>
        <h2 className="fw-bold">{mtn}</h2>
        <HtCard id="generator-form-card">
          <HtCard.Header title="Generator" />
          <HtCard.Body>
            <HandlerForm handlerType={HandlerType.Generator} />
          </HtCard.Body>
        </HtCard>
      </Container>
    );
  }
}

export default ManifestEdit;
