import {
  Box,
  Chip,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { getExperienceTimeline, portfolioData } from "../data/portfolioData";

function HomePage() {
  const { personal, summary, skills } = portfolioData;
  const experienceTimeline = getExperienceTimeline();

  const skillGroups = [
    { label: "Languages", items: skills.languages },
    { label: "Frontend", items: skills.frontend },
    { label: "Backend", items: skills.backend },
    { label: "Platforms", items: skills.platforms },
    { label: "Data and Quality", items: skills.dataAndQuality },
  ];

  const chipWrapSx = {
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
    alignItems: "flex-start",
  };

  const skillChipSx = {
    maxWidth: "100%",
    alignSelf: "flex-start",
    "& .MuiChip-label": {
      whiteSpace: "normal",
      wordBreak: "keep-all",
      overflowWrap: "normal",
      lineHeight: 1.2,
    },
  };

  return (
    <Stack spacing={1}>
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.75 }, borderRadius: 3 }}>
        <Stack spacing={1}>
          <Typography variant="h5">
            <strong>{personal.name}</strong>
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>{personal.title}</strong>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {summary}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{ pt: 0.5 }}
          >
            <Link
              href="/contact"
              underline="hover"
              sx={{ alignSelf: "center", ml: 0.5 }}
            >
              View full contact details
            </Link>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="h5">Experience Timeline</Typography>
              {experienceTimeline.map((role, index) => (
                <Stack key={`${role.company}-${role.startDate}`} spacing={1.2}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    gap={0.75}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {role.role} at {role.company}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {role.durationLabel}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {role.dateRangeLabel} | {role.location}
                  </Typography>
                  <Stack spacing={1}>
                    {role.highlights.map((point) => (
                      <Typography
                        key={point}
                        variant="body2"
                        color="text.secondary"
                      >
                        - {point}
                      </Typography>
                    ))}
                  </Stack>
                  {index < experienceTimeline.length - 1 && <Divider />}
                </Stack>
              ))}
              {experienceTimeline.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Add experience records in portfolioData.js to populate
                  timeline.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="h5">Core Skills</Typography>
              {skillGroups.map((group) => (
                <Stack key={group.label} spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {group.label}
                  </Typography>
                  <Box sx={chipWrapSx}>
                    {group.items.map((item) => (
                      <Chip
                        key={item}
                        label={item}
                        size="small"
                        sx={skillChipSx}
                      />
                    ))}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default HomePage;
