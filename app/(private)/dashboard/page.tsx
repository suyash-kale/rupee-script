import { auth } from '@/auth';
import { Heading } from '@/components/template/heading';

export default async function Page() {
  const session = await auth();
  console.log('dashboard', session);

  return (
    <Heading
      title="Welcome"
      description="Be a step ahead in your financial journey."
      links={[]}
    >
      <></>
    </Heading>
  );
}
