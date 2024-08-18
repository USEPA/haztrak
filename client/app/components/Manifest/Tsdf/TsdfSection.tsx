import { ErrorMessage } from '@hookform/error-message';
import { HtButton, HtSpinner } from '~/components/legacyUi';
import React, { useEffect } from 'react';
import { Alert, Col } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { Handler, Manifest } from '~/components/Manifest/manifestSchema';
import { QuickSignBtn } from '~/components/Manifest/QuickerSign';
import { RcraSiteDetails } from '~/components/RcraSite';
import { useReadOnly } from '~/hooks/manifest';
import { useHandlerSearchConfig } from '~/hooks/manifest/useOpenHandlerSearch/useHandlerSearchConfig';
import { useGetRcrainfoSiteQuery } from '~/store';

interface TsdfSectionProps {
  setupSign: () => void;
  signAble: boolean;
}

export function TsdfSection({ signAble, setupSign }: TsdfSectionProps) {
  const [, setSearchConfigs] = useHandlerSearchConfig();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    formState: { errors },
    ...manifestForm
  } = useFormContext<Manifest>();
  const tsdf: Handler | undefined = manifestForm.watch('designatedFacility');
  const [readOnly] = useReadOnly();
  const urlTsdfId = searchParams.get('tsdf');
  const { data, isLoading, error } = useGetRcrainfoSiteQuery(urlTsdfId ?? '', {
    skip: !urlTsdfId,
  });

  useEffect(() => {
    if (data) {
      manifestForm.setValue('designatedFacility', data);
    }
  }, [data]);

  if (isLoading) {
    return <HtSpinner size="xl" center className="m-5" />;
  }

  if (error) {
    return (
      <>
        <Alert variant="danger" className="text-center m-3">
          The requested TSDF (EPA ID: {urlTsdfId}) could not be found.
        </Alert>
        <HtButton
          onClick={() => {
            searchParams.delete('tsdf');
            setSearchParams(searchParams);
          }}
          children={'Clear TSDF'}
          variant="outline-danger"
          horizontalAlign
        ></HtButton>
      </>
    );
  }

  return (
    <>
      {tsdf ? (
        <>
          <RcraSiteDetails handler={tsdf} />
          <div className="d-flex justify-content-between">
            {/* Button to bring up the Quicker Sign modal*/}
            <Col className="text-end">
              <QuickSignBtn
                mtnHandler={tsdf}
                onClick={setupSign}
                disabled={tsdf.signed || !signAble}
              />
            </Col>
          </div>
        </>
      ) : (
        <></>
      )}

      {tsdf && !readOnly && (
        // Remove TSDF button
        <HtButton
          onClick={() => {
            manifestForm.setValue('designatedFacility', undefined);
            if (urlTsdfId) {
              searchParams.delete('tsdf');
              setSearchParams(searchParams);
            }
          }}
          children={'Remove TSDF'}
          variant="outline-danger"
          horizontalAlign
        />
      )}
      {!tsdf && (
        <HtButton
          onClick={() => {
            setSearchConfigs({ siteType: 'designatedFacility', open: true });
          }}
          children={'Add TSDF'}
          variant="outline-primary"
          horizontalAlign
        />
      )}
      <ErrorMessage
        errors={errors}
        name={'designatedFacility'}
        render={({ message }) => {
          if (!message) return null;
          return (
            <Alert variant="danger" className="text-center m-3">
              {message}
            </Alert>
          );
        }}
      />
    </>
  );
}
