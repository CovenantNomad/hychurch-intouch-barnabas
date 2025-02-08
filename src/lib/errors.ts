export function getAuthErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const firebaseErrorCode = (error as { code: string }).code;

    switch (firebaseErrorCode) {
      case 'auth/user-not-found':
        return '가입되지 않은 이메일입니다.';
      case 'auth/wrong-password':
        return '비밀번호가 틀렸습니다.';
      case 'auth/email-already-in-use':
        return '이미 가입된 이메일입니다.';
      case 'auth/weak-password':
        return '비밀번호는 6자 이상이어야 합니다.';
      case 'auth/invalid-email':
        return '유효하지 않은 이메일 주소입니다.';
      default:
        return '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.';
    }
  }
  return '오류가 발생했습니다. 다시 시도해주세요.';
}

export class AuthError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'AuthError';
  }
}
