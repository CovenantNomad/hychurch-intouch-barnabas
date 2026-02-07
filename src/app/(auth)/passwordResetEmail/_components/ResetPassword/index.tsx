'use client';

import { auth } from '@/configs/firebase';
import { cn } from '@/lib/utils';
import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  email: string;
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const getFriendlyError = (code?: string) => {
  switch (code) {
    case 'auth/invalid-email':
      return '이메일 형식이 올바르지 않습니다.';
    case 'auth/too-many-requests':
      return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    // 아래 에러들은 계정 존재 여부를 유추할 수 있어서 동일 문구로 처리하는 게 안전함
    case 'auth/user-not-found':
      return null;
    default:
      return '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
};

export function ResetPassword({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormValues>({
    defaultValues: { email: '' },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const email = normalizeEmail(values.email);

    try {
      await sendPasswordResetEmail(auth, email);
      setDone(true);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        const friendly = getFriendlyError(err.code);

        // user-not-found 등은 성공과 동일 UX로 처리
        if (!friendly) {
          setDone(true);
        } else {
          setErrorMsg(friendly);
        }
      } else {
        setErrorMsg('요청 처리 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <h1 className="text-2xl font-semibold text-gray-900">비밀번호 재설정</h1>
      <p className="mt-2 text-sm text-gray-600">
        가입하신 이메일 주소로 비밀번호 재설정 안내 메일을 보내드립니다.
      </p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {done ? (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900">
              요청이 접수되었습니다.
            </div>
            <p className="text-sm text-gray-600">
              입력하신 이메일 주소가 등록되어 있다면, 비밀번호 재설정 메일이
              발송됩니다. 메일함(스팸함 포함)을 확인해주세요.
            </p>

            <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
              이메일: <span className="font-medium">{getValues('email')}</span>
            </div>

            <button
              type="button"
              className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              onClick={() => {
                setDone(false);
                setErrorMsg(null);
              }}
            >
              다른 이메일로 다시 시도
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                이메일
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900"
                {...register('email', {
                  required: '이메일을 입력해주세요.',
                  validate: (v) => {
                    const email = normalizeEmail(v);
                    // 너무 빡세지 않은 수준의 기본 검증
                    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                    return ok || '이메일 형식이 올바르지 않습니다.';
                  },
                })}
              />
              {errors.email?.message ? (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            {errorMsg ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMsg}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? '메일 보내는 중…' : '재설정 메일 보내기'}
            </button>

            <p className="text-xs text-gray-500">
              메일이 오지 않으면 스팸함을 확인하거나, 잠시 후 다시 시도해주세요.
            </p>
          </form>
        )}
      </div>
      <div className="mt-4 text-center text-sm">
        <Link href={'/login'}>
          <span className="underline underline-offset-4">로그인 하러가기</span>
        </Link>
      </div>
    </div>
  );
}
