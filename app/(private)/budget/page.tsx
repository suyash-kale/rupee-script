import { Wallet } from 'lucide-react';
import Link from 'next/link';

import { Heading } from '@/components/template/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetCategory } from '@/entities/budget';

export default async function Page() {
  return (
    <>
      <Heading
        title={
          <span className="flex items-center gap-2">
            <Wallet />
            Budget
          </span>
        }
        description="Plan you financial future."
        links={[{ title: 'Budget' }]}
      ></Heading>
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(BudgetCategory).map(([key, value]) => (
            <Link href={`/budget/${key.toLowerCase()}`} key={value}>
              <Card className="p-4">
                <CardHeader className="p-0">
                  <CardTitle>{key}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">Total: NA</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
