import { useMemo, useState } from "react";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  Box,
  Chip,
  Fab,
  IconButton,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  answerProfileQuestion,
  getChatSuggestions,
} from "./profileKnowledgeBase";

const initialMessage = {
  id: "welcome",
  role: "assistant",
  text: "Ask about Priyanka's experience, skills, project ownership, education, resume, awards, or contact details. Answers are restricted to the profile data in this portfolio.",
  citations: [],
};

const inlineLinkPattern =
  /(https?:\/\/[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+?[0-9][0-9\s-]{7,}[0-9])/gi;

const getLinkHref = (value) => {
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return `mailto:${value}`;
  }

  const normalizedPhone = value.replace(/[\s-]/g, "");
  if (/^\+?[0-9]{8,}$/i.test(normalizedPhone)) {
    return `tel:${normalizedPhone}`;
  }

  return null;
};

const renderInlineContent = (text) => {
  const matches = [...text.matchAll(inlineLinkPattern)];

  if (!matches.length) {
    return text;
  }

  const segments = [];
  let currentIndex = 0;

  matches.forEach((match, index) => {
    const [value] = match;
    const startIndex = match.index ?? 0;

    if (startIndex > currentIndex) {
      segments.push(text.slice(currentIndex, startIndex));
    }

    const href = getLinkHref(value);

    if (href) {
      segments.push(
        <Link
          key={`${value}-${index}`}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          underline="hover"
          color="inherit"
        >
          {value}
        </Link>,
      );
    } else {
      segments.push(value);
    }

    currentIndex = startIndex + value.length;
  });

  if (currentIndex < text.length) {
    segments.push(text.slice(currentIndex));
  }

  return segments;
};

const renderMessageText = (text) => {
  const lines = text.split("\n");
  const bulletLines = lines.filter((line) => line.trim().startsWith("- "));
  const hasOnlyBullets =
    bulletLines.length > 0 && bulletLines.length === lines.length;

  if (hasOnlyBullets) {
    return (
      <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
        {lines.map((line) => {
          const itemText = line.trim().slice(2);

          return (
            <Box component="li" key={line} sx={{ mb: 0.25 }}>
              <Typography variant="body2" component="span">
                {renderInlineContent(itemText)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
      {renderInlineContent(text)}
    </Typography>
  );
};

function ProfileChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([initialMessage]);
  const theme = useTheme();

  const suggestions = useMemo(() => getChatSuggestions(), []);

  const submitQuestion = (rawQuestion) => {
    const question = rawQuestion.trim();
    if (!question) return;

    const response = answerProfileQuestion(question);

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `${Date.now()}-user`,
        role: "user",
        text: question,
      },
      {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: response.answer,
        citations: response.citations,
        confidence: response.confidence,
      },
    ]);
    setInputValue("");
    setIsOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitQuestion(inputValue);
  };

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
          <Box
            sx={{
              px: 2,
              py: 1.5,
              color: "common.white",
              background:
                "linear-gradient(135deg, #1e293b 0%, #0f766e 62%, #2dd4bf 100%)",
            }}
          >
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Profile Assistant
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.84 }}>
                  Retrieval-first answers from portfolio data only
                </Typography>
              </Box>
              <Chip
                label="Profile only"
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "inherit" }}
              />
            </Stack>
          </Box>

          <Stack
            spacing={1.25}
            sx={{ px: 1.5, py: 1.5, overflowY: "auto", bgcolor: "#f8fbfd" }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  alignSelf: message.role === "user" ? "flex-end" : "stretch",
                  maxWidth: message.role === "user" ? "85%" : "100%",
                  ml: message.role === "user" ? "auto" : 0,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    px: 1.5,
                    py: 1.15,
                    borderRadius: 2.5,
                    color:
                      message.role === "user" ? "common.white" : "text.primary",
                    bgcolor:
                      message.role === "user"
                        ? theme.palette.primary.main
                        : theme.palette.background.paper,
                    border:
                      message.role === "user"
                        ? "none"
                        : `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                  }}
                >
                  {renderMessageText(message.text)}
                  {message.citations?.length ? (
                    <Stack
                      direction="row"
                      spacing={0.75}
                      useFlexGap
                      flexWrap="wrap"
                      sx={{ mt: 1 }}
                    >
                      {message.citations.map((citation) => (
                        <Chip
                          key={`${message.id}-${citation.id}`}
                          label={`${citation.section}: ${citation.title}`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  ) : null}
                </Paper>
              </Box>
            ))}

            <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
              {suggestions.map((suggestion) => (
                <Chip
                  key={suggestion}
                  label={suggestion}
                  onClick={() => submitQuestion(suggestion)}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Stack>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 1.25,
              borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                fullWidth
                size="small"
                placeholder="Ask about profile, skills, ownership, resume or contact"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
              />
              <IconButton
                color="primary"
                type="submit"
                aria-label="Send question"
              >
                <SendRoundedIcon />
              </IconButton>
            </Stack>
          </Box>
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
