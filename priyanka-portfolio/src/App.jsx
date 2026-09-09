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
      main: "#0f172a",
    },
    background: {
      default: "#f5f7fb",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
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
