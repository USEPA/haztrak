import React, { ReactElement } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { HtCard } from '~/components/legacyUi';
import { RcraProfile } from '~/components/RcraProfile';
import { Spinner } from '~/components/ui';
import { UserInfoForm } from '~/components/User';
import { useTitle } from '~/hooks';
import { useGetProfileQuery, useGetRcrainfoProfileQuery, useGetUserQuery } from '~/store';
import { AvatarForm } from '~/features/profile/components/AvatarForm';

/**
 * Display user profile, including their Haztrak information, their organization,
 * and their RCRAInfo profile.
 * @constructor
 */
export function Profile(): ReactElement {
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
  const { data: user, isLoading: userLoading } = useGetUserQuery();
  const { data: rcrainfoProfile } = useGetRcrainfoProfileQuery('testuser1');
  const isLoading = profileLoading || userLoading;
  useTitle('Profile');

  if (isLoading || !user || !profile) {
    return <Spinner size="lg" />;
  }

  if (!profile || !user) {
    return <div>Error loading profile</div>;
  }

  return (
    <>
      <Container fluid className="py-2">
        <h1 className="tw-text-2xl tw-font-bold">Profile</h1>
        <Row className="my-3 tw-flex tw-justify-center">
          <Col xs={12} md={10} lg={8} className="my-3">
            <HtCard title="User Information" className="h-100 my-2">
              <HtCard.Body>
                <AvatarForm avatar={profile?.avatar} />
                <UserInfoForm user={user} profile={profile} />
              </HtCard.Body>
            </HtCard>
          </Col>
        </Row>
        <Row className="tw-flex tw-justify-center">
          <Col xs={12} md={10} lg={8}>
            <HtCard title="RCRAInfo Profile">
              <HtCard.Body>
                {rcrainfoProfile && <RcraProfile profile={rcrainfoProfile} />}
              </HtCard.Body>
            </HtCard>
          </Col>
        </Row>
      </Container>
    </>
  );
}
