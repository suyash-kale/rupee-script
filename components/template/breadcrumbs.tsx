import { FC, Fragment } from 'react';
import { Home } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export interface BreadcrumbsProps {
  links: Array<{ href?: string; title: string }>;
}

// breadcrumbs component with sidebar trigger
export const Breadcrumbs: FC<BreadcrumbsProps> = ({ links }) => {
  return (
    <>
      <div className="flex items-center">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-[28px] mr-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="flex gap-1 items-center"
                href="/dashboard"
              >
                <Home className="size-3" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            {links.map((link) => (
              <Fragment key={`breadcrumb-${link.title}`}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="flex gap-1 items-center"
                    href={link.href}
                  >
                    {link.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Separator />
    </>
  );
};
