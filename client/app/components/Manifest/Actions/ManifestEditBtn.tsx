import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HtButton } from 'app/components/legacyUi';
import React, { useContext } from 'react';
import { ButtonProps } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ManifestContext } from '~/components/Manifest/ManifestForm';
import { useReadOnly } from '~/hooks/manifest';

interface ManifestEditBtnProps extends ButtonProps {}

export function ManifestEditBtn({ children: _unused, ...props }: ManifestEditBtnProps) {
  const navigate = useNavigate();
  const { trackingNumber, viewingAsSiteId } = useContext(ManifestContext);
  const [readOnly, setReadOnly] = useReadOnly();
  if (!readOnly) return <></>;

  const handleClick = () => {
    setReadOnly(false);
    navigate(`/site/${viewingAsSiteId}/manifest/${trackingNumber}/edit`);
  };

  return (
    <HtButton {...props} variant="info" type="button" name="edit" onClick={handleClick}>
      <span>Edit </span>
      <FontAwesomeIcon icon={faPenToSquare} />
    </HtButton>
  );
}
