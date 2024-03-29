import { app } from '@/lib/firebase';
import {
  disablePush,
  enablePush,
  getNotificationPublicKey,
} from '@/services/apis/push.api';
import { getMessaging, getToken } from 'firebase/messaging';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './auth-store';
import { getDeviceType } from '@/lib/utils';
import { toast } from 'sonner';

export type TimerMode = 'normal' | 'pomodoro';
export type TimerOptionKey = 'pomodoroTime' | 'sectionCount' | 'restTime';
// | 'longRestTime';

export const timerOptions: Record<TimerOptionKey, number[]> = {
  pomodoroTime: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 90, 120],
  sectionCount: [2, 3, 4, 5, 6, 7, 8],
  restTime: [3, 5, 10, 15, 20, 25, 30, 35, 40],
  // longRestTime: [3, 5, 10, 15, 20, 25, 30, 35, 40],
};

interface TimerOptionsStore {
  prevState: {
    timerMode: TimerMode;
    pomodoroTime: number;
    sectionCount: number;
    restTime: number;
  } | null;
  timerMode: TimerMode;
  pomodoroTime: number;
  sectionCount: number;
  restTime: number;
  // longRestTime: number;
  isTogetherEnabled: boolean;
  setTimerOptions: (options: Partial<Record<TimerOptionKey, number>>) => void;
  resetOptions: () => void;
  toggleIsTogetherEnabled: () => void;
  toggleTimerMode: () => Promise<void>;

  checkIsTimerOptionsChanged: () => boolean;
  saveTimerOptions: () => void;
}

export const useTimerOptionsStore = create<TimerOptionsStore>()(
  persist(
    (set, get) => ({
      prevState: null,
      timerMode: 'normal',
      pomodoroTime: 25, // 기본 뽀모도로 시간 25분
      sectionCount: 4, // 기본 섹션 4회
      restTime: 5, // 쉬는시간
      // longRestTime: 15, // 긴 쉬는시간
      isTogetherEnabled: false, // 함께 공부하기 유무
      setTimerOptions: (options) =>
        set((state) => ({
          ...state,
          ...options,
        })),

      resetOptions: () => {
        set(() => ({
          prevState: null,
          timerMode: 'normal',
          pomodoroTime: 25,
          sectionCount: 4,
          restTime: 5,
          isTogetherEnabled: false,
        }));
      },

      checkIsTimerOptionsChanged: () => {
        const { timerMode, pomodoroTime, sectionCount, restTime, prevState } =
          get();

        return !(
          prevState &&
          prevState.timerMode === timerMode &&
          prevState.pomodoroTime === pomodoroTime &&
          prevState.sectionCount === sectionCount &&
          prevState.restTime === restTime
        );
      },

      // 이전 상태 저장
      saveTimerOptions: () => {
        const { timerMode, pomodoroTime, sectionCount, restTime } = get();
        set((state) => ({
          ...state,
          prevState: { timerMode, pomodoroTime, sectionCount, restTime },
        }));
      },

      toggleIsTogetherEnabled: () => {
        set((state) => ({
          ...state,
          isTogetherEnabled: !state.isTogetherEnabled,
        }));
      },
      toggleTimerMode: async () => {
        if (!('Notification' in window)) {
          toast.error('브라우저가 notification을 지원하지 않습니다.');
          return;
        }

        if (get().timerMode === 'normal') {
          // 웹 푸시 권한 요청 & notification_token 등록 api
          try {
            const permission = await Notification.requestPermission();
            const messaging = getMessaging(app);

            if (permission === 'granted') {
              const notificationPublicKey = await getNotificationPublicKey();
              const token = await getToken(messaging, {
                vapidKey: notificationPublicKey,
              });
              // 토큰 백엔드에 보내기
              await enablePush({
                member_id: useAuthStore.getState().memberId,
                notification_token: token,
                device_type: getDeviceType(),
              });
              set((state) => ({
                ...state,
                timerMode: 'pomodoro',
              }));
            } else if (permission === 'denied') {
              toast.error('웹 알람이 허용되지 않았어요. QnA를 참고해주세요.');
            }
          } catch (e) {
            toast.error('서버에 문제가 발생했어요. 잠시 후 다시 시도해주세요.');
          }
        } else {
          // notification_token 만료 api
          try {
            await disablePush({
              member_id: useAuthStore.getState().memberId,
              device_type: getDeviceType(),
            });
            set((state) => ({
              ...state,
              timerMode: 'normal',
            }));
          } catch (e) {
            toast.error('서버에 문제가 발생했어요. 잠시 후 다시 시도해주세요.');
          }
        }
      },
    }),
    {
      name: 'timer-option-storage',
    }
  )
);
