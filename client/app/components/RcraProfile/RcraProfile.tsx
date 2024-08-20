import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { HtForm } from '~/components/legacyUi';
import { SyncRcrainfoProfileBtn } from '~/components/RcraProfile/SyncRcrainfoProfileBtn';
import { Spinner } from '~/components/ui';
import { useProgressTracker } from '~/hooks';
import { RcrainfoProfileState, useAppDispatch, useUpdateRcrainfoProfileMutation } from '~/store';
import { userApi } from '~/store/userApi/userApi';

interface ProfileViewProps {
  profile: RcrainfoProfileState;
}

const rcraProfileForm = z.object({
  rcraAPIID: z.string().min(36).optional().or(z.string().nullable()),
  rcraAPIKey: z.string().min(20).optional().or(z.string().nullable()),
  rcraUsername: z.string().min(8).optional(),
});

type RcraProfileForm = z.infer<typeof rcraProfileForm>;

export function RcraProfile({ profile }: ProfileViewProps) {
  const dispatch = useAppDispatch();
  const [editable, setEditable] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [taskId, setTaskId] = useState<undefined | string>();
  const [updateRcrainfoProfile] = useUpdateRcrainfoProfileMutation();
  const { ...formValues } = profile;
  const { inProgress } = useProgressTracker({
    taskId: taskId,
  });

  useEffect(() => {
    // ToDo: invalidating tags should be done in the slice
    dispatch(userApi.util?.invalidateTags(['rcrainfoProfile']));
  }, [inProgress]);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RcraProfileForm>({
    values: formValues,
    resolver: zodResolver(rcraProfileForm),
  });

  /** submitting the RcrainfoProfile form (RCRAInfo API ID, Key, username, etc.)*/
  const onSubmit = (data: RcraProfileForm) => {
    setProfileLoading(!profileLoading);
    setEditable(!editable);
    updateRcrainfoProfile({ username: profile.user, data: data });
  };

  if (profile.isLoading) return <Spinner size="xl" />;

  return (
    <>
      <HtForm onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <Row className="mb-2">
            <Col>
              <HtForm.Group>
                <HtForm.Label htmlFor="profileRcraUsername">RCRAInfo Username</HtForm.Label>
                <Form.Control
                  plaintext={!editable}
                  readOnly={!editable}
                  id="profileRcraUsername"
                  {...register('rcraUsername')}
                  placeholder={profile.rcraUsername ? profile.rcraUsername : 'Not Provided'}
                  className={errors.rcraUsername && 'is-invalid'}
                />
                <div className="invalid-feedback">{errors.rcraUsername?.message}</div>
              </HtForm.Group>
            </Col>
            <Col>
              <HtForm.Group>
                <HtForm.Label htmlFor="profileRcraAPIID">RCRAInfo API ID</HtForm.Label>
                <Form.Control
                  plaintext={!editable}
                  readOnly={!editable}
                  id="profileRcraAPIID"
                  {...register('rcraAPIID')}
                  placeholder={profile.rcraAPIID ? profile.rcraAPIID : 'Not Provided'}
                  className={errors.rcraAPIID && 'is-invalid'}
                />
                <div className="invalid-feedback">{errors.rcraAPIID?.message}</div>
              </HtForm.Group>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <HtForm.Group>
                <HtForm.Label htmlFor="profileRcraAPIKey">RCRAInfo API Key</HtForm.Label>
                <Form.Control
                  type="password"
                  plaintext={!editable}
                  readOnly={!editable}
                  id="profileRcraAPIKey"
                  {...register('rcraAPIKey')}
                  placeholder="●●●●●●●●●●●"
                  className={errors.rcraAPIKey && 'is-invalid'}
                />
                <div className="invalid-feedback">{errors.rcraAPIKey?.message}</div>
              </HtForm.Group>
            </Col>
          </Row>
          <Row>
            <div className="mx-1 d-flex flex-row justify-content-end">
              <Button
                className="mx-2"
                variant={editable ? 'danger' : 'primary'}
                type="button"
                onClick={() => {
                  setEditable(!editable);
                  reset();
                }}
              >
                {editable ? 'Cancel' : 'Edit'}
              </Button>
              <Button className="mx-2" disabled={!editable} variant="success" type="submit">
                Save
              </Button>
            </div>
          </Row>
        </Container>
      </HtForm>
      <Container>
        <h4>RCRAInfo Sites</h4>
        {inProgress ? (
          <Spinner />
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>EPA ID</th>
                <th>e-Manifest</th>
                <th>Biennial Report</th>
                <th>Annual Report</th>
                <th>WIETS</th>
                <th>my RCRA ID</th>
              </tr>
            </thead>
            <tbody>
              {profile.rcraSites &&
                Object.values(profile.rcraSites).map((site) => {
                  return (
                    <tr key={`permissionsRow${site.epaSiteId}`}>
                      <td>{site.epaSiteId}</td>
                      <td>{site.permissions.eManifest}</td>
                      <td>{site.permissions.biennialReport}</td>
                      <td>{site.permissions.annualReport}</td>
                      <td>{site.permissions.WIETS}</td>
                      <td>{site.permissions.myRCRAid}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        )}
      </Container>
      <div className="m-1 d-flex flex-row-reverse">
        <SyncRcrainfoProfileBtn taskId={taskId} setTaskId={setTaskId} />
      </div>
    </>
  );
}
