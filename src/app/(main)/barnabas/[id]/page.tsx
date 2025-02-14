'use client';

import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import { MainDropdownMenu } from '@/components/common/Header/_components/MainDropdownMenu';
import AppointmentDetail from './_components/AppointmentDetail';
import CourseInfomation from './_components/CourseInfomation';

const BarnabasDetailPage = () => {
  return (
    <>
      <Header left={<Header.BackButton />} right={<MainDropdownMenu />} />
      <Container>
        <CourseInfomation />
        <AppointmentDetail />
        {/* <PrepareSmt /> */}
      </Container>
    </>
  );
};

export default BarnabasDetailPage;
