import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';
import { Manifest, ManifestStatus, SubmissionType } from '~/components/Manifest/manifestSchema';
import { HtForm } from '~/components/legacyUi';
import { useManifestStatus } from '~/hooks/manifest';

interface SubmissionTypeOption {
  value: SubmissionType;
  label: string;
}

const submissionTypeOptions: SubmissionTypeOption[] = [
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
  const [status] = useManifestStatus();
  const generatorCanESign = manifestForm.getValues('generator.canEsign');
  const [submissionType, setSubmissionType] = useState<SubmissionType>(
    manifestForm.getValues('submissionType') || 'Hybrid'
  );
  const selectedType = submissionTypeOptions.filter((option) => option.value === submissionType);

  const isTypeDisabled = (
    readOnly: boolean | undefined,
    isDraft: boolean | undefined,
    status: ManifestStatus | undefined
  ) => {
    if (readOnly) return true; // Read only manifests can never be edited
    if (isDraft) return false; // Draft manifests can always be edited if not read only
    if (status === 'NotAssigned') return false; // if editing a previously saved 'NotAssigned', allow editing
    return true;
  };

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
            isDisabled={isTypeDisabled(readOnly, isDraft, status)}
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
