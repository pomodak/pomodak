import { useDailyStatisticQuery } from '@/apis/queries/member-queries';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTime } from '@/lib/date-format';

interface Props {
  dateStr: string;
  memberId: string;
}

const DailyStatisticSection = ({ memberId, dateStr }: Props) => {
  const { data, isLoading, isError } = useDailyStatisticQuery(
    memberId,
    dateStr
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-4 space-y-2">
        <Skeleton className="w-24 h-5" />
        <div className="grid grid-cols-2 w-full">
          <div className="w-full flex flex-col items-center justify-center space-y-2">
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-24 h-6" />
          </div>
          <div className="w-full flex flex-col items-center justify-center space-y-2">
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-24 h-6" />
          </div>
        </div>
      </div>
    );
  }
  if (isError || !data) {
    return <div>Error</div>;
  }
  return (
    <div className="flex flex-col items-center py-4">
      <p className="font-semibold pb-2">{data.date}</p>
      <div className="grid grid-cols-2 w-full">
        <div className="w-full flex flex-col items-center justify-center">
          <p className="text-primary">총 공부 시간</p>
          <p className="text-lg">{formatTime(data.totalSeconds)}</p>
        </div>
        <div className="w-full flex flex-col items-center justify-center">
          <p className="text-primary">완료한 섹션</p>
          <p className="text-lg">{formatTime(data.totalSeconds)}</p>
        </div>
      </div>
    </div>
  );
};

export default DailyStatisticSection;
