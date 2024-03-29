import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useModalStore } from '@/stores/use-modal-store';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useConsumeItem } from '@/hooks/use-consume-item';

export const PaletteAcquisitionDialog = () => {
  const { isOpen, data } = useModalStore(
    (state) => state.modals.paletteAcquisition
  );
  const [curQuantity, setCurQuantity] = useState(
    (data?.consumableItemInventory.quantity || 1) - 1
  );
  const closeModal = useModalStore((state) => state.closeModal);
  const { consume, isLoading } = useConsumeItem();

  const onClickHandler = async () => {
    if (!data) return;
    if (curQuantity < 1) {
      toast.error('개수가 부족합니다.');
      return;
    }
    await consume({ itemInventory: data.consumableItemInventory });
    setCurQuantity((prev) => prev - 1);
  };

  const onClickCloseModal = () => {
    closeModal('paletteAcquisition');
  };

  if (!isOpen || !data) {
    return null;
  }

  const { palette } = data;

  return (
    <>
      <AlertDialog open={isOpen}>
        <AlertDialogContent
          className={cn(
            `w-full md:max-w-mobile max-h-[400px] flex flex-col items-center py-6`
          )}
        >
          {palette.grade === 'Epic' ? (
            <Fireworks autorun={{ speed: 1, duration: 300 }} />
          ) : null}
          {palette.grade === 'Legendary' ? (
            <Fireworks autorun={{ speed: 4, duration: 2000 }} />
          ) : null}
          <AlertDialogTitle className="text-2xl">팔레트 변경</AlertDialogTitle>

          <div className="flex items-center gap-4">
            <div
              style={{ backgroundColor: palette.light_color }}
              className="w-8 h-8"
            />
            <div
              style={{ backgroundColor: palette.normal_color }}
              className="w-8 h-8"
            />
            <div
              style={{ backgroundColor: palette.dark_color }}
              className="w-8 h-8"
            />
            <div
              style={{ backgroundColor: palette.darker_color }}
              className="w-8 h-8"
            />
          </div>
          <div className="flex justify-center">
            <Badge>{palette.grade} 등급</Badge>
          </div>
          <p className="text-center font-semibold text-lg py-4">
            {palette.name}
          </p>
          <div className="w-full flex flex-col justify-end h-full gap-2">
            <AlertDialogFooter className="w-full">
              <AlertDialogCancel
                type="button"
                onClick={onClickCloseModal}
                className="h-12 w-full"
                disabled={isLoading}
              >
                확인
              </AlertDialogCancel>
              <AlertDialogAction
                type="button"
                onClick={onClickHandler}
                className="h-12 w-full"
                disabled={isLoading || curQuantity < 1}
              >
                다시뽑기 x {curQuantity}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
