import { ReactElement } from 'react';

interface FeatureDescriptionProps {
  title: string;
  children: ReactElement;
  iconElement: ReactElement;
}

export function FeatureDescription({ title, children, iconElement }: FeatureDescriptionProps) {
  return (
    <div className="tw:py-3 tw:sm:w-full tw:md:w-1/3 tw:lg:w-1/2">
      <div className="bg-primary bg-gradient tw:mb-2 tw:inline-flex tw:items-start tw:rounded-lg tw:p-6">
        <iconElement.type className="tw:text-white" size={24} {...iconElement.props} />
      </div>
      <h2 className="tw:text-2xl tw:font-bold">{title}</h2>
      {children}
    </div>
  );
}
