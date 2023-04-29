import { HtForm } from 'components/Ht';
import { HandlerTypeEnum, Manifest } from 'components/Manifest/manifestSchema';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import { RcraSite } from 'components/RcraSite';
import AsyncSelect from 'react-select/async';
import { htApi } from 'services';

interface Props {
  handleClose: () => void;
  handlerType: HandlerTypeEnum;
}

interface searchHandlerForm {
  handler: string;
  epaId: string;
}

export function HtSearchForm({ handleClose, handlerType }: Props) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<searchHandlerForm>();
  const manifestMethods = useFormContext<Manifest>();
  const [selectedHandler, setSelectedHandler] = useState<RcraSite | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const onSubmit: SubmitHandler<searchHandlerForm> = () => {
    if (selectedHandler !== null) {
      console.log('selectedHandler', selectedHandler);
      if (handlerType === 'generator' || handlerType === 'designatedFacility') {
        manifestMethods.setValue(handlerType, { ...selectedHandler });
      } else if (handlerType === 'transporter') {
        // ToDo add to react-hook-form's useFieldArray
      }
    }
    handleClose();
  };

  // handle input change event
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  // handle selection change event
  const handleChange = (value: RcraSite | null): void => {
    setSelectedHandler(value);
  };

  // load options using API call
  const loadOptions = async (inputValue: string) => {
    return htApi
      .get('site/handler/search', { params: { epaId: inputValue, siteType: handlerType } })
      .then((res) => res.data as Array<RcraSite>);
  };

  return (
    <>
      <HtForm onSubmit={handleSubmit(onSubmit)}>
        <HtForm.Group>
          <HtForm.Label htmlFor="epaId">EPA ID Number</HtForm.Label>
          <Controller
            control={control}
            name="epaId"
            render={({ field }) => {
              return (
                <AsyncSelect
                  id="epaId"
                  {...field}
                  value={selectedHandler}
                  inputValue={inputValue}
                  loadOptions={loadOptions}
                  getOptionLabel={(option) => `${option.epaSiteId} -- ${option.name}`}
                  getOptionValue={(option) => option.epaSiteId}
                  openMenuOnFocus={false}
                  onInputChange={handleInputChange}
                  onChange={handleChange}
                  isSearchable
                  isClearable
                  cacheOptions
                />
              );
            }}
          />
        </HtForm.Group>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleClose} className="mx-2">
            Cancel
          </Button>
          <Button variant="success" type="submit">
            Add
          </Button>
        </div>
      </HtForm>
    </>
  );
}
