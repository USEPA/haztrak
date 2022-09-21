import React from 'react';
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import HtCard from 'components/HtCard';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Manifest } from 'types';
import HandlerForm from '../HandlerForm';
import { HandlerType } from 'types/Handler/Handler';
import { yupResolver } from '@hookform/resolvers/yup';
import ManifestSchema from './ManifestSchema';

function ManifestForm() {
  const methods = useForm<Manifest>({ resolver: yupResolver(ManifestSchema) });
  const {
    formState: { errors },
  } = methods;
  const onSubmit: SubmitHandler<Manifest> = (data: Manifest) => {
    console.log(data);
  };

  return (
    <Container>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <h2 className="fw-bold">{'Draft Manifest'}</h2>
          <HtCard id="general-form-card">
            <HtCard.Header title="General info" />
            <HtCard.Body>
              <Form.Group className="mb-2">
                <Form.Label className="mb-0">MTN</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  placeholder={'Draft Manifest'}
                  {...methods.register('manifestTrackingNumber')}
                />
              </Form.Group>
            </HtCard.Body>
          </HtCard>
          <HtCard id="generator-form-card">
            <HtCard.Header title="Generator" />
            <HtCard.Body>
              <HandlerForm handlerType={HandlerType.Generator} />
            </HtCard.Body>
          </HtCard>
        </Form>
      </FormProvider>
    </Container>
  );
}

export default ManifestForm;
