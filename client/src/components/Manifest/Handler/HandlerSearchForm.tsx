import { ManifestContext, ManifestContextType } from 'components/Manifest/ManifestForm';
import { Manifest, SiteType, Transporter } from 'components/Manifest/manifestSchema';
import { RcraSite } from 'components/RcraSite';
import { HtForm } from 'components/UI';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import {
  Controller,
  SubmitHandler,
  UseFieldArrayAppend,
  useForm,
  useFormContext,
} from 'react-hook-form';
import Select from 'react-select';
import {
  selectHaztrakProfile,
  useAppSelector,
  useSearchRcrainfoSitesQuery,
  useSearchRcraSitesQuery,
} from 'store';

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
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedHandler, setSelectedHandler] = useState<RcraSite | null>(null);
  const { org } = useAppSelector(selectHaztrakProfile);
  const [skip, setSkip] = useState<boolean>(true);
  const { data, error, isLoading } = useSearchRcraSitesQuery(
    {
      siteType: handlerType,
      siteId: inputValue,
    },
    { skip }
  );
  const {
    data: rcrainfoData,
    error: rcrainfoError,
    isLoading: rcrainfoIsLoading,
  } = useSearchRcrainfoSitesQuery(
    {
      siteType: handlerType,
      siteId: inputValue,
    },
    { skip: skip && !org?.rcrainfoIntegrated }
  );
  const { setGeneratorStateCode, setTsdfStateCode } =
    useContext<ManifestContextType>(ManifestContext);
  const [searchMessage, setSearchMessage] = useState<
    | {
        message: string;
        variant: 'success' | 'danger';
      }
    | undefined
  >(undefined);

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

  useEffect(() => {
    const inputTooShort = inputValue.length < 5;
    setSkip(inputTooShort);
  }, [inputValue]);

  useEffect(() => {
    const knownSites = data && data.length > 0 ? data : [];
    const rcrainfoSites = rcrainfoData && rcrainfoData.length > 0 ? rcrainfoData : [];
    const allOptions: RcraSite[] = [...knownSites, ...rcrainfoSites].filter(
      (value, index, self) => index === self.findIndex((t) => t.epaSiteId === value.epaSiteId)
    );
    setOptions([...allOptions]);
  }, [data, rcrainfoData]);

  useEffect(() => {
    setRcrainfoSitesLoading(isLoading || rcrainfoIsLoading);
  }, [isLoading, rcrainfoIsLoading]);

  const handleInputChange = async (value: string) => {
    setInputValue(value);
  };

  const handleChange = (value: RcraSite | null): void => {
    setSelectedHandler(value);
  };

  return (
    <>
      <HtForm onSubmit={handleSubmit(onSubmit)}>
        <HtForm.Group>
          {searchMessage && (
            <div className="my-2">
              <Alert variant={searchMessage.variant}>{searchMessage.message}</Alert>
            </div>
          )}
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
