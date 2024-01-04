import { Manifest, ManifestStatus } from 'components/Manifest/manifestSchema';
import { HtForm, InfoIconTooltip } from 'components/UI';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useAppDispatch } from 'store';
import { setStatus } from 'store/manifestSlice/manifest.slice';

interface ManifestStatusFieldProps {
  readOnly?: boolean;
  isDraft?: boolean;
}

export function ManifestStatusField({ readOnly, isDraft }: ManifestStatusFieldProps) {
  const manifestForm = useFormContext<Manifest>();
  const dispatch = useAppDispatch();
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
        defaultValue={'NotAssigned'}
        onChange={(event) => {
          dispatch(setStatus(event.target.value as ManifestStatus));
        }}
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
