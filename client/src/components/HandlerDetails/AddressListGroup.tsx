import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Address } from 'types/Handler/Handler';

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
      <ListGroup.Item>{`${address.streetNumber} ${address.address1} ${address.city} ${address.state.code} ${address.zip}`}</ListGroup.Item>
    </ListGroup>
  );
}
