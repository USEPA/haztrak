import { faCheck, faUser, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { HtForm, HtSpinner } from 'components/Ht';
import { SitePermissions } from 'components/UserProfile/SitePermissions';
import React, { createRef, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { UserApi } from 'services';
import { HaztrakUser, ProfileState, updateUserProfile, useAppDispatch } from 'store';
import { z } from 'zod';

interface UserProfileProps {
  user: HaztrakUser;
  profile: ProfileState;
}

const haztrakUserForm = z.object({
  firstName: z.string().min(4, 'First name must be a least 4 character(s)').optional(),
  lastName: z.string().min(5, 'Last name must be at least 5 character(s)').optional(),
  email: z.string().email('Not a valid email address').optional(),
});

type HaztrakUserForm = z.infer<typeof haztrakUserForm>;

export function UserProfile({ user, profile }: UserProfileProps) {
  const [editable, setEditable] = useState(false);
  const fileRef = createRef<HTMLInputElement>();
  const dispatch = useAppDispatch();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<HaztrakUser>({ values: user, resolver: zodResolver(haztrakUserForm) });

  const onSubmit = (data: HaztrakUserForm) => {
    setEditable(!editable);
    UserApi.updateUser(data)
      .then((response) => {
        // @ts-ignore
        dispatch(updateUserProfile(response.data));
      })
      .catch((error: AxiosError) => toast.error(error.message));
  };

  if (user?.isLoading || profile?.loading) {
    return (
      <Container>
        <HtSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <HtForm onSubmit={handleSubmit(onSubmit)}>
        <Row className="p-2">
          <input
            type="file"
            accept="image/png,image/jpeg"
            ref={fileRef}
            style={{ display: 'none' }}
          />
          <Row>
            <Col>
              <div className="avatar-container d-flex justify-content-center">
                <Button
                  onClick={() => fileRef.current?.click()}
                  className="bg-secondary rounded-circle border-0 shadow"
                >
                  <FontAwesomeIcon icon={faUser} size="5x" className="m-3" />
                </Button>
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
        {profile?.org && (
          <>
            <Row>
              <hr />
              <h3 className="text-center">Organization</h3>
              <Col>
                <b>Name</b>
                <p>{profile.org.name ?? 'My Organization'}</p>
              </Col>
              <Col>
                <b>Integrated with Rcrainfo?</b>
                <p>
                  {profile.org.rcrainfoIntegrated ? (
                    <span>
                      Yes <FontAwesomeIcon icon={faCheck} className="text-success" />
                    </span>
                  ) : (
                    <span>
                      No <FontAwesomeIcon icon={faX} className="text-danger" />
                    </span>
                  )}
                </p>
              </Col>
            </Row>
            <Row>
              <SitePermissions sites={profile.sites} />
              <p>
                Contact your Haztrak admin obtain access to additional sites within your
                organization
              </p>
            </Row>
          </>
        )}
      </HtForm>
    </Container>
  );
}
