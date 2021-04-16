import "./App.css";
import { Route } from "react-router";
import { BrowserRouter, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignInPage";
import SignUp from './pages/SignUpPage';
import Header from "./components/Header/Header";
import Footer from './components/Footer/Footer';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/SignIn" component={SignIn} />
        <Route path="/SignUp" component={SignUp}/>
      </Switch>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
