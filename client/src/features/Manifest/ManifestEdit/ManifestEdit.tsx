import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

function ManifestEdit(): JSX.Element {
  const [name, setName] = useState('');
  const [option, setOption] = useState('');

  const onChangeInput = (event: any) => {
    setName(event.target.value);
    console.log(event.target.value);
  };

  const onChangeSelect = (event: any) => {
    setOption(event.target.value);
  };

  const onSubmit = (event: any) => {
    event.preventDefault();
    console.log(name);
    console.log(option);
  };

  return (
    <div>
      <Form onSubmit={onSubmit}>
        {/*<label for="name">Name</label>*/}
        <input type="text" id="name" name="name" onChange={onChangeInput} />
        <select
          onChange={onChangeSelect}
          value={option}
          id="options"
          name="options"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
          <option value="option4">Option4</option>
        </select>
      </Form>
    </div>
  );
}

export default ManifestEdit;
