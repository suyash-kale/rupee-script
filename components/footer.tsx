import Link from 'next/link';
import { FC } from 'react';

import { Separator } from '@/components/ui/separator';

// footer for all groups
const Footer: FC = () => {
  return (
    <div className="flex flex-row px-3 justify-between bg-white text-xs py-2 border-t border-gray-200 text-gray-600">
      <div className="flex gap-2">
        <Link href="/">Terms of Service</Link>
        <Separator orientation="vertical" />
        <Link href="/">Privacy Policy</Link>
        <Separator orientation="vertical" />
        <Link href="/">Contact</Link>
      </div>
      <div>© 2025, Suyash Kale.</div>
    </div>
  );
};

export default Footer;
