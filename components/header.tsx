import { FC } from "react";

import Logo from "@/assets/logo.jpg";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";

// header for all groups
const Header: FC = async () => {
  const session = await auth();

  return (
    <div className="flex items-center justify-between bg-white shadow-inner border-b border-gray-200">
      <Link href="/" className="flex gap-4 items-center">
        <Image src={Logo} alt="Logo" width={50} height={50} priority />
        <span className="text-2xl font-light">Rupee Script</span>
      </Link>
      <div>{session?.user?.name}</div>
    </div>
  );
};

export default Header;
