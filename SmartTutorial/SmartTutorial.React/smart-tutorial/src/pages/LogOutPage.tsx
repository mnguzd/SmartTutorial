import { useEffect } from "react";
import { useAuth } from "../auth/Auth";
import { useHistory } from "react-router-dom";
import Page from "./Page";

export default function LogOut() {
  const { isAuthenticated, logOut } = useAuth();
  const history = useHistory();
  useEffect(() => {
    if (isAuthenticated) {
      logOut();
      history.push("/");
    }
  });
  return <Page title="Logging out"></Page>;
}
