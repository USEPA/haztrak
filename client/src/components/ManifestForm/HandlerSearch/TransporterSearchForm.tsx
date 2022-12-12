import { ErrorMessage } from '@hookform/error-message';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { SubmitHandler, UseFieldArrayAppend, useForm } from 'react-hook-form';
import htApi from 'services';
import { Handler, Manifest } from 'types';
import { HandlerType } from 'types/Handler/Handler';
import { Transporter } from 'types/Transporter/Transporter';

interface Props {
  handleClose: () => void;
  currentTransporters?: Array<Handler>;
  tranAppend: UseFieldArrayAppend<Manifest, 'transporters'>;
}

interface SearchCriteria {
  epaId: string | undefined;
  name: string | undefined;

  siteType: string;
}

interface TranAppendValues {
  transporter: string;
  epaId: string;
  name: string;
}

function TransporterSearchForm({
  handleClose,
  tranAppend,
  currentTransporters,
}: Props) {
  const [tranOptions, setTranOptions] = useState<Array<Handler> | undefined>(undefined);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TranAppendValues>();

  /**
   This is the data that is sent to the RESTful api, it's automatically updated
   when the form is updated via react-hook-form's 'watch' function.
   */
  const searchData: SearchCriteria = {
    epaId: watch('epaId'),
    name: watch('name'),
    siteType: HandlerType.Transporter,
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
      .then((trans: Array<Handler>) => setTranOptions(trans))
      .catch((error) => console.log(error));
  }, [watch('epaId'), watch('name')]);

  /**Use the value (string) set in the Form.Select to look up
   what transporter object was selected, add that transporter to the array field in the manifest form
   */
  const onSubmit: SubmitHandler<TranAppendValues> = (data) => {
    // Todo: error handling, check if tranOptions is zero length
    if (tranOptions !== undefined) {
      for (let i = 0; i < tranOptions?.length; i++) {
        if (tranOptions[i].epaSiteId === data.transporter) {
          // append in run in the ManifestForm context, on the 'transporter' field
          // const numberOfTransporter = currentTransporters?.length;
          const numberOfTransporter = currentTransporters
            ? currentTransporters.length
            : 0;
          const newTransporter: Transporter = {
            order: numberOfTransporter + 1,
            ...tranOptions[i],
          };
          tranAppend(newTransporter);
        }
      }
    }
    // After the transporter is added, close the modal
    handleClose();
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label className="mb-0" htmlFor="transporterEPAId">
                  EPA ID Number
                </Form.Label>
                <Form.Control
                  id="transporterEPAId"
                  type="text"
                  placeholder="VATESTRAN03"
                  {...register(`epaId`)}
                  autoFocus
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label className="mb-0" htmlFor="transporterName">
                  Name
                </Form.Label>
                <Form.Control
                  id="transporterName"
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
                <>
                  <Form.Label className="mb-0" htmlFor="transporterSelect">
                    Select Transporter
                  </Form.Label>
                  <Form.Select
                    {...register('transporter', { required: true })}
                    id="transporterSelect"
                  >
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
                </>
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

export default TransporterSearchForm;
