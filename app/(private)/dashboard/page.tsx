import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  console.log('dashboard', session);

  return <div>Home Page</div>;
}
