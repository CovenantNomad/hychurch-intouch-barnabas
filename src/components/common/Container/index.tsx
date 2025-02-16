import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="px-6 pt-6 pb-32">{children}</div>;
};

export default Container;
