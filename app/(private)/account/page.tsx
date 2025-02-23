import { Landmark } from 'lucide-react';
import Link from 'next/link';
import { FC, Suspense } from 'react';

import { Heading } from '@/components/template/heading';
import { GET } from '@/services/account';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Add } from '@/components/account/add';

// account list page
function Page() {
  return (
    <>
      <Heading
        title={
          <span className="flex items-center gap-2">
            <Landmark />
            Account List
          </span>
        }
        description="List of all your accounts"
        links={[{ title: 'Account' }]}
      >
        <Add />
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
  const accounts = await GET();
  return (
    <div className="grid grid-cols-3 gap-3">
      {accounts?.map((account) => (
        <Link
          href={`/account/${account._id}`}
          key={account._id}
          className="relative"
        >
          <Badge variant="outline" className="absolute top-1 right-1">
            {account.category}
          </Badge>
          <Card key={account._id} className="p-4">
            <CardHeader className="p-0">
              <CardTitle>{account.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              Balance: {account.balance}
            </CardContent>
          </Card>
        </Link>
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
