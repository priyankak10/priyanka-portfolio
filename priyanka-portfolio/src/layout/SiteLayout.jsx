import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Link as RouterLink,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];

function SiteLayout({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();

  const isActiveRoute = (to) => location.pathname === to;

  const handleDrawerToggle = () => {
    setIsDrawerOpen((open) => !open);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const drawerContent = (
    <Box sx={{ width: 260 }} role="presentation" onClick={closeDrawer}>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={RouterLink}
            to={item.to}
            selected={isActiveRoute(item.to)}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="fixed" color="primary" elevation={1}>
        <Toolbar sx={{ minHeight: { xs: 64, sm: 72 } }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              color: "inherit",
              textDecoration: "none",
              fontWeight: 700,
              letterSpacing: 0.4,
            }}
          >
            Priyanka Portfolio
          </Typography>

          <Box sx={{ ml: "auto", display: { xs: "none", sm: "flex" }, gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                color="inherit"
                sx={{
                  fontWeight: 600,
                  opacity: isActiveRoute(item.to) ? 1 : 0.75,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <IconButton
            color="inherit"
            edge="end"
            aria-label="open navigation"
            onClick={handleDrawerToggle}
            sx={{ ml: "auto", display: { xs: "inline-flex", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={closeDrawer}
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: "80px", sm: "88px" },
          pb: { xs: "76px", sm: "84px" },
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
          {children ?? <Outlet />}
        </Container>
      </Box>

      <AppBar
        position="fixed"
        color="default"
        elevation={3}
        sx={{ top: "auto", bottom: 0 }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 60, sm: 64 },
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Priyanka
          </Typography>
          <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 } }}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                size={isMobile ? "small" : "medium"}
                color="inherit"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  fontWeight: isActiveRoute(item.to) ? 700 : 500,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default SiteLayout;
