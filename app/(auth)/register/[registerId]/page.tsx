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
      <RegistrationPage />
    </div>
  );
}
