import { useCurrentMemberQuery } from '@/apis/queries/memberQueries';
import { MyPageHeader } from '@/components/headers/MyPageHeader';
import { MemberProfileSection } from '@/sections/myPage/MemberProfileSection';
import { StudyRecordTabs } from '@/sections/myPage/StudyRecordTabs';

export const MyPage = () => {
  const { data, isPending } = useCurrentMemberQuery();

  if (isPending || !data) {
    return 'Loading...';
  }

  return (
    <>
      <div className="rounded-t-md rounded-b-3xl pt-safe-offset-14 h-full pb-safe-offset-14">
        <MyPageHeader />
        <main className="h-full overflow-y-scroll scrollbar-hide px-4">
          <MemberProfileSection member={data} />
          <StudyRecordTabs member={data} />
        </main>
      </div>
    </>
  );
};