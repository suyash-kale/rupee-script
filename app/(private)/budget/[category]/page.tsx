import { Wallet } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Heading } from '@/components/template/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetSubCategory } from '@/entities/budget';
import { getCategoryById } from '@/util/budget';

interface PageProps {
  readonly params: Promise<{ category?: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category: cat } = await params;

  if (!cat) notFound();

  const category = getCategoryById(cat);

  if (!category) notFound();

  return (
    <>
      <Heading
        title={
          <span className="flex items-center gap-2">
            <Wallet />
            {category.key}
          </span>
        }
        description="Plan you financial future."
        links={[{ title: 'Budget', href: '/budget' }, { title: category.key }]}
      ></Heading>
      <div className="flex-1 p-4">
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(BudgetSubCategory).map(([key, value]) => (
            <Link
              href={`/budget/${category.key.toLowerCase()}/${key.toLowerCase()}`}
              key={value}
            >
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
