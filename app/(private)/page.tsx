import Link from "next/link";

export default function Page() {
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
