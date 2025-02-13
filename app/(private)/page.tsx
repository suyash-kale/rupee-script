import { auth } from '@/auth';
import Link from 'next/link';

export default async function Page() {
  const session = await auth();
  console.log(session);

  return (
    <div>
      Home Page
      <div>
        <Link href="/sign-in" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
