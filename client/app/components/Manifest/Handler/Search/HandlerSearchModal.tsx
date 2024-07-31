import { HandlerSearchForm } from 'components/Manifest/Handler';
import { Manifest, Transporter } from 'components/Manifest/manifestSchema';
import { HtModal } from 'components/UI';
import { useHandlerSearchConfig } from 'hooks/manifest/useOpenHandlerSearch/useHandlerSearchConfig';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useFieldArray, useFormContext } from 'react-hook-form';

/**
 * Returns a modal that wraps around the HandlerSearchForm for adding the manifest TSDF
 * @constructor
 */
export function HandlerSearchModal() {
  const manifestForm = useFormContext<Manifest>();
  const [configs, setConfigs] = useHandlerSearchConfig();

  const transporterForm = useFieldArray<Manifest, 'transporters'>({
    control: manifestForm.control,
    name: 'transporters',
  });
  const transporters: Transporter[] = manifestForm.getValues('transporters');

  if (!configs) return null;
  const { siteType, open } = configs;

  const handleClose = () => {
    setConfigs(undefined);
  };

  // set the title and description based on the handlerType
  let title;
  let description;
  if (siteType === 'designatedFacility') {
    title = 'Add Designated Facility';
    description = 'The Treatment, Storage, or Disposal Facility the waste will shipped to.';
  } else if (siteType === 'transporter') {
    title = 'Add Transporter';
    description =
      'Transporters of the hazardous waste shipment. Transporters are required to be registered with EPA at https://rcrainfo.epa.gov.';
  } else {
    title = 'Add Generator';
    description =
      'The site that generated the hazardous waste to be shipped for offsite treatment.';
  }

  return (
    <HtModal showModal={open ? open : false} handleClose={handleClose}>
      <HtModal.Header closeButton>
        <Col>
          <Row>
            <HtModal.Title title={title} />
          </Row>
          <Row>
            <i>
              <small>{description}</small>
            </i>
          </Row>
        </Col>
      </HtModal.Header>
      <HtModal.Body>
        <HandlerSearchForm
          handleClose={handleClose}
          handlerType={siteType}
          currentTransporters={transporters}
          appendTransporter={transporterForm.append}
        />
      </HtModal.Body>
    </HtModal>
  );
}
