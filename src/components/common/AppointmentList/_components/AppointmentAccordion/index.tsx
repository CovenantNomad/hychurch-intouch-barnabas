'use client';

import AppointmentAccordionHeader from '@/components/common/AppointmentAccordionHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { TAppointment } from '@/types/barnabas.types';
import { useEffect, useState } from 'react';
import AppointmentListItem from '../AppointmentListItem';

type Props = {
  sortedAppointments: Record<string, TAppointment[]>;
};

const AppointmentAccordion = ({ sortedAppointments }: Props) => {
  // ✅ 일정이 있는 섹션을 Open 상태로 유지하기 위한 상태 관리
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    // ✅ sortedAppointments 변경 시, 일정이 있는 항목만 열기
    const newOpenItems = Object.entries(sortedAppointments)
      .filter(([, appointments]) => appointments.length > 0)
      .map(([status]) => status);

    setOpenItems(newOpenItems);
  }, [sortedAppointments]);

  return (
    <div className="px-6">
      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        className="space-y-6"
      >
        {Object.entries(sortedAppointments).map(([status, appointments]) => (
          <AccordionItem key={status} value={status}>
            <AccordionTrigger className="border-b pb-1">
              <AppointmentAccordionHeader
                status={status}
                number={appointments.length}
              />
            </AccordionTrigger>
            <AccordionContent>
              <div className="divide-y divide-gray-100">
                {appointments.length !== 0 ? (
                  appointments.map((appointment, index) => (
                    <AppointmentListItem
                      key={appointment.appointmentId}
                      appointment={appointment}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="h-[100px] flex justify-center items-center mt-2">
                    일정 없음
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default AppointmentAccordion;
