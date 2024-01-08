import { ErrorMessage } from '@hookform/error-message';
import { Handler, Manifest } from 'components/Manifest/manifestSchema';
import { QuickSignBtn } from 'components/Manifest/QuickerSign';
import { RcraSiteDetails } from 'components/RcraSite';
import { HtButton } from 'components/UI';
import { useReadOnly } from 'hooks/manifest';
import React from 'react';
import { Alert, Col } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface TsdfSectionProps {
  setupSign: () => void;
  signAble: boolean;
  toggleTsdfFormShow: () => void;
}

export function TsdfSection({ signAble, setupSign, toggleTsdfFormShow }: TsdfSectionProps) {
  const {
    formState: { errors },
    ...manifestForm
  } = useFormContext<Manifest>();
  const tsdf: Handler | undefined = manifestForm.watch('designatedFacility');
  const [readOnly] = useReadOnly();

  return (
    <>
      {tsdf ? (
        <>
          <RcraSiteDetails handler={tsdf} />
          <div className="d-flex justify-content-between">
            {/* Button to bring up the Quicker Sign modal*/}
            <Col className="text-end">
              <QuickSignBtn
                siteType={'Tsdf'}
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
        <HtButton
          onClick={() => {
            manifestForm.setValue('designatedFacility', undefined);
          }}
          children={'Remove TSDF'}
          variant="outline-danger"
          horizontalAlign
        />
      )}
      {!tsdf && (
        <HtButton
          onClick={toggleTsdfFormShow}
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
