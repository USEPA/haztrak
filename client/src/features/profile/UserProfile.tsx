import { zodResolver } from '@hookform/resolvers/zod';
import { HtForm } from 'components/Ht';
import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { HaztrakUser } from 'store/userSlice/user.slice';

interface UserProfileProps {
  user: HaztrakUser;
}

export function UserProfile({ user }: UserProfileProps) {
  const {
    register,
    formState: { errors },
  } = useForm<HaztrakUser>();

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h4>Username</h4>
            <p>{user.username}</p>
            <h4>Email</h4>
            <p>{user.email}</p>
          </Col>
          <Col>
            <h4>First Name</h4>
            <p>{user.firstName}</p>
            <h4>Last Name</h4>
            <p>{user.lastName}</p>
          </Col>
        </Row>
        <div className="mx-1 d-flex flex-row-reverse">
          <Button variant="success">Edit</Button>
        </div>
      </Container>

      <HtForm onSubmit={() => console.log('hello')}>
        <Container>
          <Row className="mb-2">
            <Col>
              <HtForm.Group>
                <HtForm.Label htmlFor="haztrakUserFirstName">First Name</HtForm.Label>
                <Form.Control
                  id="haztrakUserFirstName"
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
                  {...register('email')}
                  placeholder={user.email ? user.email : 'Unknown'}
                  className={errors.email && 'is-invalid'}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </HtForm.Group>
            </Col>
          </Row>
        </Container>
      </HtForm>
    </>
  );
}
