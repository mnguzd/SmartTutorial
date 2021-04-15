import "./App.css";
import { Route } from "react-router";
import { BrowserRouter, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignInPage";
import Header from "./components/Header/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/SignIn" component={SignIn} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
