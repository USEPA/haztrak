import { faFeather } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Handler } from 'components/Manifest/manifestSchema';
import React from 'react';
import { ButtonProps } from 'react-bootstrap';
import { RcraApiUserBtn } from 'components/buttons';

interface QuickerSignData {
  handler: Handler | undefined;
  siteType: 'Generator' | 'Transporter' | 'Tsdf';
}

interface QuickerSignModalBtnProps extends ButtonProps {
  siteType: 'Generator' | 'Transporter' | 'Tsdf';
  mtnHandler?: Handler;
  handleClick: (data: QuickerSignData) => void;
  iconOnly?: boolean;
}

/**
 * Button for initiating a task to pull manifests from RCRAInfo for a given site
 * The button will be disabled if siteId (the EPA ID number) is not provided
 * @constructor
 */
export function QuickerSignModalBtn({
  siteType,
  mtnHandler,
  handleClick,
  disabled,
  iconOnly = false,
}: QuickerSignModalBtnProps) {
  if (mtnHandler === undefined) {
    return null;
  }
  return (
    <RcraApiUserBtn
      onClick={() => {
        handleClick({ handler: mtnHandler, siteType: siteType });
      }}
      disabled={disabled}
    >
      {iconOnly ? '' : 'Quicker Sign '}
      <FontAwesomeIcon icon={faFeather} />
    </RcraApiUserBtn>
  );
}
