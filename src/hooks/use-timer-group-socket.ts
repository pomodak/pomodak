import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { API_URL_NEST } from '@/constants/constants';
import { useAuthStore } from '@/stores/auth-store';
import { TimerType } from '@/stores/timer-state-store';
import type { IMemberInfo } from '@/components/modals/timer';

export const useTimerGroupSocket = (timerType: TimerType) => {
  const accessToken = useAuthStore((state) => state.tokens.accessToken);
  const [members, setMembers] = useState<IMemberInfo[]>([]);

  useEffect(() => {
    if (timerType !== 'Work') {
      setMembers([]);
      return;
    }

    const socket = io(API_URL_NEST, {
      auth: {
        token: accessToken,
      },
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('joinGroup', { jwtToken: accessToken });
    });

    socket.on('groupInfo', (data) => {
      setMembers(data.members);
      socket.off('groupInfo');
    });

    socket.on('newMember', (data) => {
      setMembers((prevMembers) => [...prevMembers, data]);
    });

    socket.on('memberLeft', (data) => {
      setMembers((prevMembers) =>
        prevMembers.filter((m) => m.member_id !== data.memberId)
      );
    });

    return () => {
      console.log('Disconnecting from socket server');
      socket.disconnect();
    };
  }, [accessToken, timerType]);

  return { members };
};