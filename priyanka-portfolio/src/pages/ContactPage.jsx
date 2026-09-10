import { Link, Paper, Stack, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { portfolioData } from "../data/portfolioData";

function ContactPage() {
  const { personal, education, awardsAndCertifications } = portfolioData;

  return (
    <Stack spacing={2}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3 }}>
        <Stack spacing={1}>
          <Typography variant="h4">Let us connect</Typography>
          <Typography variant="body1" color="text.secondary">
            Open to product engineering opportunities, technical collaboration,
            and architecture-focused conversations.
          </Typography>
          <Stack spacing={1} sx={{ pt: 0.5 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailIcon fontSize="small" />
              <Typography variant="body2">
                <strong>Email:</strong>{" "}
                <Link href={`mailto:${personal.email}`} underline="hover">
                  {personal.email}
                </Link>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneIcon fontSize="small" />
              <Typography variant="body2">
                <strong>Phone:</strong> {personal.phone}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <LinkedInIcon fontSize="small" />
              <Typography variant="body2">
                <strong>LinkedIn:</strong>{" "}
                <Link
                  href={personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                >
                  {personal.linkedin.replace("https://", "")}
                </Link>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                <strong>Location:</strong> {personal.location}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="h5">Education</Typography>
          {education.map((item) => (
            <Stack key={`${item.degree}-${item.year}`} spacing={0.3}>
              <Typography variant="subtitle1" fontWeight={600}>
                {item.degree}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.institute}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.year} | {item.score}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3 }}>
        <Stack spacing={1.2}>
          <Typography variant="h5">Awards and Certifications</Typography>
          {awardsAndCertifications.map((item) => (
            <Typography key={item} variant="body2" color="text.secondary">
              - {item}
            </Typography>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

export default ContactPage;
