import { HtForm } from 'components/Ht';
import { ManifestContext, ManifestContextType } from 'components/Manifest/ManifestForm';
import { Manifest, SiteType, Transporter } from 'components/Manifest/manifestSchema';
import { RcraSite } from 'components/RcraSite';
import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  Controller,
  SubmitHandler,
  UseFieldArrayAppend,
  useForm,
  useFormContext,
} from 'react-hook-form';
import Select from 'react-select';
import { useAppDispatch } from 'store';
import { siteApi } from 'store/site.slice';

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
  const dispatch = useAppDispatch();
  const { setGeneratorStateCode, setTsdfStateCode } =
    useContext<ManifestContextType>(ManifestContext);

  const [options, setOptions] = useState<RcraSite[]>([]);
  const [rcrainfoSitesLoading, setRcrainfoSitesLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<searchHandlerForm> = () => {
    if (selectedHandler !== null) {
      if (handlerType === 'generator') {
        setGeneratorStateCode(selectedHandler.siteAddress.state.code);
        manifestMethods.setValue('generator', { ...selectedHandler });
      } else if (handlerType === 'designatedFacility') {
        setTsdfStateCode(selectedHandler.siteAddress.state.code);
        manifestMethods.setValue('designatedFacility', { ...selectedHandler });
      } else if (handlerType === 'transporter') {
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

  const handleInputChange = async (value: string) => {
    setInputValue(value);
    if (value.length >= 5) {
      setRcrainfoSitesLoading(true);
      const rcrainfoSites = await dispatch(
        siteApi.endpoints?.searchRcrainfoSites.initiate({
          siteType: handlerType,
          siteId: value,
        })
      );
      setOptions(rcrainfoSites.data as Array<RcraSite>);
      setRcrainfoSitesLoading(false);
    }
  };

  const handleChange = (value: RcraSite | null): void => {
    setSelectedHandler(value);
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
                <Select
                  id="epaId"
                  {...field}
                  placeholder="At Least 5 characters..."
                  value={selectedHandler}
                  inputValue={inputValue}
                  options={options}
                  isLoading={rcrainfoSitesLoading}
                  getOptionLabel={(option) => `${option.epaSiteId} -- ${option.name}`}
                  getOptionValue={(option) => option.epaSiteId}
                  openMenuOnFocus={false}
                  onInputChange={handleInputChange}
                  onChange={handleChange}
                  isSearchable
                  isClearable
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
