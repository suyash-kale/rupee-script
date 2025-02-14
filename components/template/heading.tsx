import { FC, ReactNode } from 'react';

import { Breadcrumbs, BreadcrumbsProps } from './breadcrumbs';

interface HeadingProps {
  title: string;
  children: ReactNode;
  description?: string;
  links?: BreadcrumbsProps['links'];
}

// heading component with action, including breadcrumbs component
export const Heading: FC<HeadingProps> = ({
  title,
  children,
  description,
  links,
}) => {
  return (
    <>
      {links && <Breadcrumbs links={links} />}
      <div className="flex items-center justify-between shadow py-3 px-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
        <div className="flex gap-2">{children}</div>
      </div>
    </>
  );
};
