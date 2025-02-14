import { FC } from 'react';

import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropDown, getFallback } from '@/components/side-bar/user/drop-down';

// user component for the header
const User: FC = async () => {
  const session = await auth();

  if (!session) return <></>;

  return (
    <div className="flex items-center gap-2 px-4 text-sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer w-8 h-8">
            {session.user?.image && <AvatarImage src={session.user?.image} />}
            <AvatarFallback>
              {getFallback(session?.user?.name ?? 'NA')}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropDown user={session.user} side="bottom" />
      </DropdownMenu>
    </div>
  );
};

export default User;
