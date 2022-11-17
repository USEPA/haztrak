import React, { useEffect, useState } from 'react';
import { Col, Form, Row, Button, Modal } from 'react-bootstrap';
// import { useForm, useFormContext } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import api from 'services';
import { Transporter } from 'types/Transporter/Transporter';

interface SearchCriteria {
  epaId: string | undefined;
  name: string | undefined;
}

function TransporterSearchForm() {
  const [tranOptions, setTranOptions] = useState<[Transporter] | undefined>(
    undefined
  );
  const onSubmit = (data: any) => console.log(data);
  // The although TransporterSearch is a separate form, it's intended to be
  // used in the context of a ManifestForm so it can modify its values.
  // const manifestForm = useFormContext();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  let searchData: SearchCriteria = {
    epaId: watch('epaId'),
    name: watch('name'),
  };

  useEffect(() => {
    async function fetchOptions() {
      if (
        typeof searchData.epaId === 'string' &&
        typeof searchData.name === 'string'
      ) {
        if (searchData.epaId.length >= 3 || searchData.name.length >= 3) {
          let transporters = await api.post(
            'trak/transporter/search',
            searchData
          );
          console.log(transporters);
          return transporters;
        }
      }
    }

    fetchOptions().then((trans) => setTranOptions(trans));
  }, [watch('epaId'), watch('name')]);

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label className="mb-0">EPA ID Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="VATESTRAN03"
                  {...register(`epaId`)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label className="mb-0">Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="VA TEST GEN 2021"
                  {...register(`name`)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              {tranOptions ? (
                <Form.Select>
                  {tranOptions.map((option) => {
                    return (
                      <option value={option.epaSiteId}>
                        {' '}
                        {option.epaSiteId} {' -- '} {option.name}{' '}
                      </option>
                    );
                  })}
                </Form.Select>
              ) : (
                <></>
              )}
            </Col>
            {/*  <AsyncSelect loadOptions={searchTransporters} />*/}
          </Row>
          <Row>
            <ErrorMessage
              errors={errors}
              name={'epaId'}
              render={({ message }) => (
                <span className="text-danger">{message}</span>
              )}
            />
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => console.log('hello')}>
            Cancel
          </Button>
          <Button variant="success" type="submit" onClick={onSubmit}>
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </>
  );
}

export default TransporterSearchForm;
