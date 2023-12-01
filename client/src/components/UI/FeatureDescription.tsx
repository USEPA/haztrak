import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface FeatureDescriptionProps {
  title: string;
  children: ReactElement;
  icon: IconProp;
}

export function FeatureDescription({ title, children, icon }: FeatureDescriptionProps) {
  return (
    <div className="col">
      <div className="bg-primary bg-gradient d-inline-flex align-items-start p-3 rounded-3 mb-2">
        <FontAwesomeIcon icon={icon} className="text-light" size="2xl" />
      </div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
