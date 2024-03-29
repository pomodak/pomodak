import { useTimerOptionsStore } from '@/stores/timer-options-store';
import { Switch } from '@/components/ui/switch';
import { useRequireLogin } from '@/hooks/use-require-login';

export const IsTogetherOption = () => {
  const { isLoggedIn, openRequireLoginModal } = useRequireLogin();
  const isTogetherEnabled = useTimerOptionsStore(
    (state) => state.isTogetherEnabled
  );
  const toggle = useTimerOptionsStore((state) => state.toggleIsTogetherEnabled);

  const handleClick = () => {
    if (!isLoggedIn) {
      openRequireLoginModal();
      return;
    }
    toggle();
  };

  return (
    <div className="flex items-center justify-between">
      <span className="antialiased font-semibold w-1/2">함께 공부하기</span>
      <div className="w-1/2 flex-center">
        <Switch
          id="is-together-mode"
          onClick={handleClick}
          checked={isLoggedIn ? isTogetherEnabled : false}
        />
      </div>
    </div>
  );
};
