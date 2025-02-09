import { sectionHeaders } from '@/constants';

type Props = {
  number: number;
  status: string;
};

const AppointmentAccordionHeader = ({ status, number }: Props) => {
  return (
    <p className="text-lg font-semibold">
      {sectionHeaders[status]}{' '}
      <span className="inline-block text-sm ml-2">
        {number !== 0 ? `(${number}개 일정)` : ''}
      </span>
    </p>
  );
};

export default AppointmentAccordionHeader;
