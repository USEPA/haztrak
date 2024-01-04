import { Manifest, SubmissionType } from 'components/Manifest/manifestSchema';
import { HtForm } from 'components/UI';
import React from 'react';
import Select from 'react-select';
import { useFormContext } from 'react-hook-form';

const submissionTypeOptions: Array<{ value: SubmissionType; label: string }> = [
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'FullElectronic', label: 'Electronic' },
  { value: 'DataImage5Copy', label: 'Data + Image' },
  { value: 'Image', label: 'Image Only' },
];

const DEFAULT_SUBMISSION_TYPE = submissionTypeOptions[0];

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
  return (
    <HtForm.Group>
      <HtForm.Label htmlFor="submissionType" className="mb-0">
        Type
      </HtForm.Label>
      <Select
        id="submissionType"
        isDisabled={readOnly || !isDraft}
        aria-label="submissionType"
        {...manifestForm.register('submissionType')}
        options={submissionTypeOptions}
        getOptionValue={(option) => option.value}
        defaultValue={DEFAULT_SUBMISSION_TYPE}
        classNames={{
          control: () => 'form-select py-0 rounded-3',
        }}
        components={{ IndicatorSeparator: () => null, DropdownIndicator: () => null }}
        onChange={(option) => {
          if (option) manifestForm.setValue('submissionType', option.value);
        }}
        filterOption={(option) =>
          option.label.toLowerCase().includes('electronic') ||
          option.label.toLowerCase().includes('hybrid')
        }
        isOptionDisabled={(option) => option.value === 'FullElectronic' && !generatorCanESign}
      />
    </HtForm.Group>
  );
}
