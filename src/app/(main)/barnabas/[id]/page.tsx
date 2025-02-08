'use client';

import Header from '@/components/common/Header';
import AppointmentDetail from './_components/AppointmentDetail';
import CourseInfomation from './_components/CourseInfomation';

const BarnabasDetailPage = () => {
  return (
    <>
      <Header left={<Header.BackButton />} />
      <CourseInfomation />
      <AppointmentDetail />
    </>
  );
};

export default BarnabasDetailPage;
