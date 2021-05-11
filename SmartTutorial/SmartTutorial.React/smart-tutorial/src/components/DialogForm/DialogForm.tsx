import { Dialog } from "@material-ui/core";
import React, { FC } from "react";

interface Props {
  title?: string;
  openPopup: boolean;
  setOpenPopup: React.Dispatch<React.SetStateAction<any>>;
}

export const DialogForm: FC<Props> = ({ children, openPopup }) => {
  return <Dialog open={openPopup}>{children}</Dialog>;
};
