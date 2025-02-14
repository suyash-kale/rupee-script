import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { auth } from '@/auth';
import Logo from '@/assets/logo.jpg';
import User from '@/components/header/user';
import { NavLink } from '@/components/header/nav-link';

// header for public groups
const Header: FC = async () => {
  const session = await auth();

  return (
    <div className="flex items-center justify-between bg-white shadow-inner border-b border-gray-200">
      <div className="flex gap-8 items-center">
        <Link href="/" className="flex gap-2 items-center">
          <Image src={Logo} alt="Logo" width={50} height={50} priority />
          <span className="text-2xl font-semibold">Rupee Script</span>
        </Link>
        <nav className="flex gap-3 text-sm">
          {session?.user ? (
            <NavLink href="/access">Dashboard</NavLink>
          ) : (
            <NavLink href="/access">Signin/ Signup</NavLink>
          )}
        </nav>
      </div>
      <User />
    </div>
  );
};

export default Header;
