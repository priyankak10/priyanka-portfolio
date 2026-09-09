import { Paper, Stack, Typography } from "@mui/material";

function ContactPage() {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h4">Let us connect</Typography>
        <Typography variant="body1" color="text.secondary">
          Share your email, LinkedIn, and preferred timezone here so people can
          reach out for collaboration, interviews, or project discussions.
        </Typography>
      </Stack>
    </Paper>
  );
}

export default ContactPage;
