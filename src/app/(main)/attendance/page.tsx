'use client';

import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import { MainDropdownMenu } from '@/components/common/Header/_components/MainDropdownMenu';
import AttendanceOverview from './_components/AttendanceOverview';

const AttendancePage = () => {
  return (
    <>
      <Header center={<div>BARNABAS</div>} right={<MainDropdownMenu />} />
      <Container>
        <AttendanceOverview />
      </Container>
    </>
  );
};

export default AttendancePage;
