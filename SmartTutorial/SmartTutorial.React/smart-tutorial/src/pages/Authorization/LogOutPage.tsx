import { useEffect } from "react";
import { useAuth } from "../../auth/Auth";
import { useHistory } from "react-router-dom";
import Page from "../Page";

export default function LogOut() {
  const { logOut } = useAuth();
  const history = useHistory();
  useEffect(() => {
    async function asyncLogOut() {
      await logOut();
    }
    asyncLogOut();
    history.push("/signin");
  });
  return <Page title="Logging out" />;
}
