import { ErrorMessage } from '@hookform/error-message';
import { AddHandler } from 'components/Manifest/Handler';
import { Manifest, Transporter } from 'components/Manifest/manifestSchema';
import { TransporterTable } from 'components/Manifest/Transporter/TransporterTable';
import { HtButton } from 'components/UI';
import { useReadOnly } from 'hooks/manifest';
import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useFieldArray, useFormContext } from 'react-hook-form';

interface TransporterSectionProps {
  setupSign: () => void;
}

export function TransporterSection({ setupSign }: TransporterSectionProps) {
  const [readOnly] = useReadOnly();
  const manifestForm = useFormContext<Manifest>();
  const { errors } = manifestForm.formState;
  const transporterForm = useFieldArray<Manifest, 'transporters'>({
    control: manifestForm.control,
    name: 'transporters',
  });
  const transporters: Array<Transporter> = manifestForm.getValues('transporters');

  const [showAddTransporterForm, setShowAddTransporterForm] = useState<boolean>(false);
  const toggleTranSearchShow = () => setShowAddTransporterForm(!showAddTransporterForm);

  return (
    <>
      <TransporterTable
        transporters={transporters}
        arrayFieldMethods={transporterForm}
        setupSign={setupSign}
      />
      {readOnly ? (
        <></>
      ) : (
        <HtButton
          onClick={toggleTranSearchShow}
          children={'Add Transporter'}
          variant="outline-primary"
          horizontalAlign
        />
      )}
      <ErrorMessage
        errors={errors}
        name={'transporters'}
        render={({ message }) => (
          <Alert variant="danger" className="text-center m-3">
            {message}
          </Alert>
        )}
      />
      <AddHandler
        handleClose={toggleTranSearchShow}
        show={showAddTransporterForm}
        currentTransporters={transporters}
        appendTransporter={transporterForm.append}
        handlerType="transporter"
      />
    </>
  );
}
