import { Manifest, ManifestStatus } from 'components/Manifest/manifestSchema';
import { HtForm, InfoIconTooltip } from 'components/UI';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface ManifestStatusProps {
  readOnly?: boolean;
  isDraft?: boolean;
  setManifestStatus: (status: ManifestStatus | undefined) => void;
}

export function ManifestStatusField({ readOnly, isDraft, setManifestStatus }: ManifestStatusProps) {
  const manifestForm = useFormContext<Manifest>();
  return (
    <HtForm.Group>
      <HtForm.Label htmlFor="status" className="mb-0">
        {'Status '}
        {!isDraft && (
          <InfoIconTooltip message={'Once set to scheduled, this field is managed by EPA'} />
        )}
      </HtForm.Label>
      <HtForm.Select
        id="status"
        disabled={readOnly || !isDraft}
        aria-label="manifestStatus"
        {...manifestForm.register('status')}
        onChange={(event) => setManifestStatus(event.target.value as ManifestStatus | undefined)}
      >
        <option value="NotAssigned">Draft</option>
        <option value="Pending">Pending</option>
        <option value="Scheduled">Scheduled</option>
        <option hidden value="InTransit">
          In Transit
        </option>
        <option hidden value="ReadyForSignature">
          Ready for TSDF Signature
        </option>
        <option hidden value="Signed">
          Signed
        </option>
        <option hidden value="Corrected">
          Corrected
        </option>
        <option hidden value="UnderCorrection">
          Under Correction
        </option>
        <option hidden value="MtnValidationFailed">
          MTN Validation Failed
        </option>
      </HtForm.Select>
    </HtForm.Group>
  );
}
