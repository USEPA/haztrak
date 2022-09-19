import {Button, Container, Form} from 'react-bootstrap';
import {useForm, SubmitHandler} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import HtCard from '../HtCard';
import {Manifest} from '../../types';

interface Props {
  manifest?: Manifest;
}

interface Inputs {
  age: string;
  email: number;
}

const schema = yup
  .object({
    age: yup.number().positive().integer().required(),
  })
  .required();

function ManifestForm(props: Props): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Inputs>({resolver: yupResolver(schema)});
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <HtCard>
      <HtCard.Header
        title={
          props.manifest
            ? props.manifest.manifestTrackingNumber
            : 'New manifest'
        }
      />
      <HtCard.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder={'enter email'}
              {...register('email', {required: true})}
            />
            <Form.Control defaultValue="test" {...register('age')} />
            <Button type="submit">Submit</Button>
            <Container>
              {errors.age && <span>{errors.age.message}</span>}
            </Container>
          </Form.Group>
        </Form>
      </HtCard.Body>
    </HtCard>
  );
}

export default ManifestForm;
