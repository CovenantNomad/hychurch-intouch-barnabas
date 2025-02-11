'use client';

import AddSchedule from '@/components/common/AddSchedule';
import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import ScheduleList from './_components/ScheduleList';

export default function MySchedulePage() {
  return (
    <>
      <Header
        left={<Header.ViewButton text="전체일정" path="/" />}
        center={<div className="text-center">MY SCHEDULE</div>}
        right={<AddSchedule />}
      />
      <Container>
        <ScheduleList />
      </Container>
    </>
  );
}
