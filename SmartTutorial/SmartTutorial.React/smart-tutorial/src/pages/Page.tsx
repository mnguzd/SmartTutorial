import { FC } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/Header/Header";

interface Props {
  title?: string;
}

const Page: FC<Props> = ({ title, children }) => {
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Header />
      {children}
    </div>
  );
};
export default Page;
