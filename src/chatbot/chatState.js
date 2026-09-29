import {
  createContext,
  createElement,
  useContext,
  useRef,
  useState,
} from "react";

export const initialAssistantMessage = {
  id: "welcome",
  role: "assistant",
  text: "Ask about Priyanka's experience, skills, ownership, strengths, recruiter fit, education, resume, awards, or contact details. Answers are restricted to the profile data in this portfolio.",
  citations: [],
};

const ChatContext = createContext({
  messages: [initialAssistantMessage],
  setMessages: () => undefined,
  nextMessageIdRef: { current: 1 },
});

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([initialAssistantMessage]);
  const nextMessageIdRef = useRef(1);

  return createElement(
    ChatContext.Provider,
    { value: { messages, setMessages, nextMessageIdRef } },
    children,
  );
};

export const useAssistantChat = () => useContext(ChatContext);
