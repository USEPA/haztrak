import React from 'react';

function StateSelect() {
  return (
    <>
      {StateCode.map((code, index) => {
        return (
          <option value={code} key={index}>
            {code}
          </option>
        );
      })}
    </>
  );
}

const StateCode = [
  'AK',
  'AL',
  'AP',
  'AR',
  'AZ',
  'CA',
  'CO',
  'CT',
  'DC',
  'DE',
  'FL',
  'GA',
  'GU',
  'HI',
  'IA',
  'ID',
  'IL',
  'IN',
  'KS',
  'KY',
  'LA',
  'MA',
  'MD',
  'ME',
  'MI',
  'MN',
  'MO',
  'MS',
  'MT',
  'NC',
  'ND',
  'NE',
  'NH',
  'NJ',
  'NM',
  'NV',
  'NY',
  'OH',
  'OK',
  'OR',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VA',
  'VI',
  'VT',
  'WA',
  'WI',
  'WV',
  'WY',
  'XA',
  'XB',
  'XC',
  'XD',
  'XE',
  'XF',
  'XG',
  'XH',
  'XI',
  'XJ',
];
export default StateSelect;
