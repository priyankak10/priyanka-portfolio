import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Stack,
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
import { portfolioData } from "../data/portfolioData";

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
  const { personal, sidebar } = portfolioData;

  const sidebarListSx = {
    m: 0,
    pl: 2,
    display: "grid",
    gap: 0.4,
    "& li": {
      color: "#e2e8f0",
      fontSize: "0.82rem",
      lineHeight: 1.35,
    },
  };

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
        <Toolbar sx={{ minHeight: { xs: 60, sm: 66 } }}>
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
          p: 1,
          pt: { xs: "74px", sm: "80px" },
          pb: { xs: "70px", sm: "76px" },
          bgcolor: "transparent",
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 1, sm: 1.5 } }}>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "stretch" }}>
            <Box
              component="aside"
              sx={{
                width: 245,
                flexShrink: 0,
                display: { xs: "none", lg: "block" },
              }}
            >
              <Box
                sx={{
                  position: "sticky",
                  top: 8,
                  minHeight: "calc(100vh - 80px - 76px - 16px)",
                  borderRadius: 2,
                  p: 1.5,
                  color: "#fff",
                  background:
                    "linear-gradient(165deg, rgba(30,41,59,1) 0%, rgba(15,118,110,1) 100%)",
                  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.25)",
                }}
              >
                <Stack spacing={1.25}>
                  <Typography variant="body2">{personal.location}</Typography>
                  <Link
                    href={`mailto:${personal.email}`}
                    underline="hover"
                    color="inherit"
                    sx={{
                      fontSize: "0.82rem",
                      overflowWrap: "anywhere",
                      lineHeight: 1.3,
                    }}
                  >
                    {personal.email}
                  </Link>
                  <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                    {personal.phone}
                  </Typography>
                  <Link
                    href={personal.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    underline="hover"
                    color="inherit"
                    sx={{
                      fontSize: "0.82rem",
                      overflowWrap: "anywhere",
                      lineHeight: 1.3,
                    }}
                  >
                    LinkedIn Profile
                  </Link>

                  <Divider sx={{ borderColor: "rgba(255,255,255,0.25)" }} />

                  <Typography variant="subtitle2" fontWeight={600}>
                    Core Stack
                  </Typography>
                  <Box component="ul" sx={sidebarListSx}>
                    {sidebar.coreStack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </Box>

                  <Divider sx={{ borderColor: "rgba(255,255,255,0.25)" }} />

                  <Typography variant="subtitle2" fontWeight={600}>
                    Engineering Tools
                  </Typography>
                  <Box component="ul" sx={sidebarListSx}>
                    {sidebar.engineeringTools.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </Box>

                  <Divider sx={{ borderColor: "rgba(255,255,255,0.25)" }} />

                  <Typography variant="subtitle2" fontWeight={600}>
                    Strengths
                  </Typography>
                  <Box component="ul" sx={sidebarListSx}>
                    {sidebar.strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </Box>
                </Stack>
              </Box>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>{children ?? <Outlet />}</Box>
          </Box>
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
            minHeight: { xs: 54, sm: 58 },
            justifyContent: "space-between",
            gap: 0.75,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Priyanka
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 0.25, sm: 0.75 },
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
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
