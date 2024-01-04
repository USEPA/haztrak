import { Manifest, ManifestStatus } from 'components/Manifest/manifestSchema';
import { HtForm, InfoIconTooltip } from 'components/UI';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useGetProfileQuery } from 'store';
import { manifest } from 'services';
import Select, { SingleValue } from 'react-select';
import { useManifestStatus } from 'hooks/manifest';

interface StatusOption {
  value: ManifestStatus;
  label: string;
}

const statusOptions: StatusOption[] = [
  { value: 'NotAssigned', label: 'Draft' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'InTransit', label: 'In Transit' },
  { value: 'ReadyForSignature', label: 'Ready for TSDF Signature' },
  { value: 'Signed', label: 'Signed' },
  { value: 'Corrected', label: 'Corrected' },
  { value: 'UnderCorrection', label: 'Under Correction' },
  { value: 'MtnValidationFailed', label: 'MTN Validation Failed' },
];

interface ManifestStatusFieldProps {
  readOnly?: boolean;
  isDraft?: boolean;
}

/** uniform hazardous waste manifest status field. */
export function ManifestStatusSelect({ readOnly, isDraft }: ManifestStatusFieldProps) {
  const [status, setStatus] = useManifestStatus();
  const selectedStatus = statusOptions.filter((value) => value.value === status);
  const manifestForm = useFormContext<Manifest>();
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();

  const availableStatuses: Array<ManifestStatus> = profile
    ? manifest.getStatusOptions({
        manifest: manifestForm.getValues(),
        profile: profile,
      })
    : [];

  return (
    <HtForm.Group>
      <HtForm.Label htmlFor="status" className="mb-0">
        <span>Status </span>
        {!isDraft && (
          <InfoIconTooltip message={'Once set to scheduled, this field is managed by EPA'} />
        )}
      </HtForm.Label>
      <Select
        id="status"
        isDisabled={readOnly || !isDraft}
        data-testid="manifestStatus"
        aria-label="manifestStatus"
        {...manifestForm.register('status')}
        value={selectedStatus}
        isLoading={profileLoading || !profile}
        classNames={{
          control: () => 'form-select py-0 rounded-3',
        }}
        onChange={(option: SingleValue<StatusOption>) => {
          if (option) setStatus(option.value);
        }}
        options={statusOptions}
        filterOption={(option) =>
          // Hide options that are managed by EPA
          availableStatuses.includes(option.value as ManifestStatus) || option.value === 'Scheduled'
        }
        isOptionDisabled={(option) =>
          // Disable the 'Scheduled' option if it's not available
          option.value === 'Scheduled' && !availableStatuses.includes('Scheduled')
        }
        components={{ IndicatorSeparator: () => null, DropdownIndicator: () => null }}
      />
    </HtForm.Group>
  );
}
