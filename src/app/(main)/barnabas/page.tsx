'use client';

import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import { MainDropdownMenu } from '@/components/common/Header/_components/MainDropdownMenu';
import BarnabasOverviews from './_components/BarnabasOverviews';

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
