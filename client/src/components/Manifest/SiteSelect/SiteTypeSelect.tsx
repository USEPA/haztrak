import { HtForm } from 'components/Ht';
import { RcraSiteType } from 'components/Manifest/manifestSchema';
import React from 'react';
import { Form } from 'react-bootstrap';
import { Control, Controller } from 'react-hook-form';

interface SiteTypeSelectProps {
  siteType: RcraSiteType | undefined;
  value: RcraSiteType | undefined;
  handleChange: (siteType: RcraSiteType) => void;
  control: Control;
  disabled?: boolean;
}

// The order of this matters. Index of Generator < Transporter < TSDF
const siteTypeOptions = [
  { value: 'Generator', label: 'Generator' },
  { value: 'Transporter', label: 'Transporter' },
  { value: 'Tsdf', label: 'TSDF' },
];

export function SiteTypeSelect({
  siteType,
  handleChange,
  control,
  disabled,
  value,
}: SiteTypeSelectProps) {
  let siteTypeLimitedOptions = siteTypeOptions;
  if (siteType) {
    const siteTypeIndex = siteTypeOptions.findIndex((option) => option.value === siteType);
    siteTypeLimitedOptions = siteTypeOptions.slice(0, siteTypeIndex + 1);
  }
  return (
    <>
      <Controller
        control={control}
        data-testid="siteTypeSelect"
        render={() => (
          <div className="mt-2">
            <HtForm.Label htmlFor="siteType">Site Role</HtForm.Label>
            <Form.Select
              id="siteType"
              aria-label="Site Role"
              disabled={disabled}
              value={value}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                handleChange(event.target.value as RcraSiteType)
              }
              defaultValue={''}
            >
              <option value={''} disabled>
                - -
              </option>
              {siteTypeLimitedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </div>
        )}
        name={'test'}
      />
    </>
  );
}
