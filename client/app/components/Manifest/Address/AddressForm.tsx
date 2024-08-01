import { GeneratorAddress } from '~/components/Manifest/Address/GeneratorAddress';
import React from 'react';

interface Props {
  addressType: 'siteAddress' | 'mailingAddress';
  readOnly?: boolean;
}

/**
 * AddressForm can be used to set a Handler's mailingAddress or siteAddress
 * Needs to be used in the context of a FormProvider
 * We currently only support using this for the generator. HandlerType prop could be added back
 */
export function AddressForm({ addressType, readOnly }: Props) {
  return <GeneratorAddress addressType={addressType} readOnly={readOnly} />;
}
