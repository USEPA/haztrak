import React, { ChangeEventHandler, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

interface MtnSearchFieldProps {
  value: string;
  onChange: ChangeEventHandler;
}

export function MtnSearchField({ value, onChange }: MtnSearchFieldProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const setMtnSearchParam = (value: string) => {
    if (value) {
      searchParams.set('mtn', value);
    } else {
      searchParams.delete('mtn');
    }
    setSearchParams(searchParams);
  };

  const onBlur = () => {
    setMtnSearchParam(value);
  };

  const onKeyReturn = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setMtnSearchParam(value);
    }
  };

  return (
    <>
      <Form.Control
        id={'mtnGlobalSearch'}
        value={value ?? ''}
        onChange={onChange}
        onBlur={onBlur}
        onKeyUp={onKeyReturn}
        placeholder="search..."
        aria-label="search"
      />
    </>
  );
}
