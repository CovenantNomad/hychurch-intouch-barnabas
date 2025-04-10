import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Container = ({ children }: Props) => {
  return (
    <div className="flex-1 px-6 pt-6 pb-20 overflow-y-auto">{children}</div>
  );
};

export default Container;
