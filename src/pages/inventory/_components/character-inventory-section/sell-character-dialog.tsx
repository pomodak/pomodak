import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useSellCharacter from '../../hooks/use-sell-character';
import { useState } from 'react';
import type { ICharacterInventory } from '@/types/models/character.model';
import type { IMember } from '@/types/models/member.model';
import { commonIcons } from '@/components/icons';

interface SellCharacterDialogProps {
  characterInventory: ICharacterInventory;
  member: IMember;
  children: React.ReactNode;
}

export const SellCharacterDialog = ({
  characterInventory,
  member,
  children,
}: SellCharacterDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    isLoading,
    count,
    incrementCount,
    decrementCount,
    onSubmitSell,
    MaxCount,
  } = useSellCharacter(characterInventory, member);

  const handleSubmit = () => {
    onSubmitSell();
    setIsOpen(false);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        className={`w-full md:max-w-mobile max-h-[400px] flex flex-col justify-start items-center`}
      >
        <div className="mx-auto w-full max-w-sm">
          <DialogHeader>
            <DialogTitle>{characterInventory.character.name} 판매</DialogTitle>
            <DialogDescription>수량을 선택해주세요.</DialogDescription>
          </DialogHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={decrementCount}
                disabled={count <= 1}
              >
                <img
                  src={commonIcons.minus}
                  alt="minus icon"
                  className="size-4"
                />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold tracking-tighter">
                  {count}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  개
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={incrementCount}
                disabled={count >= MaxCount}
              >
                <img
                  src={commonIcons.plus}
                  alt="plus icon"
                  className="size-4"
                />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? '판매중 ...' : '판매하기'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
