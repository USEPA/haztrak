import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ManifestContext } from 'components/Manifest/ManifestForm';
import { HtButton } from 'components/UI';
import { useReadOnly } from 'hooks/manifest';
import React, { useContext } from 'react';
import { ButtonProps } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface ManifestEditBtnProps extends ButtonProps {}

export function ManifestEditBtn({ children, ...props }: ManifestEditBtnProps) {
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
