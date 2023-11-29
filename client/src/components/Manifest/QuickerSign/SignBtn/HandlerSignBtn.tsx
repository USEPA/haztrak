import { faFeather } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ManifestContext } from 'components/Manifest/ManifestForm';
import { Handler, RcraSiteType } from 'components/Manifest/manifestSchema';
import { RcraApiUserBtn } from 'components/Rcrainfo';
import React, { useContext } from 'react';
import { ButtonProps } from 'react-bootstrap';
import { siteByEpaIdSelector, useAppSelector } from 'store';

interface QuickerSignData {
  handler: Handler | undefined;
  siteType: RcraSiteType;
}

interface QuickerSignModalBtnProps extends ButtonProps {
  siteType: RcraSiteType;
  mtnHandler?: Handler;
  handleClick: (data: QuickerSignData) => void;
  iconOnly?: boolean;
}

/**
 * Button for initiating a task to pull manifests from RCRAInfo for a given site
 * The button will be disabled if siteId (the EPA ID number) is not provided
 * @constructor
 */
export function HandlerSignBtn({
  siteType,
  mtnHandler,
  handleClick,
  disabled,
  iconOnly = false,
}: QuickerSignModalBtnProps) {
  const { signingSite } = useContext(ManifestContext);
  if (!useAppSelector(siteByEpaIdSelector(mtnHandler?.epaSiteId))) return <></>;

  if (mtnHandler?.epaSiteId !== signingSite) return <></>;

  return (
    <RcraApiUserBtn
      onClick={() => {
        handleClick({ handler: mtnHandler, siteType: siteType });
      }}
      disabled={disabled}
    >
      {iconOnly ? '' : 'Sign '}
      <FontAwesomeIcon icon={faFeather} />
    </RcraApiUserBtn>
  );
}
