import { ButtonProps } from 'react-bootstrap';
import { FaFloppyDisk } from 'react-icons/fa6';
import { HtButton } from '~/components/legacyUi';
import { useReadOnly } from '~/hooks/manifest';

type ManifestSaveBtnProps = ButtonProps;

export function ManifestSaveBtn({ children: _unused, ...props }: ManifestSaveBtnProps) {
  const [readOnly] = useReadOnly();
  if (readOnly) return <></>;
  return (
    <HtButton variant="success" type="submit" name="save" {...props}>
      <span>Save </span>
      <FaFloppyDisk className="tw-inline" />
    </HtButton>
  );
}
