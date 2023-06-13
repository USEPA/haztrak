import { zodResolver } from '@hookform/resolvers/zod';
import { HtForm } from 'components/Ht';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { htApi } from 'services';
import { getProfile, updateProfile } from 'store/rcraProfileSlice';
import { HaztrakUser } from 'store/userSlice/user.slice';
import { an } from 'vitest/dist/types-dea83b3d';

interface UserProfileProps {
  user: HaztrakUser;
}

export function UserProfile({ user }: UserProfileProps) {
  const [editable, setEditable] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<HaztrakUser>({ values: user });

  const onSubmit = (data: any) => {
    setEditable(!editable);
    console.log('data', data);
  };

  return (
    <Container>
      <HtForm onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-2">
          <Col>
            <HtForm.Group>
              <HtForm.Label htmlFor="haztrakUserFirstName">First Name</HtForm.Label>
              <Form.Control
                id="haztrakUserFirstName"
                plaintext={!editable}
                readOnly={!editable}
                {...register('firstName')}
                placeholder={user.firstName ? user.firstName : 'Unknown'}
                className={errors.firstName && 'is-invalid'}
              />
              <div className="invalid-feedback">{errors.firstName?.message}</div>
            </HtForm.Group>
          </Col>
          <Col>
            <HtForm.Group>
              <HtForm.Label htmlFor="haztrakUserLastName">Last Name</HtForm.Label>
              <Form.Control
                id="haztrakUserLastName"
                plaintext={!editable}
                readOnly={!editable}
                {...register('lastName')}
                placeholder={user.lastName ? user.lastName : 'Unknown'}
                className={errors.lastName && 'is-invalid'}
              />
              <div className="invalid-feedback">{errors.lastName?.message}</div>
            </HtForm.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <HtForm.Group>
              <HtForm.Label htmlFor="haztrakUserEmail">Email</HtForm.Label>
              <Form.Control
                id="haztrakUserEmail"
                plaintext={!editable}
                readOnly={!editable}
                {...register('email')}
                placeholder={user.email ? user.email : 'Unknown'}
                className={errors.email && 'is-invalid'}
              />
              <div className="invalid-feedback">{errors.email?.message}</div>
            </HtForm.Group>
          </Col>
        </Row>
        <Row>
          <div className="mx-1 d-flex flex-row-reverse">
            {!editable ? (
              <>
                <Button
                  className="mx-2"
                  variant="success"
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    setEditable(!editable);
                  }}
                >
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button className="mx-2" variant="success" type="submit">
                  Save
                </Button>
                <Button
                  className="mx-2"
                  variant="danger"
                  onClick={() => {
                    setEditable(!editable);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Row>
      </HtForm>
    </Container>
  );
}
