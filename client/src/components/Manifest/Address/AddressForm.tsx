import { GeneratorAddress } from 'components/Manifest/Address/GeneratorAddress';
import React, { useContext } from 'react';

interface Props {
  addressType: 'siteAddress' | 'mailingAddress';
  handlerType: 'generator' | 'designatedFacility';
  readOnly?: boolean;
}

/**
 * AddressForm can be used to set a Handler's mailingAddress or siteAddress
 * Needs to be used in the context of a FormProvider
 */
export function AddressForm({ addressType, handlerType, readOnly }: Props) {
  if (handlerType === 'generator') {
    return <GeneratorAddress addressType={addressType} readOnly={readOnly} />;
  }
}
