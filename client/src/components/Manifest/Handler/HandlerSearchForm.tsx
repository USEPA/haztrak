import { HtForm } from 'components/Ht';
import { SiteType, Manifest, Transporter } from 'components/Manifest/manifestSchema';
import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  Controller,
  SubmitHandler,
  UseFieldArrayAppend,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { RcraSite } from 'components/RcraSite';
import AsyncSelect from 'react-select/async';
import { htApi } from 'services';
import { ManifestContext, ManifestContextType } from 'components/Manifest/ManifestForm';

interface Props {
  handleClose: () => void;
  handlerType: SiteType;
  currentTransporters?: Array<RcraSite>;
  appendTransporter?: UseFieldArrayAppend<Manifest, 'transporters'>;
}

interface searchHandlerForm {
  handler: string;
  epaId: string;
}

export function HandlerSearchForm({
  handleClose,
  handlerType,
  currentTransporters,
  appendTransporter,
}: Props) {
  const { handleSubmit, control } = useForm<searchHandlerForm>();
  const manifestMethods = useFormContext<Manifest>();
  const [selectedHandler, setSelectedHandler] = useState<RcraSite | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const { setGeneratorStateCode } = useContext<ManifestContextType>(ManifestContext);

  const onSubmit: SubmitHandler<searchHandlerForm> = () => {
    if (selectedHandler !== null) {
      if (handlerType === 'generator' || handlerType === 'designatedFacility') {
        if (setGeneratorStateCode) {
          setGeneratorStateCode(selectedHandler.siteAddress.state.code);
        }
        manifestMethods.setValue(handlerType, { ...selectedHandler });
      } else if (handlerType === 'transporter') {
        // ToDo add to react-hook-form's useFieldArray
        const numberOfTransporter = currentTransporters ? currentTransporters.length : 0;
        const newTransporter: Transporter = {
          order: numberOfTransporter + 1,
          ...selectedHandler,
        };
        if (appendTransporter) {
          appendTransporter(newTransporter);
        }
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
      .get('site/rcra-site/search', { params: { epaId: inputValue, siteType: handlerType } })
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
