'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getAuthErrorMessage } from '@/lib/errors';
import { cn } from '@/lib/utils';
import { signInUser } from '@/repositories/auth';
import { useAuthStore } from '@/stores/authState';
import { TSignInFormValues } from '@/types/auth.types';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export function SignIn({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const { toast } = useToast();
  const router = useRouter();
  const { setUser, setProfile } = useAuthStore();
  const form = useForm<TSignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => signInUser(data),
    onSuccess: (data) => {
      if (data?.user) {
        setUser(data.user);
      }

      if (data?.profile) {
        setProfile(data.profile);
      }
      router.push('/');
    },
    onError: (error) => {
      toast({
        title: '❗️로그인 실패',
        description: getAuthErrorMessage(error),
      });
    },
  });

  const onSubmit = (formData: TSignInFormValues) => {
    mutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>이메일을 입력하여 로그인 하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* 이메일 입력 */}
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="mail@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 비밀번호 입력 */}
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 회원가입 버튼 */}
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            계정이 없으신가요?{' '}
            <Link href={'/signup'}>
              <span className="underline underline-offset-4">회원가입</span>
            </Link>
          </div>
          <div className="mt-2 text-center text-sm">
            비밀번호를 잊어먹었다면 재설정하세요{' '}
            <Link href={'/passwordResetEmail'}>
              <span className="underline underline-offset-4">
                비밀번호 재설정
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
