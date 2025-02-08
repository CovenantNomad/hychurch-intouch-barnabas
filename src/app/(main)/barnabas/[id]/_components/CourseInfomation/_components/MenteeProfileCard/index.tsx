'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { calculateAge } from '@/lib/utils';
import { getMenteeProfile } from '@/repositories/barnabas';
import { useQuery } from '@tanstack/react-query';

type Props = {
  menteeId: string;
};

const MenteeProfileCard = ({ menteeId }: Props) => {
  const { isLoading, isFetching, data } = useQuery({
    queryKey: ['getMenteeProfile', menteeId],
    queryFn: () => getMenteeProfile(menteeId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!menteeId,
  });

  return (
    <div className="rounded-lg border shadow p-4 w-1/2">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 flex flex-col justify-center items-center bg-gray-50 rounded-full overflow-hidden ">
          {isLoading || isFetching ? (
            <Skeleton className="w-20 h-20 rounded-full" />
          ) : (
            <>
              <p className="mt-1 font-bold text-gray-800">
                {data?.name || '이름'}
              </p>
              <p className="mt-1 font-bold text-gray-800">
                {data?.gender === 'MAN' ? '형제' : '자매'}
              </p>
            </>
          )}
        </div>
        {isLoading || isFetching ? (
          <Skeleton className="w-24 h-3 mt-2" />
        ) : (
          <p className="mt-2 text-gray-500 text-sm">
            {data ? calculateAge(data.birthday) : 'N세 (N년생)'}
          </p>
        )}
      </div>
    </div>
  );
};

export default MenteeProfileCard;
