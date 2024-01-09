import { Manifest, SubmissionType } from 'components/Manifest/manifestSchema';
import { HtForm } from 'components/UI';
import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { Controller, useFormContext } from 'react-hook-form';

interface SubmissionTypeOption {
  value: SubmissionType;
  label: string;
}

const submissionTypeOptions: Array<SubmissionTypeOption> = [
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'FullElectronic', label: 'Electronic' },
  { value: 'DataImage5Copy', label: 'Data + Image' },
  { value: 'Image', label: 'Image Only' },
];

/** uniform hazardous waste manifest type field. */
export function ManifestTypeSelect({
  readOnly,
  isDraft,
}: {
  readOnly?: boolean;
  isDraft?: boolean;
}) {
  const manifestForm = useFormContext<Manifest>();
  const generatorCanESign = manifestForm.getValues('generator.canEsign');
  const [submissionType, setSubmissionType] = useState<SubmissionType>(
    manifestForm.getValues('submissionType') || 'Hybrid'
  );
  const selectedType = submissionTypeOptions.filter((option) => option.value === submissionType);
  return (
    <HtForm.Group>
      <HtForm.Label htmlFor="submissionType" className="mb-0">
        Type
      </HtForm.Label>
      <Controller
        control={manifestForm.control}
        name={'submissionType'}
        render={({ field }) => (
          <Select
            {...field}
            id="submissionType"
            aria-label="submission type"
            isDisabled={readOnly || !isDraft}
            value={selectedType}
            options={submissionTypeOptions}
            defaultValue={submissionTypeOptions[0]}
            onChange={(option: SingleValue<SubmissionTypeOption>) => {
              if (option) {
                setSubmissionType(option.value);
                field.onChange(option.value);
              }
            }}
            filterOption={(option) =>
              option.label.toLowerCase().includes('electronic') ||
              option.label.toLowerCase().includes('hybrid')
            }
            isOptionDisabled={(option) => option.value === 'FullElectronic' && !generatorCanESign}
            classNames={{
              control: () => 'form-select py-0 rounded-3',
            }}
            components={{ IndicatorSeparator: () => null, DropdownIndicator: () => null }}
          />
        )}
      />
    </HtForm.Group>
  );
}
