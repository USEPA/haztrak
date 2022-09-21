import React from 'react';

function StateSelect() {
  return (
    <>
      {StateCode.map((code, index) => {
        return (
          <option value={JSON.stringify(code)} key={index}>
            {code.description}
          </option>
        );
      })}
    </>
  );
}

const StateCode = [
  { code: 'AK', description: 'Alaska' },
  { code: 'AL', description: 'Alabama' },
  { code: 'AP', description: 'Armed Forces Pacific' },
  { code: 'AR', description: 'Arkansas' },
  { code: 'AZ', description: 'Arizona' },
  { code: 'CA', description: 'California' },
  { code: 'CO', description: 'Colorado' },
  { code: 'CT', description: 'Connecticut' },
  { code: 'DC', description: 'Washington DC' },
  { code: 'DE', description: 'Delaware' },
  { code: 'FL', description: 'Florida' },
  { code: 'GA', description: 'Georgia' },
  { code: 'GU', description: 'Guam' },
  { code: 'HI', description: 'Hawaii' },
  { code: 'IA', description: 'Iowa' },
  { code: 'ID', description: 'Idaho' },
  { code: 'IL', description: 'Illinois' },
  { code: 'IN', description: 'Indiana' },
  { code: 'KS', description: 'Kansas' },
  { code: 'KY', description: 'Kentucky' },
  { code: 'LA', description: 'Louisiana' },
  { code: 'MA', description: 'Massachusetts' },
  { code: 'MD', description: 'Maryland' },
  { code: 'ME', description: 'Maine' },
  { code: 'MI', description: 'Michigan' },
  { code: 'MN', description: 'Minnesota' },
  { code: 'MO', description: 'Missouri' },
  { code: 'MS', description: 'Mississippi' },
  { code: 'MT', description: 'Montana' },
  { code: 'NC', description: 'North Carolina' },
  { code: 'ND', description: 'North Dakota' },
  { code: 'NE', description: 'Nebraska' },
  { code: 'NH', description: 'New Hampshire' },
  { code: 'NJ', description: 'New Jersey' },
  { code: 'NM', description: 'New Mexico' },
  { code: 'NV', description: 'Nevada' },
  { code: 'NY', description: 'New York' },
  { code: 'OH', description: 'Ohio' },
  { code: 'OK', description: 'Oklahoma' },
  { code: 'OR', description: 'Oregon' },
  { code: 'PA', description: 'Pennsylvania' },
  { code: 'PR', description: 'Puerto Rico' },
  { code: 'RI', description: 'Rhode Island' },
  { code: 'SC', description: 'South Carolina' },
  { code: 'SD', description: 'South Dakota' },
  { code: 'TN', description: 'Tennessee' },
  { code: 'TX', description: 'Texas' },
  { code: 'UT', description: 'Utah' },
  { code: 'VA', description: 'Virginia' },
  { code: 'VI', description: 'Virgin Islands' },
  { code: 'VT', description: 'Vermont' },
  { code: 'WA', description: 'Washington' },
  { code: 'WI', description: 'Wisconsin' },
  { code: 'WV', description: 'West Virginia' },
  { code: 'WY', description: 'Wyoming' },
  { code: 'XA', description: 'REGION 01 PURVIEW' },
  { code: 'XB', description: 'REGION 02 PURVIEW' },
  { code: 'XC', description: 'REGION 03 PURVIEW' },
  { code: 'XD', description: 'REGION 04 PURVIEW' },
  { code: 'XE', description: 'REGION 05 PURVIEW' },
  { code: 'XF', description: 'REGION 06 PURVIEW' },
  { code: 'XG', description: 'REGION 07 PURVIEW' },
  { code: 'XH', description: 'REGION 08 PURVIEW' },
  { code: 'XI', description: 'REGION 09 PURVIEW' },
  { code: 'XJ', description: 'REGION 10 PURVIEW' },
];
export default StateSelect;
