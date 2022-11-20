import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import {
  useForm,
  useFormContext,
  SubmitHandler,
  UseFieldArrayAppend,
} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import api from 'services';
import { Transporter } from 'types/Transporter/Transporter';
import { Manifest } from 'types';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
  tranAppend: UseFieldArrayAppend<Manifest, 'transporters'>;
}

interface SearchCriteria {
  epaId: string | undefined;
  name: string | undefined;
}

interface FormValues {
  transporter: string;
  epaId: string;
  name: string;
}

function TransporterSearchForm({ handleClose, show, tranAppend }: Props) {
  // The Transporter is a separate form, but is used in the context of a ManifestForm
  const manifestForm = useFormContext();

  const [tranOptions, setTranOptions] = useState<[Transporter] | undefined>(
    undefined
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  /**
   This is the data that is sent to the RESTful api, it's automatically updated
   when the form is updated via react-hook-form's 'watch' function.
   */
  const searchData: SearchCriteria = {
    epaId: watch('epaId'),
    name: watch('name'),
  };

  /** This useEffect is responsible for watching the transporter search fields
   and sending the search criteria to the server, set the field options upon return
   */
  useEffect(() => {
    async function fetchOptions() {
      if (
        typeof searchData.epaId === 'string' &&
        typeof searchData.name === 'string'
      ) {
        if (searchData.epaId.length >= 3 || searchData.name.length >= 3) {
          return await api.post('trak/transporter/search', searchData);
        }
      }
    }

    fetchOptions().then((trans) => setTranOptions(trans));
  }, [watch('epaId'), watch('name')]);

  /**Use the value (string) set in the Form.Select to look up
   what transporter object was selected, add that transporter to the array field in the manifest form
   */
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Todo: error handling, check if tranOptions is zero length
    if (tranOptions !== undefined) {
      for (let i = 0; i < tranOptions?.length; i++) {
        if (tranOptions[i].epaSiteId === data.transporter) {
          // append in run in the ManifestForm context, on the 'transporter' field
          tranAppend(tranOptions[i]);
          console.log(manifestForm.getValues()); // uncomment to see how the new transporter is added to the manifest
        }
      }
    }
    handleClose();
  };

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
                <Form.Select {...register('transporter', { required: true })}>
                  {tranOptions.map((option) => {
                    return (
                      <option
                        key={`tran-select-${option.epaSiteId}`}
                        value={option.epaSiteId}
                      >
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
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" type="submit">
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </>
  );
}

export default TransporterSearchForm;
