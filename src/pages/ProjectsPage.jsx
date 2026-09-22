import { Grid, Paper, Stack, Typography } from "@mui/material";
import { portfolioData } from "../data/portfolioData";

function ProjectsPage() {
  const { keyOwnership } = portfolioData;

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Ownership and Product Impact</Typography>
      <Typography variant="body1" color="text.secondary">
        These are the core areas where I drove implementation, reliability, and
        platform-level delivery.
      </Typography>

      <Grid container spacing={2}>
        {keyOwnership.map((project) => (
          <Grid key={project.area} size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2.5, borderRadius: 2 }} elevation={0}>
              <Stack spacing={1.25}>
                <Typography variant="h6">{project.area}</Typography>
                {project.impact.map((line) => (
                  <Typography key={line} variant="body2" color="text.secondary">
                    - {line}
                  </Typography>
                ))}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default ProjectsPage;
