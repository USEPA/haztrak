import HandlerForm from 'components/ManifestForm/HandlerForm/HandlerForm';
import { Manifest } from 'types';
import { Container, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { HandlerType } from 'types/Handler/Handler';
import HtCard from 'components/HtCard';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface Props {
  manifest?: Manifest;
}

type ManifestParams = {
  mtn?: string;
};

function ManifestEdit(props: Props): JSX.Element {
  const methods = useForm<Manifest>();
  const {
    formState: { errors },
  } = methods;
  const onSubmit: SubmitHandler<Manifest> = (data: Manifest) => {
    console.log(data);
  };
  const { mtn } = useParams<ManifestParams>();
  // to be replaced in the future with useEffect to retrieve manifest from server
  if (mtn?.toUpperCase() === 'NEW' && !props.manifest) {
    return (
      <Container>
        <h2 className="fw-bold">{'Draft Manifest'}</h2>
        <HtCard id="general-form-card">
          <HtCard.Header title="General info" />
          <HtCard.Body>
            <Form onSubmit={methods.handleSubmit(onSubmit)}>
              <Form.Group className="mb-2">
                <Form.Label className="mb-0">MTN</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  placeholder={'Draft Manifest'}
                  {...methods.register('manifestTrackingNumber')}
                />
              </Form.Group>
            </Form>
          </HtCard.Body>
        </HtCard>
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
