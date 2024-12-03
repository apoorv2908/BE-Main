import { useLocation } from "react-router-dom";

import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Classes from "./Pages/Classes";
import BookDetails from "./Pages/BookDetails";
import Aboutus from "./Components/Aboutus";
import Page from "./Components/Access/Page";
import Studentlogin from "./Components/Access/Studentlogin";
import Teacherlogin from "./Components/Access/Teacherlogin";
import { AuthProvider } from "./Components/Access/AuthContext";
import Teacherregister from "./Components/Access/Teacherregister";
import Schoollogin from "./Components/Access/Schoollogin";
import Subjects from "./Pages/Subjects";
import ContactPage from "./Components/ContactPage";
import Studentregister from "./Components/Access/Studentregister";
import TeacherDashboard from "./Pages/TeacherDashboard";
import ProtectedRoute from "./Components/Access/ProtectedRoute";
import ChapterPages from "./Pages/ChapterPages";
import LoginRequiredModal from "./Components/Access/LoginRequiredModal";
import Updatestudents from "./Components/Access/Updatestudents";
import Dashboardbooks from "./Pages/Dashboardbooks";
import StudentDashboard from "./Pages/StudentDashboard";
import Popularbooks from "./Components/Popularbooks";
import Bookpages from "./Pages/Bookpages";
import Dashboardbooksstudents from "./Pages/Dashboardbooksstudents";
import MybookChapterpages from "./Pages/MybookChapterpages";
import Bookpages2 from "./Pages/Bookpages2";
import TestGenerator from "./Pages/TestGenerator";
import Addquestion from "./Pages/Addquestion";
import TestEdit from "./Pages/TestEdit";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Header />
          <Content />

          <Routes>
            <Route
              path="/"
              element={
                <Page title="Home - Binary Education">
                  <Home />
                </Page>
              }
            />
            <Route
              path="/classes/:class_id"
              element={
                <Page title="Classes - Binary Education">
                  <Classes />
                </Page>
              }
            />
            <Route
              path="/book/:book_id"
              element={
                <Page title="Book Details - Binary Education">
                  <BookDetails />
                </Page>
              }
            />
            <Route
              path="/about"
              element={
                <Page title="About Us - Binary Education">
                  <Aboutus />
                </Page>
              }
            />
            <Route
              path="/login-student"
              element={
                <Page title="Login Student - Binary Education">
                  <Studentlogin />
                </Page>
              }
            />
            <Route
              path="/login-teacher"
              element={
                <Page title="Login Teacher - Binary Education">
                  <Teacherlogin />
                </Page>
              }
            />
            <Route
              path="/register-teacher"
              element={
                <Page title="Registration Teacher - Binary Education">
                  <Teacherregister />
                </Page>
              }
            />
            <Route
              path="/register-student"
              element={
                <Page title="Registration Student - Binary Education">
                  <Studentregister />
                </Page>
              }
            />
            <Route
              path="/login-school"
              element={
                <Page title="Login School - Binary Education">
                  <Schoollogin />
                </Page>
              }
            />
            <Route
              path="/subjects/:subject_id"
              element={
                <Page title="Subjects - Binary Education">
                  <Subjects />
                </Page>
              }
            />
            <Route
              path="/contact-page"
              element={
                <Page title="Contacts - Binary Education">
                  <ContactPage />
                </Page>
              }
            />
            <Route
              path="/teacher-dashboard/:teacher_id"
              element={
                <ProtectedRoute>
                  <Page title="Dashboard Teacher - Binary Education">
                    <TeacherDashboard />
                  </Page>
                </ProtectedRoute>
              }
            />

            <Route
              path="/our-popular-books"
              element={
                <Page title="Our Popular Books - Binary Education">
                  <Popularbooks />
                </Page>
              }
            />

            <Route
              path="/student-dashboard/:student_id"
              element={
                <ProtectedRoute>
                  <Page title="Dashboard Student - Binary Education">
                    <StudentDashboard />
                  </Page>
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-student/:id"
              element={
                <ProtectedRoute>
                  <Page title="Update Details Student - Binary Education">
                    <Updatestudents />
                  </Page>
                </ProtectedRoute>
              }
            />

            <Route
              path="/test-generator/:teacherId"
              element={
                <ProtectedRoute>
                  <Page title="Test Generator - Binary Education">
                    <TestGenerator />
                  </Page>
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-test/:test_id"
              element={
                <ProtectedRoute>
                  <Page title="Test Generator - Binary Education">
                    <TestEdit />
                  </Page>
                </ProtectedRoute>
              }
            />

            <Route
              path="/book-details/:book_id"
              element={
                <ProtectedRoute>
                  <Page title="Your books - Binary Education">
                    <Dashboardbooks />
                  </Page>
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-book-details/:book_id"
              element={
                <ProtectedRoute>
                  <Page title="Your books - Binary Education">
                    <Dashboardbooksstudents />
                  </Page>
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-book-pages/:chapter_id"
              element={
                <ProtectedRoute>
                  <Page title="Your books - Binary Education">
                    <MybookChapterpages />
                  </Page>
                </ProtectedRoute>
              }
            />

            <Route
              path="/book-pages/:book_id"
              element={
                <ProtectedRoute>
                  <Page title="Your books - Binary Education">
                    <Bookpages />
                  </Page>
                </ProtectedRoute>
              }
            />

            <Route
              path="/book-page/:book_id"
              element={
                <ProtectedRoute>
                  <Page title="Your books - Binary Education">
                    <Bookpages2 />
                  </Page>
                </ProtectedRoute>
              }
            />

            <Route
              path="/chapterpages/:chapter_id"
              element={
                <ProtectedRoute>
                  <Page title="Book - Binary Education">
                    <ChapterPages />
                  </Page>
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-test/:test_id"
              element={
                <ProtectedRoute>
                  <Page title="Edit - Binary Education">
                    <Addquestion />
                  </Page>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  );

  function Content() {
    const location = useLocation();

    return (
      <div className="App">
        {location.pathname !== "/teacher-dashboard/:teacher_id" && <Header />}
      </div>
    );
  }
}

export default App;
