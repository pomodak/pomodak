import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReactNode, useState } from 'react';
import { IMember } from '@/models/member.model';
import { useEditMemberMutation } from '@/apis/mutations/member-mutations';
import { toast } from 'sonner';
import { useCharacterInventoryQuery } from '@/apis/queries/member-queries';
import { ScrollArea } from '../ui/scroll-area';

interface EditProfileImageDialogProps {
  member: IMember;
  children: ReactNode;
}

export function EditProfileImageDialog({
  children,
  member,
}: EditProfileImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(member.image_url);

  const { data: characterInventory } = useCharacterInventoryQuery(
    member.member_id
  );

  const { mutateAsync: editMember } = useEditMemberMutation();

  const handleEditProfileClick = async () => {
    if (selectedImageUrl === member.image_url) return setIsOpen(false);
    try {
      await editMember({
        memberId: member.member_id,
        body: { image_url: selectedImageUrl },
      });
      toast.error('성공적으로 캐릭터를 변경했습니다.');
      setIsOpen(false);
    } catch (e) {
      // 네트워크 에러나 기타 예외 처리
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-mobile">
        <DialogHeader className="justify-center items-center">
          <DialogTitle>캐릭터 변경</DialogTitle>
          <DialogDescription>
            선택한 캐릭터로 공부에 참여할 수 있어요
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className={'w-full h-64 p-4'}>
          <div className="grid grid-cols-4 gap-2">
            {characterInventory?.map((characterInventory) => {
              const isSelected =
                characterInventory.character.image_url === selectedImageUrl;
              return (
                <div
                  key={characterInventory.character_inventory_id}
                  onClick={() =>
                    setSelectedImageUrl(characterInventory.character.image_url)
                  }
                  className="relative"
                >
                  <img
                    src={characterInventory.character.image_url}
                    alt={`${characterInventory.character.name}-image`}
                    className="w-full aspect-square cursor-pointer rounded-full"
                  />
                  {isSelected ? (
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                  ) : null}
                  <p className="w-full text-xs font-semibold text-center line-clamp-2">
                    {characterInventory.character.name}
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="w-full">
              취소
            </Button>
          </DialogClose>
          <Button onClick={handleEditProfileClick} className="w-full">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}