import Link from 'next/link';
import { FC } from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

// nav link for the header
export const NavLink: FC<NavLinkProps> = ({ href, children }) => {
  return (
    <Link href={href} className="flex gap-4 items-center text-gray-600">
      {children}
    </Link>
  );
};
