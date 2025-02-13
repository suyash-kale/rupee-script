import { FC } from 'react';

import { auth, signOut } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getFallback = (name: string) =>
  name
    .split(' ')
    .splice(0, 2)
    .map((l) => l[0])
    .join('')
    .toUpperCase();

const User: FC = async () => {
  const session = await auth();
  if (!session) return <></>;
  console.log(session.user?.image);
  return (
    <div className="flex items-center gap-2 px-4 text-sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer w-8 h-8">
            {session.user?.image && <AvatarImage src={session.user?.image} />}
            {session.user?.name && (
              <AvatarFallback>
                {getFallback(session.user.name) || 'SK'}
              </AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              'use server';
              await signOut();
            }}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default User;
