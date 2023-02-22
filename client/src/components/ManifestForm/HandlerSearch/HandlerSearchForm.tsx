import { ErrorMessage } from '@hookform/error-message';
import { HtForm, HtModal } from 'components/Ht';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { SubmitHandler, useForm, useFormContext } from 'react-hook-form';
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

interface addHandlerForm {
  handler: string;
  epaId: string;
  name: string;
}

/**
 * HandlerSearchForm is responsible for watching the input parameters, querying the
 * server for known handlers (of specified type) rendering those options in a form
 * @param handleClose
 * @param handlerType {HandlerType}
 * @constructor
 */
function HandlerSearchForm({ handleClose, handlerType }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<addHandlerForm>();
  const manifestMethods = useFormContext();
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

  /**
   * This useEffect is responsible for watching the search fields
   * and querying the server and set the field options upon return
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
      .catch((error) => console.error(error));
  }, [watch('epaId'), watch('name')]);

  /**Use the value (string) set in the Form.Select to look up
   what transporter object was selected, add that transporter to the array field in the manifest form
   */
  const onSubmit: SubmitHandler<addHandlerForm> = (data) => {
    if (handlerOptions !== undefined) {
      for (let i = 0; i < handlerOptions?.length; i++) {
        if (handlerOptions[i].epaSiteId === data.handler) {
          const newTsdf: Handler = {
            ...handlerOptions[i],
          };
          manifestMethods.setValue(handlerType, newTsdf);
        }
      }
    }
    handleClose();
  };

  return (
    <>
      <HtForm onSubmit={handleSubmit(onSubmit)}>
        <HtModal.Body>
          <Row>
            <Col>
              <HtForm.Group>
                <HtForm.Label htmlFor={`${handlerType}SearchEPAId`}>EPA ID Number</HtForm.Label>
                <HtForm.Control
                  id={`${handlerType}SearchEPAId`}
                  type="text"
                  placeholder="VATESTRAN03"
                  {...register(`epaId`)}
                  // @ts-ignore
                  autoFocus
                />
              </HtForm.Group>
            </Col>
            <Col>
              <HtForm.Group>
                <HtForm.Label htmlFor={`${handlerType}SearchName`}>Name</HtForm.Label>
                <HtForm.Control
                  id={`${handlerType}SearchName`}
                  type="text"
                  placeholder="VA TEST GEN 2021"
                  {...register(`name`)}
                />
              </HtForm.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              {handlerOptions ? (
                <HtForm.Select {...register('handler', { required: true })}>
                  {handlerOptions.map((option) => {
                    return (
                      <option key={`tran-select-${option.epaSiteId}`} value={option.epaSiteId}>
                        {`${option.epaSiteId} -- ${option.name} `}
                      </option>
                    );
                  })}
                </HtForm.Select>
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
        </HtModal.Body>
        <HtModal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" type="submit">
            Add
          </Button>
        </HtModal.Footer>
      </HtForm>
    </>
  );
}

export default HandlerSearchForm;
