'use client';

import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import { MainDropdownMenu } from '@/components/common/Header/_components/MainDropdownMenu';
import BarnabasHeader from '@/app/(main)/profile/_components/BarnabasHeader/BarnabasHeader';
import BarnabasRecordsBox from '@/app/(main)/profile/_components/BarnabasRecordsBox';
import BarnabasYearlyRecords from '@/app/(main)/profile/_components/BarnabasYearlyRecords';

const ProfilePage = () => {
  return (
    <>
      <Header center={<div>MY PAGES</div>} right={<MainDropdownMenu />} />
      <Container>
        <BarnabasHeader />
        <BarnabasRecordsBox />
        <BarnabasYearlyRecords />
      </Container>
    </>
  );
};

export default ProfilePage;
