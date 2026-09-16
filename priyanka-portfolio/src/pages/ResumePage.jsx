import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import { portfolioData } from "../data/portfolioData";

const resolveAssetUrl = (assetPath) =>
  `${import.meta.env.BASE_URL}${assetPath.replace(/^\//, "")}`;

function ResumePage() {
  const { resumes } = portfolioData;

  return (
    <Stack spacing={2}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 2 }}>
        <Stack spacing={1.25}>
          <Chip
            icon={<DescriptionIcon />}
            label="Resume Center"
            sx={{ alignSelf: "flex-start" }}
          />
          <Typography variant="h4">Resume previews and downloads</Typography>
          <Typography variant="body1" color="text.secondary">
            Review both resume versions below, preview the PDF in browser, and
            download the format you need.
          </Typography>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        {resumes.map((resume) => (
          <Grid key={resume.title} size={{ xs: 12, lg: 6 }}>
            <Paper
              elevation={0}
              sx={{ p: 2.5, borderRadius: 2, height: "100%" }}
            >
              <Stack spacing={2} sx={{ height: "100%" }}>
                <Stack spacing={0.75}>
                  <Typography variant="h6">{resume.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {resume.description}
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #d9e2ec",
                    bgcolor: "#eef3f8",
                  }}
                >
                  <Box
                    component="iframe"
                    title={`${resume.title} preview`}
                    src={resolveAssetUrl(resume.previewUrl)}
                    sx={{
                      display: "block",
                      width: "100%",
                      height: { xs: 420, sm: 560 },
                      border: 0,
                      bgcolor: "#fff",
                    }}
                  />
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {resume.previewNote}
                </Typography>

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Button
                    component="a"
                    href={resolveAssetUrl(resume.previewUrl)}
                    target="_blank"
                    rel="noreferrer"
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                  >
                    Open preview
                  </Button>
                  {resume.downloads.map((file) => (
                    <Button
                      key={file.href}
                      component="a"
                      href={resolveAssetUrl(file.href)}
                      download
                      variant="contained"
                      startIcon={<DownloadIcon />}
                    >
                      {file.label}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default ResumePage;
