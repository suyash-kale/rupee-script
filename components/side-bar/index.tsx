import { FC, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Landmark,
  MoreHorizontal,
  ChevronRight,
  Plus,
  LayoutList,
} from 'lucide-react';

import Logo from '@/assets/logo.jpg';
import { auth } from '@/auth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { User } from '@/components/side-bar/user';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GET } from '@/services/account';
import { Skeleton } from '@/components/ui/skeleton';

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
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible asChild>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Account">
                  <div className="justify-between">
                    <Link className="flex items-center gap-2" href="/account">
                      <Landmark className="size-4" />
                      Accounts
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer" asChild>
                        <MoreHorizontal />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="right"
                        align="start"
                        className="min-w-56 rounded-lg"
                      >
                        <DropdownMenuItem asChild>
                          <Link href="/account">
                            <LayoutList />
                            Account List
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account/add">
                            <Plus />
                            Add Account
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <Suspense fallback={<FallbackSubItem />}>
                      <Accounts />
                    </Suspense>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <User user={session?.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

// get the list of accounts
const Accounts: FC = async () => {
  const accounts = await GET();

  return accounts?.map((account) => (
    <SidebarMenuSubItem key={`sidebar-account-${account._id}`}>
      <SidebarMenuSubButton asChild>
        <Link href={`/account/${account._id}`}>{account.title}</Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  ));
};

// skeleton loader for the account list
const FallbackSubItem: FC = () => (
  <>
    <Skeleton className="h-[28px] w-full" />
    <Skeleton className="h-[28px] w-full" />
  </>
);
