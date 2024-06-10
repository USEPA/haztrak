import { RcrainfoSiteSearchBadge } from 'components/Manifest/Handler/Search/RcrainfoSiteSearchBadge';
import { ManifestContext, ManifestContextType } from 'components/Manifest/ManifestForm';
import { Manifest, SiteType, Transporter } from 'components/Manifest/manifestSchema';
import { RcraSite } from 'components/RcraSite';
import { HtForm } from 'components/UI';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import {
  Controller,
  SubmitHandler,
  UseFieldArrayAppend,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { useGetProfileQuery, useSearchRcrainfoSitesQuery, useSearchRcraSitesQuery } from 'store';
import { useDebounce } from 'hooks';

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
  const manifestForm = useFormContext<Manifest>();
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedInputValue = useDebounce(inputValue, 500);

  const [selectedHandler, setSelectedHandler] = useState<RcraSite | null>(null);
  const { org } = useGetProfileQuery(undefined, {
    selectFromResult: ({ data }) => {
      return { org: data?.org };
    },
  });
  const [skip, setSkip] = useState<boolean>(true);
  const { data } = useSearchRcraSitesQuery(
    {
      siteType: handlerType,
      siteId: debouncedInputValue,
    },
    { skip: false }
  );
  const {
    data: rcrainfoData,
    error: rcrainfoError,
    isFetching: fetchingFromRcrainfo,
  } = useSearchRcrainfoSitesQuery(
    {
      siteType: handlerType,
      siteId: debouncedInputValue,
    },
    { skip: !org?.rcrainfoIntegrated }
  );
  const { setGeneratorStateCode, setTsdfStateCode } =
    useContext<ManifestContextType>(ManifestContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [options, setOptions] = useState<RcraSite[]>([]);
  const [rcrainfoSitesLoading, setRcrainfoSitesLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<searchHandlerForm> = () => {
    if (selectedHandler !== null) {
      if (handlerType === 'generator') {
        setGeneratorStateCode(selectedHandler.siteAddress.state.code);
        manifestForm.setValue('generator', { ...selectedHandler });
        searchParams.append('generator', selectedHandler.epaSiteId);
        setSearchParams(searchParams);
      } else if (handlerType === 'designatedFacility') {
        setTsdfStateCode(selectedHandler.siteAddress.state.code);
        manifestForm.setValue('designatedFacility', { ...selectedHandler });
        searchParams.append('tsdf', selectedHandler.epaSiteId);
        setSearchParams(searchParams);
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
    const inputTooShort = inputValue.length < 2;
    setSkip(inputTooShort);
  }, [debouncedInputValue]);

  useEffect(() => {
    const knownSites = data && data.length > 0 ? data : [];
    const rcrainfoSites = rcrainfoData && rcrainfoData.length > 0 ? rcrainfoData : [];
    const allOptions: RcraSite[] = [...knownSites, ...rcrainfoSites].filter(
      (value, index, self) => index === self.findIndex((t) => t.epaSiteId === value.epaSiteId)
    );
    setOptions([...allOptions]);
  }, [data, rcrainfoData]);

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
          <Row className="d-flex justify-content-around">
            <Col>
              <HtForm.Label htmlFor="epaId">EPA ID Number</HtForm.Label>
            </Col>
            <Col className="d-flex justify-content-end">
              <RcrainfoSiteSearchBadge
                isFetching={fetchingFromRcrainfo}
                error={rcrainfoError}
                data={rcrainfoData}
                rcraInfoIntegrated={org?.rcrainfoIntegrated || false}
              />
            </Col>
          </Row>
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
