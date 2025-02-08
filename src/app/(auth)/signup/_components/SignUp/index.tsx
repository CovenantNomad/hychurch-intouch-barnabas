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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getAuthErrorMessage } from '@/lib/errors';
import { cn } from '@/lib/utils';
import { signUpUser } from '@/repositories/auth';
import { fetchBarnabaMembers } from '@/repositories/barnabas';
import { useAuthStore } from '@/stores/authState';
import { TSignUpFormValues } from '@/types/auth.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export function SignUp({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const { toast } = useToast();
  const router = useRouter();
  const { setUser, setProfile } = useAuthStore();
  const form = useForm<TSignUpFormValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      barnabasId: '',
    },
  });

  const {
    isLoading,
    isFetching,
    data: barnabas,
  } = useQuery({
    queryKey: ['fetchBarnabaMembers', 'active'],
    queryFn: () => fetchBarnabaMembers(true),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      barnabasId: string;
    }) => signUpUser(data),
    onSuccess(data) {
      toast({
        title: '✅ 회원가입 성공',
      });
      if (data?.user) {
        setUser(data.user);
      }

      if (data?.profile) {
        setProfile(data.profile);
      }
      router.push('/');
    },
    onError(error) {
      toast({
        title: '❗️회원가입 실패',
        description: getAuthErrorMessage(error),
      });
    },
  });

  const onSubmit = (formData: TSignUpFormValues) => {
    mutation.mutate({
      email: formData.email,
      password: formData.password,
      barnabasId: formData.barnabasId,
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Fill in the fields below to create an account.
          </CardDescription>
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

              {/* 비밀번호 확인 */}
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  rules={{
                    required: true,
                    validate: (value) =>
                      value === form.watch('password') ||
                      '비밀번호가 일치하지 않습니다.',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 이름 선택 */}
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="barnabasId"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      {isLoading || isFetching ? (
                        <Skeleton className="w-full h-9" />
                      ) : (
                        <Select
                          onValueChange={field.onChange}
                          disabled={isLoading || isFetching}
                        >
                          <FormControl>
                            <SelectTrigger id="barnabasId">
                              <SelectValue placeholder="이름을 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {barnabas && barnabas.length > 0 ? (
                              barnabas
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name)) // 이름 순 정렬
                                .map((member: { id: string; name: string }) => (
                                  <SelectItem key={member.id} value={member.id}>
                                    {member.name}
                                  </SelectItem>
                                ))
                            ) : (
                              <SelectItem disabled value="알수없음">
                                선택 가능한 멤버가 없습니다.
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 회원가입 버튼 */}
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href={'/login'}>
              <span className="underline underline-offset-4">Login</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
