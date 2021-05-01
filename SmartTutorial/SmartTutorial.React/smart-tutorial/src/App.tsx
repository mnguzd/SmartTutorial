import "./App.css";
import { Route } from "react-router";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignInPage";
import SignUp from "./pages/SignUpPage";
import Header from "./components/Header/Header";
import ThemePage from "./pages/ThemePage";
import SubjectPage from "./pages/SubjectPage";
import { AuthProvider } from "./auth/Auth";
import LogOut from "./pages/LogOutPage";
import NotFound from "./pages/NotFoundPage";
import TopicPage from "./pages/TopicPage";
import { ThemeProvider } from "@material-ui/core";
import MainTheme from "./themes/MainTheme";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={MainTheme}>
          <Header />
          <Switch>
            <Redirect from="/home" to="/" />
            <Route exact path="/" component={HomePage} />
            <Route path="/SignIn" component={SignIn} />
            <Route path="/SignUp" component={SignUp} />
            <Route path="Themes/:themeId/Subjects/:subjectId/Topic/:topicId" component={TopicPage}/>
            <Route
              path="/Themes/:themeId/Subjects/:subjectId"
              component={SubjectPage}
            />
            <Route path="/Themes/:themeId" component={ThemePage} />
            <Route path="/LogOut" component={LogOut} />
            <Route component={NotFound} />
          </Switch>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
