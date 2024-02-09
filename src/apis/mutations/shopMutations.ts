import { useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseItem, sellCharacter } from '../services/shop.api';
import {
  CHARACTER_INVENTORY_QUERY_KEY,
  CURRENT_MEMBER_QUERY_KEY,
  FOOD_INVENTORY_QUERY_KEY,
} from '../queries/memberQueries';
import { IMember } from '@/models/member.model';

// 아이템 구매
export const usePurchaseItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { item_id: number; count: number }) => {
      return purchaseItem(body);
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: [FOOD_INVENTORY_QUERY_KEY],
      });

      queryClient.setQueryData(
        [CURRENT_MEMBER_QUERY_KEY],
        (old: IMember | null) => {
          if (!old) return null;
          return {
            ...old,
            point: result.balance_after_transaction,
          };
        }
      );
    },
  });
};

// 캐릭터 판매
export const useSellCharacterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { character_inventory_id: string; count: number }) => {
      return sellCharacter(body);
    },

    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: [CHARACTER_INVENTORY_QUERY_KEY],
      });

      queryClient.setQueryData(
        [CURRENT_MEMBER_QUERY_KEY],
        (old: IMember | null) => {
          if (!old) return null;
          return {
            ...old,
            point: result.balance_after_transaction,
          };
        }
      );
    },
  });
};
