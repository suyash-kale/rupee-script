import { DefaultSession } from 'next-auth';
import { FC } from 'react';
import { LogOut } from 'lucide-react';
import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';

import {
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/auth';

// get fallback initials from the user name if image is not available
// e.g. Suyash Kale => SK
export const getFallback = (name: string) =>
  name
    .split(' ')
    .splice(0, 2)
    .map((l) => l[0])
    .join('')
    .toUpperCase();

interface DropDownProps {
  user: DefaultSession['user'];
  side: DropdownMenuContentProps['side'];
}

// dropdown menu for the user
// used in the header and sidebar
export const DropDown: FC<DropDownProps> = ({ user, side }) => (
  <DropdownMenuContent side={side} align="end" sideOffset={4}>
    <DropdownMenuLabel className="font-normal">
      <div className="flex items-center gap-2">
        <Avatar className="flex items-center justify-center h-10 w-10">
          {user?.image && (
            <AvatarImage src={user?.image} alt={user?.name ?? ''} />
          )}
          <AvatarFallback>{getFallback(user?.name ?? 'NA')}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1">
          <span className="truncate font-semibold">{user?.name}</span>
          <span className="truncate text-xs">{user?.email}</span>
        </div>
      </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={async () => {
        'use server';
        await signOut();
      }}
    >
      <LogOut />
      Log out
    </DropdownMenuItem>
  </DropdownMenuContent>
);
