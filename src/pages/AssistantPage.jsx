import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import ProfileChatPanel from "../chatbot/ProfileChatPanel";

const singleLineChipSx = {
  flex: "0 0 auto",
  bgcolor: "rgba(255,255,255,0.14)",
  color: "inherit",
  border: "1px solid rgba(255,255,255,0.18)",
  "& .MuiChip-label": {
    whiteSpace: "nowrap",
  },
};

const focusAreas = [
  "Recruiter summary",
  "Role fit",
  "Core strengths",
  "Project ownership",
  "Experience",
  "Contact details",
];

function AssistantPage() {
  return (
    <Stack spacing={2}>
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: { xs: 2.5, sm: 3 },
            background:
              "linear-gradient(135deg, rgba(30,41,59,0.97) 0%, rgba(15,118,110,0.94) 64%, rgba(45,212,191,0.92) 100%)",
            color: "common.white",
          }}
        >
          <Stack spacing={1.25}>
            <Typography variant="h4">Ask Priyanka</Typography>
            <Typography variant="body1" sx={{ maxWidth: 860, opacity: 0.92 }}>
              Use this assistant for general recruiter friendly questions about
              role fit, experience, ownership, strengths, tech stack, resume
              links, or contact details. Answers are limited to the profile data
              already available in this portfolio.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.75,
                alignItems: "flex-start",
              }}
            >
              {focusAreas.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  size="small"
                  sx={singleLineChipSx}
                />
              ))}
            </Box>
          </Stack>
        </Box>

        <ProfileChatPanel
          bodyMaxHeight={520}
          promptPlaceholder="Ask a recruiter-style question about Priyanka"
        />
      </Paper>
    </Stack>
  );
}

export default AssistantPage;
