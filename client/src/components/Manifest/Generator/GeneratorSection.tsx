import { ErrorMessage } from '@hookform/error-message';
import { ContactForm, PhoneForm } from 'components/Manifest/Contact';
import { Handler, Manifest } from 'components/Manifest/manifestSchema';
import { QuickSignBtn } from 'components/Manifest/QuickerSign';
import { RcraSiteDetails } from 'components/RcraSite';
import { HtButton } from 'components/UI';
import { useReadOnly } from 'hooks/manifest';
import React, { useState } from 'react';
import { Alert, Button, Col, Stack } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { GeneratorForm } from './GeneratorForm';

interface GeneratorSectionProps {
  setupSign: () => void;
  toggleShowAddGenerator: () => void;
  signAble: boolean;
}

export function GeneratorSection({
  setupSign,
  signAble,
  toggleShowAddGenerator,
}: GeneratorSectionProps) {
  const [readOnly] = useReadOnly();
  const manifestForm = useFormContext<Manifest>();
  const errors = manifestForm.formState.errors;
  const generator: Handler | undefined = manifestForm.getValues('generator');
  const [showGeneratorForm, setShowGeneratorForm] = useState<boolean>(false);
  const toggleShowGeneratorForm = () => setShowGeneratorForm(!showGeneratorForm);
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
                siteType={'Generator'}
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
              onClick={toggleShowAddGenerator}
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
