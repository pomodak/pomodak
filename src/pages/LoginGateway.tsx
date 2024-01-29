import { Link } from 'react-router-dom';
import { buttonVariants } from '../components/ui/button';
import { cn } from '@/lib/utils';

export const LoginGateway = () => {
  return (
    <div className="grid grid-rows-3 items-center justify-center bg-background h-full gap-2 px-4 space-y-20 md:rounded-md pb-safe-offset-14 pt-safe-offset-14 overflow-hidden">
      <div className="row-span-2 relative flex flex-col justify-center items-center">
        <img
          src="/characters/character_1.png"
          width={640}
          height={640}
          alt="monta-main"
          className="px-28 pb-6 pt-10"
        />
        <p className="text-4xl font-semibold text-primary">스터디 타이머</p>
      </div>
      <div className="row-span-1 w-full flex flex-col gap-2 items-center py-20">
        <Link
          to="/auth/login"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'w-2/3 h-12 text-primary'
          )}
        >
          로그인
        </Link>
        <Link to="/auth/agree" className={cn(buttonVariants(), 'w-2/3 h-12')}>
          가입하기
        </Link>
      </div>
    </div>
  );
};