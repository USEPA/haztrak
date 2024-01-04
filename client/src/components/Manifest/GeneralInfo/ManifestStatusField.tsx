import { Manifest, ManifestStatus } from 'components/Manifest/manifestSchema';
import { HtForm, InfoIconTooltip } from 'components/UI';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useAppDispatch, useAppSelector, useGetProfileQuery } from 'store';
import { selectManifestStatus, setStatus } from 'store/manifestSlice/manifest.slice';
import { manifest } from 'services';
import Select, { SingleValue } from 'react-select';

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
export function ManifestStatusField({ readOnly, isDraft }: ManifestStatusFieldProps) {
  const dispatch = useAppDispatch();
  const status = statusOptions.filter(
    (value) => value.value === useAppSelector(selectManifestStatus)
  );
  const manifestForm = useFormContext<Manifest>();
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();

  const availableStatuses = manifest.getStatusOptions({
    manifest: manifestForm.getValues(),
    // @ts-ignore
    profile: profile,
  });
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
        value={status}
        isLoading={profileLoading || !profile}
        classNames={{
          control: () => 'form-select py-0 rounded-3',
        }}
        onChange={(option: SingleValue<StatusOption>) => {
          if (option) dispatch(setStatus(option.value));
        }}
        options={statusOptions}
        filterOption={(option) => availableStatuses.includes(option.value as ManifestStatus)}
        components={{ IndicatorSeparator: () => null, DropdownIndicator: () => null }}
      />
    </HtForm.Group>
  );
}
