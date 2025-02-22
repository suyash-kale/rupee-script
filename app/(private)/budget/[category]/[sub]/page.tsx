import { Wallet } from 'lucide-react';
import { notFound } from 'next/navigation';

import { Heading } from '@/components/template/heading';
import { getCategoryById, getSubById } from '@/util/budget';

interface PageProps {
  readonly params: Promise<{ category?: string; sub?: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category: cat, sub: sb } = await params;

  // category and sub must be available in the url
  if (!cat) notFound();
  if (!sb) notFound();

  // get the category and making sure it valid
  const category = getCategoryById(cat);
  if (!category) notFound();

  // get the sub category and making sure it valid
  const sub = getSubById(sb);
  if (!sub) notFound();

  return (
    <>
      <Heading
        title={
          <span className="flex items-center gap-2">
            <Wallet />
            {`${sub.key} ${category.key}`}
          </span>
        }
        description="Plan you financial future."
        links={[
          { title: 'Budget', href: '/budget' },
          {
            title: category.key,
            href: `/budget/${category.key.toLowerCase()}`,
          },
          { title: sub.key },
        ]}
      ></Heading>
      <div className="flex-1 p-4"></div>
    </>
  );
}
