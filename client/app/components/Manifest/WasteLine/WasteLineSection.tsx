import { ErrorMessage } from '@hookform/error-message';
import { HtButton } from '~/components/legacyUi';

import { Alert } from 'react-bootstrap';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { WasteLineTable } from '~/components/Manifest/WasteLine/WasteLineTable';
import { WasteLine } from '~/components/Manifest/WasteLine/wasteLineSchema';
import { Manifest } from '~/components/Manifest/manifestSchema';
import { useReadOnly } from '~/hooks/manifest';

interface WasteLineSectionProps {
  toggleWlFormShow: () => void;
}

export function WasteLineSection({ toggleWlFormShow }: WasteLineSectionProps) {
  const manifestForm = useFormContext<Manifest>();
  const { errors } = manifestForm.formState;
  const allWastes: WasteLine[] = manifestForm.getValues('wastes');
  const wasteForm = useFieldArray<Manifest, 'wastes'>({
    control: manifestForm.control,
    name: 'wastes',
  });
  const [readOnly] = useReadOnly();
  return (
    <>
      <WasteLineTable wastes={allWastes} toggleWLModal={toggleWlFormShow} wasteForm={wasteForm} />
      {readOnly ? (
        <></>
      ) : (
        <HtButton
          onClick={toggleWlFormShow}
          children={'Add Waste'}
          variant="outline-primary"
          horizontalAlign
        />
      )}
      <ErrorMessage
        errors={errors}
        name={'wastes'}
        render={({ message }) => (
          <Alert variant="danger" className="text-center m-3">
            {message}
          </Alert>
        )}
      />
    </>
  );
}
