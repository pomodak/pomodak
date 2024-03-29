import { nestHttpRequest } from '../common/http-request';
import type { ApiSuccessResponse } from '../types/api-response';
import type { IMember } from '@/types/models/member.model';
import type { ICharacterInventory } from '@/types/models/character.model';
import type {
  IConsumableItemInventory,
  IFoodItemInventory,
} from '@/types/models/item.model';
import type {
  IDailyStatistic,
  IMontlyStatistic,
  IStatisticHeatMapData,
} from '@/types/models/statistic.model';
import type { IStudyStreak } from '@/types/models/streak.model';
import { useAuthStore } from '@/stores/auth-store';
import { IAccount } from '@/types/models/account.model';

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// 현재유저 조회
export const fetchCurrentMember = async () => {
  const response = await nestHttpRequest.get<
    ApiSuccessResponse<{ member: IMember }>
  >('/timer-api/members/me');
  useAuthStore.getState().setMemberId(response.data.data.member.member_id);
  return response.data.data.member;
};

// 현재유저 계정 조회
export const fetchCurrentAccount = async () => {
  const response = await nestHttpRequest.get<ApiSuccessResponse<IAccount>>(
    '/timer-api/auth/me'
  );
  return response.data.data;
};

// 보유중인 음식 조회
export const fetchFoodInventory = async (memberId: string) => {
  const response = await nestHttpRequest.get<
    ApiSuccessResponse<{ item_inventory: IFoodItemInventory[] }>
  >(`/timer-api/members/${memberId}/item-inventory?item_type=${'Food'}`);
  return response.data.data.item_inventory;
};

// 보유중인 사용아이템 조회
export const fetchConsumableInventory = async (memberId: string) => {
  const response = await nestHttpRequest.get<
    ApiSuccessResponse<{ item_inventory: IConsumableItemInventory[] }>
  >(`/timer-api/members/${memberId}/item-inventory?item_type=${'Consumable'}`);
  return response.data.data.item_inventory;
};

// 보유중인 캐릭터 조회
export const fetchCharacterInventory = async (memberId: string) => {
  const response = await nestHttpRequest.get<
    ApiSuccessResponse<{ character_inventory: ICharacterInventory[] }>
  >(`/timer-api/members/${memberId}/character-inventory`);
  return response.data.data.character_inventory;
};

// 유저 스트릭 조회
export const fetchStudyStreak = async (memberId: string) => {
  const response = await nestHttpRequest.get<ApiSuccessResponse<IStudyStreak>>(
    `/timer-api/members/${memberId}/study-streak`
  );
  return response.data.data;
};

// 유저 공부기록 통계 조회(daily)
export const fetchDailyStatistic = async (
  memberId: string,
  dateStr: string
) => {
  const response = await nestHttpRequest.get<
    ApiSuccessResponse<IDailyStatistic>
  >(
    `/timer-api/members/${memberId}/statistics?date=${dateStr}&timezone=${timeZone}`
  );
  return response.data.data;
};

// 유저 공부기록 통계 조회(monthly)
export const fetchMonthlyStatistic = async (
  memberId: string,
  year: number,
  month: number
) => {
  const response = await nestHttpRequest.get<
    ApiSuccessResponse<IMontlyStatistic>
  >(
    `/timer-api/members/${memberId}/statistics/monthly?year=${year}&month=${month}&timezone=${timeZone}`
  );
  return response.data.data;
};

// 유저 공부기록 통계 조회(heat-map)
export const fetchStatisticHeatMap = async (
  memberId: string,
  start: string,
  end: string
) => {
  const response = await nestHttpRequest.get<
    ApiSuccessResponse<IStatisticHeatMapData[]>
  >(
    `/timer-api/members/${memberId}/statistics/heat-map?start=${start}&end=${end}&timezone=${timeZone}`
  );
  return response.data.data;
};

// 유저 정보 수정
export const editMember = async (
  memberId: string,
  body: { nickname?: string; status_message?: string; image_url?: string }
) => {
  const response = await nestHttpRequest.patch<ApiSuccessResponse<null>>(
    `/timer-api/members/${memberId}`,
    body
  );
  return response.data.data;
};
