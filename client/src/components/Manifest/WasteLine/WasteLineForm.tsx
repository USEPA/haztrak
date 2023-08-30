import { zodResolver } from '@hookform/resolvers/zod';
import { AdditionalInfoForm } from 'components/AdditionalInfo/AdditionalInfoForm';
import { HtCard, HtForm } from 'components/Ht';
import { Manifest } from 'components/Manifest/manifestSchema';
import { dotIdNumbers } from 'components/Manifest/WasteLine/dotInfo';
import { HazardousWasteForm } from 'components/Manifest/WasteLine/HazardousWasteForm';
import { WasteLine, wasteLineSchema } from 'components/Manifest/WasteLine/wasteLineSchema';
import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Controller, FormProvider, UseFieldArrayReturn, useForm } from 'react-hook-form';
import { QuantityForm } from './QuantityForm';

interface WasteLineFormProps {
  handleClose: () => void;
  waste?: WasteLine;
  lineNumber: number;
  wasteArrayMethods: UseFieldArrayReturn<Manifest, 'wastes'>;
}

/**
 * WasteLineForm is the top level component/form for adding wastes to
 * the uniform hazardous waste manifest.
 * @constructor
 */
export function WasteLineForm({
  handleClose,
  wasteArrayMethods,
  waste,
  lineNumber,
}: WasteLineFormProps) {
  const [dotHazardous, setDotHazardous] = React.useState<boolean>(
    waste?.dotHazardous ? waste.dotHazardous : true
  );
  const [epaWaste, setEpaWaste] = React.useState<boolean>(waste?.epaWaste ? waste.epaWaste : true);
  // @ts-ignore
  const wasteLineDefaultValues: Partial<WasteLine> = waste
    ? waste
    : {
        lineNumber: lineNumber,
        dotHazardous: dotHazardous,
        epaWaste: epaWaste,
        quantity: { containerNumber: 1, quantity: 1 },
      };
  const wasteMethods = useForm<WasteLine>({
    resolver: zodResolver(wasteLineSchema),
    defaultValues: {
      ...wasteLineDefaultValues,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = wasteMethods;

  /**
   * onSubmit is the callback function for the form submission.
   * @param wasteLine the data submitted from the form
   */
  const onSubmit = (wasteLine: WasteLine) => {
    if (waste) {
      wasteArrayMethods.update(lineNumber, wasteLine); // append the new waste line to the manifest
    } else {
      wasteArrayMethods.append(wasteLine); // append the new waste line to the manifest
    }
    handleClose();
  };

  /**
   * toggleDotHazardous - set state and form value for DOT hazardous
   * If DOT hazardous is set to false, then EPA waste must also be false.
   * @param checked
   */
  const toggleDotHazardous = (checked: boolean) => {
    setValue('dotHazardous', checked);
    setDotHazardous(checked);
    if (!checked) {
      setValue('epaWaste', false);
      setEpaWaste(false);
    }
  };

  /**
   * toggleEpaWaste - set state and form value for EPA waste
   * If EPA waste is set to true, then DOT hazardous must also be true.
   * If EPA waste is set to false, then federal waste codes must be cleared.
   * @param checked
   */
  const toggleEpaWaste = (checked: boolean) => {
    setValue('epaWaste', checked);
    setEpaWaste(checked);
    if (checked) {
      setValue('dotHazardous', true);
      setDotHazardous(true);
    }
    if (!checked) {
      setValue('hazardousWaste.federalWasteCodes', []);
    }
  };

  return (
    <FormProvider {...wasteMethods}>
      <HtForm onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <HtCard border={'secondary'}>
            <HtCard.Body>
              <h5>General Information</h5>
              <Container className="ms-2">
                <Row>
                  <Controller
                    control={wasteMethods.control}
                    name={'dotHazardous'}
                    render={({ field }) => (
                      <HtForm.Switch
                        id="dotHazardousSwitch"
                        label="DOT Hazardous Material?"
                        {...register('dotHazardous')}
                        onChange={(e) => toggleDotHazardous(e.target.checked)}
                      />
                    )}
                  />
                </Row>
                <Row>
                  <Controller
                    control={wasteMethods.control}
                    name={'epaWaste'}
                    render={({ field }) => (
                      <HtForm.Switch
                        id="epaWasteSwitch"
                        label="EPA Hazardous Waste?"
                        {...register('epaWaste')}
                        onChange={(e) => toggleEpaWaste(e.target.checked)}
                      />
                    )}
                  />
                </Row>
                <Row>
                  <HtForm.Switch
                    id="pcbSwitch"
                    aria-label="PCBWaste"
                    label="PCB waste?"
                    {...register('pcb')}
                  />
                </Row>
                <Row>
                  <HtForm.Switch
                    id="brSwitch"
                    aria-label="biennialReport"
                    label="Supply Biennial Report (BR) data?"
                    {...register('br')}
                  />
                </Row>
              </Container>
              {!dotHazardous && (
                <Row>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="wasteDescription">Waste Description</HtForm.Label>
                    <Form.Control
                      id="wasteDescription"
                      as="textarea"
                      className={errors.wasteDescription && 'is-invalid'}
                      {...register(`wasteDescription`)}
                    />
                    <div className="invalid-feedback">{errors.wasteDescription?.message}</div>
                  </HtForm.Group>
                </Row>
              )}
              {dotHazardous && (
                <Row>
                  <Col xs={9}>
                    <HtForm.Group>
                      <HtForm.Label htmlFor="dotDescription">DOT Description</HtForm.Label>
                      <Form.Control
                        id="dotDescription"
                        as="textarea"
                        {...register(`dotInformation.printedDotInformation`)}
                        className={errors.dotInformation?.printedDotInformation && 'is-invalid'}
                      />
                      <div className="invalid-feedback">
                        {errors.dotInformation?.printedDotInformation?.message}
                      </div>
                    </HtForm.Group>
                  </Col>
                  <Col>
                    <HtForm.Group>
                      <HtForm.Label htmlFor="dotDescription">DOT ID Number</HtForm.Label>
                      <Form.Select
                        id="dotIdNumber"
                        as="input"
                        defaultValue={''}
                        {...register(`dotInformation.idNumber.code`)}
                        className={errors.dotInformation?.idNumber && 'is-invalid'}
                      >
                        <option value="">Select ID Number</option>
                        {dotIdNumbers.map((idNumber) => (
                          <option key={idNumber} value={idNumber}>
                            {idNumber}
                          </option>
                        ))}
                      </Form.Select>
                      <div className="invalid-feedback">
                        {errors.dotInformation?.idNumber?.code?.message}
                      </div>
                    </HtForm.Group>
                  </Col>
                </Row>
              )}
            </HtCard.Body>
          </HtCard>
          <HtCard border={'secondary'}>
            <HtCard.Body>
              <h5>Container and Quantity</h5>
              <Row className="mb-2">
                <QuantityForm />
              </Row>
            </HtCard.Body>
          </HtCard>
          <HtCard border={'secondary'}>
            <HtCard.Body>
              <h5>Waste Codes</h5>
              <Row className="mb-2">
                <HazardousWasteForm epaWaste={epaWaste} />
              </Row>
            </HtCard.Body>
          </HtCard>
          <HtCard border={'secondary'}>
            <HtCard.Body>
              <h5>Special Handing Instructions and Additional Info</h5>
              <Row className="mb-2">
                {/* AdditionalInfoForm needs to be used in the context of a
                WasteLineForm or Manifest (e.g., surrounded by FormProvider*/}
                <AdditionalInfoForm />
              </Row>
            </HtCard.Body>
          </HtCard>
        </Container>
        <div className="d-flex justify-content-end">
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="success" className="mx-3">
            Add
          </Button>
        </div>
      </HtForm>
    </FormProvider>
  );
}
