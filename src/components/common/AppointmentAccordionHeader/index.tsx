type Props = {
  number: number;
  status: string;
};

const sectionHeaders: { [key: string]: string } = {
  scheduled: '예정된 약속',
  completed: '완료된 약속',
  canceled: '취소된 약속',
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
