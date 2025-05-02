import { HtForm, InfoIconTooltip } from '~/components/legacyUi';

import { Controller, useFormContext } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';
import { Manifest, ManifestStatus } from '~/components/Manifest/manifestSchema';
import { useManifestStatus } from '~/hooks/manifest';
import { manifest } from '~/services';
import { useGetProfileQuery } from '~/store';

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

  const availableStatuses: ManifestStatus[] = profile
    ? manifest.getStatusOptions({
        manifest: manifestForm.getValues(),
        profile: profile,
      })
    : [];

  // Whether the status field should be disabled
  const isStatusDisabled = (
    status: ManifestStatus | undefined,
    readOnly: boolean | undefined,
    isDraft: boolean | undefined
  ) => {
    if (readOnly) return true; // Read only manifests can never be edited
    if (isDraft) return false; // Draft manifests can always be edited if not read only
    if (status === 'NotAssigned') return false; // if editing a previously saved 'NotAssigned', allow editing
    return true;
  };

  return (
    <HtForm.Group>
      <HtForm.Label htmlFor="status" className="mb-0">
        <span>Status </span>
        {!isDraft && (
          <InfoIconTooltip message={'Once set to scheduled, this field is managed by EPA'} />
        )}
      </HtForm.Label>
      <Controller
        name="status"
        control={manifestForm.control}
        render={({ field }) => (
          <Select
            {...field}
            id="status"
            aria-label="status"
            value={selectedStatus}
            options={statusOptions}
            isDisabled={isStatusDisabled(status, readOnly, isDraft)}
            data-testid="manifestStatus"
            isLoading={profileLoading || !profile}
            onChange={(option: SingleValue<StatusOption>) => {
              if (option) {
                setStatus(option.value);
                field.onChange(option.value);
              }
            }}
            filterOption={(option) =>
              // Hide options that are managed by EPA
              availableStatuses.includes(option.value as ManifestStatus) ||
              option.value === 'Scheduled'
            }
            isOptionDisabled={(option) =>
              // Disable the 'Scheduled' option if it's not available
              option.value === 'Scheduled' && !availableStatuses.includes('Scheduled')
            }
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
