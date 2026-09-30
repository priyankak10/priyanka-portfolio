import { useMemo, useState } from "react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  Box,
  Chip,
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
import { useAssistantChat } from "./chatState";

const singleLineChipSx = {
  flex: "0 0 auto",
  "& .MuiChip-label": {
    whiteSpace: "nowrap",
  },
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
          sx={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
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
              <Typography
                variant="body2"
                component="span"
                sx={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
              >
                {renderInlineContent(itemText)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Typography
      variant="body2"
      sx={{
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
      }}
    >
      {renderInlineContent(text)}
    </Typography>
  );
};

function ProfileChatPanel({
  showHeader = true,
  title = "Profile Assistant",
  subtitle = "Retrieval-first answers from portfolio data only",
  bodyMaxHeight = 320,
  promptPlaceholder = "Ask about profile, skills, ownership, fit, resume or contact",
}) {
  const [inputValue, setInputValue] = useState("");
  const { messages, setMessages, nextMessageIdRef } = useAssistantChat();
  const theme = useTheme();
  const suggestions = useMemo(() => getChatSuggestions(), []);

  const submitQuestion = async (rawQuestion) => {
    const question = rawQuestion.trim();
    if (!question) return;

    const messageIdBase = nextMessageIdRef.current;
    nextMessageIdRef.current += 1;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `user-${messageIdBase}`,
        role: "user",
        text: question,
      },
    ]);
    setInputValue("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `assistant-${messageIdBase}`,
          role: "assistant",
          text: data.answer,
          citations: data.citations ?? [],
          confidence: data.confidence ?? 0.8,
        },
      ]);
    } catch (error) {
      const fallback = answerProfileQuestion(question);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `assistant-${messageIdBase}`,
          role: "assistant",
          text: fallback.answer,
          citations: fallback.citations,
          confidence: fallback.confidence,
        },
      ]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitQuestion(inputValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        width: "100%",
      }}
    >
      {showHeader ? (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            color: "common.white",
            background:
              "linear-gradient(135deg, #1e293b 0%, #0f766e 62%, #2dd4bf 100%)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={1}
            useFlexGap
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.84,
                  display: "block",
                  overflowWrap: "anywhere",
                }}
              >
                {subtitle}
              </Typography>
            </Box>
            <Chip
              label="Profile only"
              size="small"
              sx={{
                alignSelf: { xs: "flex-start", sm: "center" },
                bgcolor: "rgba(255,255,255,0.16)",
                color: "inherit",
                ...singleLineChipSx,
              }}
            />
          </Stack>
        </Box>
      ) : null}

      <Stack
        spacing={1.25}
        sx={{
          px: 1.5,
          py: 1.5,
          overflowY: "auto",
          maxHeight: bodyMaxHeight,
          bgcolor: "#f8fbfd",
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              alignSelf: message.role === "user" ? "flex-end" : "stretch",
              maxWidth: message.role === "user" ? "85%" : "100%",
              ml: message.role === "user" ? "auto" : 0,
              minWidth: 0,
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
                minWidth: 0,
              }}
            >
              {renderMessageText(message.text)}
              {message.citations?.length ? (
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.75,
                    alignItems: "flex-start",
                  }}
                >
                  {message.citations.map((citation) => (
                    <Chip
                      key={`${message.id}-${citation.id}`}
                      label={`${citation.section}: ${citation.title}`}
                      size="small"
                      variant="outlined"
                      sx={singleLineChipSx}
                    />
                  ))}
                </Box>
              ) : null}
            </Paper>
          </Box>
        ))}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.75,
            alignItems: "flex-start",
          }}
        >
          {suggestions.map((suggestion) => (
            <Chip
              key={suggestion}
              label={suggestion}
              onClick={() => submitQuestion(suggestion)}
              size="small"
              variant="outlined"
              sx={singleLineChipSx}
            />
          ))}
        </Box>
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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", sm: "flex-end" }}
          sx={{ minWidth: 0 }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder={promptPlaceholder}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <IconButton
            color="primary"
            type="submit"
            aria-label="Send question"
            sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
          >
            <SendRoundedIcon />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}

export default ProfileChatPanel;
