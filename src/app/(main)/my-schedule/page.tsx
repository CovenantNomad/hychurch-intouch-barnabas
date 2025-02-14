'use client';

import AddSchedule from '@/components/common/AddSchedule';
import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import { MainDropdownMenu } from '@/components/common/Header/_components/MainDropdownMenu';
import ScheduleList from './_components/ScheduleList';

export default function MySchedulePage() {
  return (
    <>
      <Header
        left={<AddSchedule />}
        center={<div className="text-center">MY SCHEDULE</div>}
        right={<MainDropdownMenu />}
      />
      <Container>
        <ScheduleList />
      </Container>
    </>
  );
}
