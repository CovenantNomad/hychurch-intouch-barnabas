'use client';

import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import { MainDropdownMenu } from '@/components/common/Header/_components/MainDropdownMenu';
import AppointmentDetail from '@/app/(main)/barnabas/[id]/_components/AppointmentDetail';
import CourseInfomation from '@/app/(main)/barnabas/[id]/_components/CourseInfomation';
import PrepareSmt from '@/app/(main)/barnabas/[id]/_components/PrepareSmt';

const BarnabasDetailPage = () => {
  return (
    <>
      <Header left={<Header.BackButton />} right={<MainDropdownMenu />} />
      <Container>
        <CourseInfomation />
        <AppointmentDetail />
        <PrepareSmt />
      </Container>
    </>
  );
};

export default BarnabasDetailPage;
