'use client';

import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import { MainDropdownMenu } from '@/components/common/Header/_components/MainDropdownMenu';
import BarnabasOverviews from '@/app/(main)/barnabas/_components/BarnabasOverviews';

const BarnabasPage = () => {
  return (
    <>
      <Header center={<div>BARNABAS</div>} right={<MainDropdownMenu />} />
      <Container>
        <BarnabasOverviews />
      </Container>
    </>
  );
};

export default BarnabasPage;
