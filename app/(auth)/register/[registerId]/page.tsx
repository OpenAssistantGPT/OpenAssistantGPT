import Link from 'next/link';

import { Metadata } from 'next';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import RegistrationPage from '@/components/registration';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register to your account',
};

export default async function Register() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8 text-white'
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <RegistrationPage />
    </div>
  );
}
