import { Paper, Stack, Typography } from "@mui/material";

function HomePage() {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3 }}>
      <Stack spacing={1.5}>
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: "2rem", sm: "2.75rem" } }}
        >
          Building thoughtful web products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          I am Priyanka, a full-stack developer focused on clean interfaces,
          reliable APIs, and maintainable delivery. Use this page for your short
          intro, current role, and core strengths.
        </Typography>
      </Stack>
    </Paper>
  );
}

export default HomePage;
