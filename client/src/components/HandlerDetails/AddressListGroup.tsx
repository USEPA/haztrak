import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Address } from 'types/Handler';

interface AddressListGroupProps {
  title: string;
  address: Address;
}

export default function AddressListGroup({ title, address }: AddressListGroupProps) {
  return (
    <ListGroup>
      <ListGroup.Item className="p-1" variant="dark">
        {title}
      </ListGroup.Item>
      <ListGroup.Item>
        {address.streetNumber && `${address.streetNumber} `}
        {address.address1 && `${address.address1} `}
        {address.city && `${address.city} `}
        {address.state.code && `${address.state.code} `}
        {address.zip && `${address.zip} `}
      </ListGroup.Item>
    </ListGroup>
  );
}
