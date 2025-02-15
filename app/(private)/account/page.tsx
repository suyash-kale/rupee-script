import { Pencil, Plus } from 'lucide-react';
import Link from 'next/link';
import { FC, Suspense } from 'react';

import { Heading } from '@/components/template/heading';
import { Button } from '@/components/ui/button';
import { get } from '@/services/account';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// account list page
function Page() {
  return (
    <>
      <Heading
        title="Account List"
        description="List of all your accounts"
        links={[{ title: 'Account' }]}
      >
        <Button asChild>
          <Link href="/account/add">
            <Plus />
            Add
          </Link>
        </Button>
      </Heading>
      <div className="flex-1 p-4">
        <Suspense fallback={<Fallback />}>
          <List />
        </Suspense>
      </div>
    </>
  );
}

// fetching and displaying accounts from the database
const List: FC = async () => {
  const accounts = await get();
  return (
    <div className="grid grid-cols-3 gap-3">
      {accounts?.map((account) => (
        <Card key={account._id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardHeader className="p-0">
                <CardTitle>{account.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                Balance: {account.balance}
              </CardContent>
            </div>
            <Button variant="outline" size="icon" asChild>
              <Link href={`/account/${account._id}`}>
                <Pencil />
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

// skeleton loader for the account list
const Fallback: FC = () => (
  <div className="grid grid-cols-3 gap-3">
    <Skeleton className="h-[75px] w-full rounded-xl" />
    <Skeleton className="h-[75px] w-full rounded-xl" />
    <Skeleton className="h-[75px] w-full rounded-xl" />
  </div>
);

export default Page;
