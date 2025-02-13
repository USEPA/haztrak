import React, { useContext } from 'react';
import { ButtonProps } from 'react-bootstrap';
import { FaPenToSquare } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import { ManifestContext } from '~/components/Manifest/ManifestForm';
import { HtButton } from '~/components/legacyUi';
import { useReadOnly } from '~/hooks/manifest';

type ManifestEditBtnProps = ButtonProps;

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
      <FaPenToSquare className="tw-inline" />
    </HtButton>
  );
}
