import { notFound } from 'next/navigation';
import { Landmark } from 'lucide-react';

import { Heading } from '@/components/template/heading';
import { DETAIL } from '@/services/account';
import { Badge } from '@/components/ui/badge';
import { AccountCategory } from '@/entities/account';
import { Add } from '@/components/account/add';
import { Delete } from '@/components/account/delete';

interface PageProps {
  readonly params: Promise<{ id?: string }>;
}

// account detail page
async function Page({ params }: PageProps) {
  const { id } = await params;

  // if no id, return empty fragment
  if (!id) {
    notFound();
  }

  // fetch account details
  const account = await DETAIL(id);

  // if no account, return 404
  if (!account) {
    notFound();
  }

  return (
    <Heading
      title={
        <div className="flex items-center gap-2">
          <Landmark />
          {account.title}
          <Badge variant="outline">
            {
              Object.keys(AccountCategory)[
                Object.values(AccountCategory).indexOf(account.category)
              ]
            }
          </Badge>
        </div>
      }
      description={
        <>
          Balance: <span className="font-semibold">{account.balance}</span>
        </>
      }
      links={[{ title: 'Account', href: '/account' }, { title: account.title }]}
    >
      <Delete account={account} />
      <Add account={account} />
    </Heading>
  );
}

export default Page;
