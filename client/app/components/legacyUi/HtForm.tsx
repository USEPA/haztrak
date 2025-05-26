import React, { ReactElement } from 'react';
import {
  Form,
  FormCheckProps,
  FormGroupProps,
  FormLabelProps,
  FormProps,
  FormSelectProps,
  InputGroup,
  InputGroupProps,
} from 'react-bootstrap';

export function HtForm(props: FormProps): ReactElement {
  return <Form {...props}>{props.children}</Form>;
}

HtForm.Group = function (props: FormGroupProps): ReactElement {
  return (
    <Form.Group {...props} className="mb-2">
      {props.children}
    </Form.Group>
  );
};

HtForm.InputGroup = function (props: InputGroupProps): ReactElement {
  return (
    <InputGroup {...props} className="mb-2">
      {props.children}
    </InputGroup>
  );
};

HtForm.Label = function (props: FormLabelProps): ReactElement {
  return (
    <Form.Label {...props} className={`mb-0 fw-bold ${props.className}`}>
      {props.children}
    </Form.Label>
  );
};

HtForm.Check = React.forwardRef<HTMLInputElement, FormCheckProps>(
  (props: FormCheckProps, ref: React.Ref<HTMLInputElement>) => {
    return (
      <Form.Check ref={ref} {...props}>
        {props.children}
      </Form.Check>
    );
  }
);

HtForm.Select = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  (props: FormSelectProps, ref: React.Ref<HTMLSelectElement>) => {
    return (
      <Form.Select ref={ref} {...props}>
        {props.children}
      </Form.Select>
    );
  }
);

HtForm.Switch = React.forwardRef<HTMLInputElement, FormCheckProps>(
  (props: FormCheckProps, ref: React.Ref<HTMLInputElement>) => {
    const { children, ...rest } = props;
    return (
      <Form.Check ref={ref} {...rest} type="switch">
        {children}
      </Form.Check>
    );
  }
);
