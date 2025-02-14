import { FC } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { DefaultSession } from 'next-auth';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropDown, getFallback } from '@/components/side-bar/user/drop-down';

interface UserProps {
  user: DefaultSession['user'];
}

// user component for the sidebar
export const User: FC<UserProps> = ({ user }) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="flex items-center justify-center h-8 w-8">
                {user?.image && (
                  <AvatarImage src={user?.image} alt={user?.name ?? ''} />
                )}
                <AvatarFallback>
                  {getFallback(user?.name ?? 'NA')}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropDown user={user} side="right" />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
