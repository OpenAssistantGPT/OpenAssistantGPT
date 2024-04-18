import Link from 'next/link';

import { Metadata } from 'next';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import GithubLoginForm from '@/components/github-login-form';
import GoogleLoginForm from '@/components/google-login-form';
import LoginPage from '@/components/login';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default async function Login() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="bg-black flex h-screen w-screen flex-col items-center justify-center">
 
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
      <LoginPage />
      
    </div>
  );
}
{/* <div
        data-aos="fade-up"
        className=" flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
             
        <div className="flex flex-col space-y-2 text-center">
          <Icons.bot className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
          
          {/* <p className="text-sm text-muted-foreground">
            Use your Google or Github account to sign in.
          </p>
          <div className="py-4">
            <GithubLoginForm />
            <GoogleLoginForm />
          </div> */}
      //     <p className="text-sm text-muted-foreground">
      //       By connecting your account, you agree to our{' '}
      //       <a href="/docs/legal/terms">Terms of Service</a> and{' '}
      //       <a href="/docs/legal/privacy">Privacy Policy</a>.
      //     </p>
      //   </div>
      // </div> */}