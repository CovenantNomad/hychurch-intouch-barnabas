'use client';

import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import AppointmentDetail from './_components/AppointmentDetail';
import CourseInfomation from './_components/CourseInfomation';

const BarnabasDetailPage = () => {
  return (
    <>
      <Header left={<Header.BackButton />} />
      <Container>
        <CourseInfomation />
        <AppointmentDetail />
      </Container>
    </>
  );
};

export default BarnabasDetailPage;
