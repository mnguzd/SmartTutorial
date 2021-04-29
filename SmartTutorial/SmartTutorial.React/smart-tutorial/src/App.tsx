import "./App.css";
import { Route } from "react-router";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignInPage";
import SignUp from "./pages/SignUpPage";
import Header from "./components/Header/Header";
import ThemePage from "./pages/ThemePage";
import { AuthProvider } from "./auth/Auth";
import LogOut from "./pages/LogOutPage";
import NotFound from "./pages/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Switch>
          <Redirect from="/home" to="/" />
          <Route exact path="/" component={HomePage} />
          <Route path="/SignIn" component={SignIn} />
          <Route path="/SignUp" component={SignUp} />
          <Route path="/Themes/:themeId" component={ThemePage} />
          <Route path="/LogOut" component={LogOut} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
