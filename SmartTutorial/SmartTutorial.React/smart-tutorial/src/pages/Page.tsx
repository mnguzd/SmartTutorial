import { FC } from 'react';
import { Helmet } from 'react-helmet';

interface Props {
    title?: string;
  }
  const Page: FC<Props> = ({ title, children }) => (
   <div>
     <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </div>
  );
export default Page;