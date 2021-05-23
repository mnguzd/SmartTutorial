import { Route } from "react-router";
import { BrowserRouter, Redirect, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/Authorization/SignInPage";
import SignUp from "./pages/Authorization/SignUpPage";
import CoursePage from "./pages/CoursePage";
import SubjectPage from "./pages/SubjectPage";
import LogOut from "./pages/Authorization/LogOutPage";
import NotFound from "./pages/NotFoundPage";
import TopicPage from "./pages/TopicPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminCoursesPage from "./pages/Admin/Courses/AdminCoursesPage";
import AdminSubjectsPage from "./pages/Admin/Subjects/AdminSubjectsPage";
import AdminTopicsPage from "./pages/Admin/Topics/AdminTopicsPage";
import AdminQuestionsPage from "./pages/Admin/Questions/AdminQuestionsPage";
import AccountPage from "./pages/AccountPage";
import { ThemeProvider } from "@material-ui/core/styles";
import MainTheme from "./themes/MainTheme";
import { AuthProvider } from "./auth/Auth";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={MainTheme}>
          <Switch>
            <Redirect from="/home" to="/" />
            <Route exact path="/" component={HomePage} />
            <Route path="/SignIn" component={SignIn} />
            <Route path="/SignUp" component={SignUp} />
            <Route path="/Admin/Courses" component={AdminCoursesPage} />
            <Route path="/Admin/Subjects" component={AdminSubjectsPage} />
            <Route path="/Admin/Topics" component={AdminTopicsPage}/>
            <Route path="/Admin/Questions" component={AdminQuestionsPage}/>
            <Route path="/Admin" component={AdminDashboard} />
            <Route
              path="/Courses/:courseId/Subjects/:subjectId/Topics/:topicId"
              component={TopicPage}
            />
            <Route
              path="/Courses/:courseId/Subjects/:subjectId"
              component={SubjectPage}
            />
            <Route path="/Courses/:courseId" component={CoursePage} />
            <Route path="/Profile" component={AccountPage} />
            <Route path="/LogOut" component={LogOut} />
            <Route component={NotFound} />
          </Switch>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
