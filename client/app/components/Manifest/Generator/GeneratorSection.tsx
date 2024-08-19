import { ErrorMessage } from '@hookform/error-message';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Stack } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { HtButton } from '~/components/legacyUi';
import { ContactForm, PhoneForm } from '~/components/Manifest/Contact';
import { Handler, Manifest } from '~/components/Manifest/manifestSchema';
import { QuickSignBtn } from '~/components/Manifest/QuickerSign';
import { RcraSiteDetails } from '~/components/RcraSite/RcraSiteDetails';
import { Spinner } from '~/components/ui';
import { useReadOnly } from '~/hooks/manifest';
import { useHandlerSearchConfig } from '~/hooks/manifest/useOpenHandlerSearch/useHandlerSearchConfig';
import { useGetRcrainfoSiteQuery } from '~/store';
import { GeneratorForm } from './GeneratorForm';

interface GeneratorSectionProps {
  setupSign: () => void;
  signAble: boolean;
}

export function GeneratorSection({ setupSign, signAble }: GeneratorSectionProps) {
  const [, setSearchConfigs] = useHandlerSearchConfig();
  const [readOnly] = useReadOnly();
  const [searchParams, setSearchParams] = useSearchParams();
  const manifestForm = useFormContext<Manifest>();
  const { errors } = manifestForm.formState;
  const generator: Handler | undefined = manifestForm.watch('generator');
  const [showGeneratorForm, setShowGeneratorForm] = useState<boolean>(false);
  const toggleShowGeneratorForm = () => setShowGeneratorForm(!showGeneratorForm);
  const urlGeneratorId = searchParams.get('generator');

  const { data, isLoading, error } = useGetRcrainfoSiteQuery(urlGeneratorId ?? '', {
    skip: !urlGeneratorId,
  });

  useEffect(() => {
    if (data) {
      manifestForm.setValue('generator', data);
    }
  }, [data]);

  if (isLoading) {
    return <Spinner size="xl" className="m-5" />;
  }

  if (error) {
    return (
      <>
        <Alert variant="danger" className="text-center m-3">
          The requested Generator (EPA ID: {urlGeneratorId}) could not be found.
        </Alert>
        <HtButton
          onClick={() => {
            searchParams.delete('generator');
            setSearchParams(searchParams);
          }}
          children={'Clear Generator'}
          variant="outline-danger"
          horizontalAlign
        ></HtButton>
      </>
    );
  }

  return (
    <>
      {readOnly ? (
        <>
          <RcraSiteDetails handler={generator} />
          <h4>Emergency Contact Information</h4>
          <ContactForm handlerType="generator" />
          <div className="d-flex justify-content-between">
            <Col className="text-end">
              <QuickSignBtn
                mtnHandler={generator}
                onClick={setupSign}
                disabled={generator?.signed || !signAble}
              />
            </Col>
          </div>
        </>
      ) : generator && !showGeneratorForm ? (
        <>
          <RcraSiteDetails handler={generator} />
          <PhoneForm handlerType={'generator'} />
          <div className="d-flex justify-content-end">
            <Button variant="outline-primary" onClick={toggleShowGeneratorForm}>
              Edit
            </Button>
          </div>
        </>
      ) : showGeneratorForm ? (
        <>
          <GeneratorForm />
          <h4>Emergency Contact Information</h4>
          <ContactForm handlerType="generator" />
        </>
      ) : (
        <>
          <Stack gap={2}>
            <HtButton
              horizontalAlign
              onClick={() => {
                setSearchConfigs({ siteType: 'generator', open: true });
              }}
              children={'Add Generator'}
              variant="outline-primary"
            />
            <HtButton horizontalAlign onClick={toggleShowGeneratorForm} variant="outline-secondary">
              Enter Generator Information
            </HtButton>
          </Stack>
        </>
      )}
      <ErrorMessage
        errors={errors}
        name={'generator'}
        render={({ message }) => {
          if (!message) return null;
          return (
            <Alert variant="danger" className="text-center m-3">
              {message}
            </Alert>
          );
        }}
      />
    </>
  );
}
