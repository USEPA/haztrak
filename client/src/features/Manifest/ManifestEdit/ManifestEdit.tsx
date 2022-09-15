import {Button, Form} from 'react-bootstrap';
import {useForm, SubmitHandler} from 'react-hook-form';
import HtCard from '../../../components/HtCard';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

interface Inputs {
  age: string;
  email: number;
}

const schema = yup
  .object({
    age: yup.number().positive().integer().required(),
  })
  .required();

function ManifestEdit(): JSX.Element {
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<Inputs>({resolver: yupResolver(schema)});
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <HtCard>
      <HtCard.Header title={'New Manifest'}/>
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
          </Form.Group>
        </Form>
      </HtCard.Body>
    </HtCard>
  );
}

export default ManifestEdit;
