import { ErrorMessage } from '@hookform/error-message';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import htApi from 'services';
import { Handler } from 'types';
import { HandlerType } from 'types/Handler/Handler';

interface Props {
  handleClose: () => void;
  handlerType: HandlerType;
}

interface SearchCriteria {
  epaId: string | undefined;
  name: string | undefined;

  siteType: string;
}

interface handlerAppendForm {
  transporter: string;
  epaId: string;
  name: string;
}

function HandlerSearchForm({ handleClose, handlerType }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<handlerAppendForm>();
  // const [handler, setHandler] = useState<Handler | undefined>(undefined);
  const [handlerOptions, setHandlerOptions] = useState<Array<Handler> | undefined>(undefined);

  /**
   This is the data that is sent to the RESTful api, it's automatically updated
   when the form is updated via react-hook-form's 'watch' function.
   */
  const searchData: SearchCriteria = {
    epaId: watch('epaId'),
    name: watch('name'),
    siteType: handlerType,
  };

  /** This useEffect is responsible for watching the transporter search fields
   and sending the search criteria to the server, set the field options upon return
   */
  useEffect(() => {
    async function fetchOptions() {
      if (typeof searchData.epaId === 'string' && typeof searchData.name === 'string') {
        if (searchData.epaId.length >= 3 || searchData.name.length >= 3) {
          const response = await htApi.get('trak/handler/search', {
            params: searchData,
          });
          return response.data;
        }
      }
    }

    fetchOptions()
      .then((trans: Array<Handler>) => setHandlerOptions(trans))
      .catch((error) => console.log(error));
  }, [watch('epaId'), watch('name')]);

  /**Use the value (string) set in the Form.Select to look up
   what transporter object was selected, add that transporter to the array field in the manifest form
   */
  const onSubmit: SubmitHandler<handlerAppendForm> = (data) => {
    console.log('submit');
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
                <Form.Control type="text" placeholder="VATESTRAN03" {...register(`epaId`)} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label className="mb-0">Name</Form.Label>
                <Form.Control type="text" placeholder="VA TEST GEN 2021" {...register(`name`)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              {handlerOptions ? (
                <Form.Select {...register('transporter', { required: true })}>
                  {handlerOptions.map((option) => {
                    return (
                      <option key={`tran-select-${option.epaSiteId}`} value={option.epaSiteId}>
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
              render={({ message }) => <span className="text-danger">{message}</span>}
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

export default HandlerSearchForm;
