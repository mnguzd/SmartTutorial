import "./App.css";
import { Route } from "react-router";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignInPage";
import SignUp from './pages/SignUpPage';
import Header from "./components/Header/Header";
import ThemePage from './pages/ThemePage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Redirect from="/home" to="/"/>
        <Route exact path="/" component={HomePage} />
        <Route path="/SignIn" component={SignIn} />
        <Route path="/SignUp" component={SignUp}/>
        <Route path="/Themes/:themeId" component={ThemePage}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
