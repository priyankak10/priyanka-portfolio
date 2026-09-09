import { Grid, Paper, Stack, Typography } from "@mui/material";

function ProjectsPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Selected Projects</Typography>
      <Grid container spacing={2}>
        {[1, 2, 3].map((item) => (
          <Grid key={item} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper sx={{ p: 2.5, borderRadius: 3 }} elevation={0}>
              <Typography variant="h6">Project {item}</Typography>
              <Typography variant="body2" color="text.secondary">
                Add outcome-focused notes here: problem, stack, approach, and
                measurable impact.
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default ProjectsPage;
