import { FC } from 'react';
import Image from 'next/image';

import Logo from '@/assets/logo.jpg';
import { auth } from '@/auth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { User } from '@/components/side-bar/user';

// sidebar for private groups
export const SideBar: FC = async () => {
  const session = await auth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="flex gap-4 items-center">
              <Image src={Logo} alt="Logo" width={50} height={50} priority />
              <span className="text-2xl font-semibold">Rupee Script</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent></SidebarContent>
      <Separator />
      <SidebarFooter>
        <User user={session?.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
