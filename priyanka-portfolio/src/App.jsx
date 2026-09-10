import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./layout/SiteLayout";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";

const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1e293b",
    },
    secondary: {
      main: "#0ea5a5",
    },
    background: {
      default: "#eef3f8",
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
          backgroundColor: "#eef3f8",
          backgroundImage:
            "radial-gradient(circle at 15% -10%, rgba(14,165,165,0.12), transparent 36%), radial-gradient(circle at 85% -15%, rgba(30,41,59,0.1), transparent 34%), linear-gradient(180deg, #f8fbff 0%, #eef3f8 100%)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid #e2e8f0",
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
      <BrowserRouter>
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
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
