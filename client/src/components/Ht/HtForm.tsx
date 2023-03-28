import React, { ReactElement } from 'react';
import {
  Form,
  FormCheckProps,
  FormControlProps,
  FormGroupProps,
  FormLabelProps,
  FormProps,
  FormSelectProps,
  InputGroup,
  InputGroupProps,
} from 'react-bootstrap';

function HtForm(props: FormProps): ReactElement {
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
    <Form.Label {...props} className="mb-0 fw-bold">
      {props.children}
    </Form.Label>
  );
};

HtForm.Control = React.forwardRef<HTMLInputElement, FormControlProps>(
  (props: FormControlProps, ref: React.Ref<HTMLInputElement>) => {
    return (
      <Form.Control autoFocus={true} ref={ref} {...props} className="mt-0">
        {props.children}
      </Form.Control>
    );
  }
);

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
    return (
      <Form.Switch ref={ref} {...props}>
        {props.children}
      </Form.Switch>
    );
  }
);

export default HtForm;
