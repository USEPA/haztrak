import { zodResolver } from '@hookform/resolvers/zod';
import React, { createRef, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { HtForm } from '~/components/legacyUi';
import { Avatar, AvatarFallback, AvatarImage, Spinner } from '~/components/ui';
import { HaztrakUser, ProfileSlice, useUpdateUserMutation } from '~/store';
import { FaUser } from 'react-icons/fa';

interface UserProfileProps {
  user: HaztrakUser;
  profile?: ProfileSlice;
}

const haztrakUserForm = z.object({
  firstName: z.string().min(4, 'First name must be a least 4 character(s)').optional(),
  lastName: z.string().min(5, 'Last name must be at least 5 character(s)').optional(),
  email: z.string().email('Not a valid email address').optional(),
});

type HaztrakUserForm = z.infer<typeof haztrakUserForm>;

export function UserInfoForm({ user }: UserProfileProps) {
  const [editable, setEditable] = useState(false);
  const [updateUser] = useUpdateUserMutation();
  const fileRef = createRef<HTMLInputElement>();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<HaztrakUser>({ values: user, resolver: zodResolver(haztrakUserForm) });

  const onSubmit = (data: HaztrakUserForm) => {
    setEditable(!editable);
    updateUser({ ...user, ...data });
  };

  if (!user) return <Spinner />;

  return (
    <HtForm onSubmit={handleSubmit(onSubmit)}>
      <Row className="p-2">
        <input
          type="file"
          accept="image/png,image/jpeg"
          aria-label="Profile Picture"
          ref={fileRef}
          style={{ display: 'none' }}
        />
        <Row>
          <Col>
            <div className="avatar-container d-flex justify-content-center">
              <button onClick={() => fileRef.current?.click()}>
                <Avatar className="tw-h-40 tw-w-40">
                  {/* ToDo: pipe dream, we currently do not use avatar iamges */}
                  <AvatarImage src="" alt="avatar" />
                  <AvatarFallback>
                    <FaUser size={80} />
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
            <div className="d-flex justify-content-center">
              <h2>{user.username}</h2>
            </div>
          </Col>
        </Row>
      </Row>
      <Row className="mb-2">
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor="haztrakUserFirstName">First Name</HtForm.Label>
            <Form.Control
              id="haztrakUserFirstName"
              plaintext={!editable}
              readOnly={!editable}
              {...register('firstName')}
              placeholder={user.firstName ? user.firstName : 'Not Provided'}
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
              placeholder={user.lastName ? user.lastName : 'Not Provided'}
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
              placeholder={user.email ? user.email : 'Not Provided'}
              className={errors.email && 'is-invalid'}
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </HtForm.Group>
        </Col>
      </Row>
      <Row className="my-1">
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
  );
}
