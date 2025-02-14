import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { auth } from '@/configs/firebase';
import { useToast } from '@/hooks/use-toast';
import { getAuthErrorMessage } from '@/lib/errors';
import { useAuthStore } from '@/stores/authState';
import { signOut } from 'firebase/auth';
import { MenuIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MainDropdownMenu() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile, setProfile, setUser } = useAuthStore();
  async function logoutUser() {
    try {
      setUser(null);
      setProfile(null);

      await signOut(auth);

      toast({
        title: '로그아웃 성공',
      });
    } catch (error) {
      toast({
        title: '❗️로그아웃 실패',
        description: getAuthErrorMessage(error),
      });
      throw error;
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="-mr-2">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-6">
        <DropdownMenuLabel>
          {profile ? `${profile.name} 바나바` : '알수없음'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/')}>
            전체 일정 보기
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/my-schedule')}>
            내 일정만 보기
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/barnabas')}>
            바나바 과정
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/attendance')}>
            멘티 출석체크
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            마이페이지
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logoutUser}>로그아웃</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
