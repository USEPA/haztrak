import { components } from 'react-select';
import React from 'react';

/**
 * This is a custom component we use to display waste codes so that the full
 * description of the waste code is present when selecting from the dropdown
 * but only contains the ~4-digit code once selected.
 * see SO question here
 * https://stackoverflow.com/questions/52482985/react-select-show-different-text-label-for-drop-down-and-control
 */
export const WasteCodeSelect = (props: any) => (
  <components.MultiValue {...props}>{props.data.code}</components.MultiValue>
);
