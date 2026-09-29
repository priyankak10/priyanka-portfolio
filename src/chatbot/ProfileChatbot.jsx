import { useState } from "react";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { Fab, Paper } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ProfileChatPanel from "./ProfileChatPanel";

function ProfileChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <>
      {isOpen ? (
        <Paper
          elevation={0}
          sx={{
            position: "fixed",
            right: { xs: 12, sm: 20 },
            bottom: { xs: 68, sm: 78 },
            width: { xs: "calc(100vw - 24px)", sm: 380 },
            maxWidth: "100%",
            maxHeight: { xs: "70vh", sm: 560 },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 3,
            zIndex: 1300,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.18)",
            backdropFilter: "blur(14px)",
          }}
        >
          <ProfileChatPanel bodyMaxHeight={340} />
        </Paper>
      ) : null}

      <Fab
        color="secondary"
        aria-label="Open profile assistant"
        onClick={() => setIsOpen((open) => !open)}
        sx={{
          position: "fixed",
          right: { xs: 12, sm: 20 },
          bottom: { xs: 70, sm: 84 },
          zIndex: 1301,
          boxShadow: "0 14px 30px rgba(15, 118, 110, 0.24)",
        }}
      >
        <SmartToyOutlinedIcon />
      </Fab>
    </>
  );
}

export default ProfileChatbot;
