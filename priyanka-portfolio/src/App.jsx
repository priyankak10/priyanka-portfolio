import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./layout/SiteLayout";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";

const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2f3f55",
    },
    secondary: {
      main: "#0f766e",
    },
    background: {
      default: "#f7f9fc",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f7f9fc",
          backgroundImage:
            "radial-gradient(circle at 15% -10%, rgba(27,168,160,0.08), transparent 36%), radial-gradient(circle at 85% -15%, rgba(47,63,85,0.06), transparent 34%), linear-gradient(180deg, #fcfdff 0%, #f4f7fb 100%)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid #e7edf4",
        },
      },
    },
  },
});

const routeConfig = [
  { path: "/", element: <HomePage /> },
  { path: "/projects", element: <ProjectsPage /> },
  { path: "/contact", element: <ContactPage /> },
];

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            {routeConfig.map((route) => (
              <Route
                key={route.path}
                index={route.path === "/"}
                path={route.path === "/" ? undefined : route.path}
                element={route.element}
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
