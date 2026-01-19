"use client";

import { useCallback, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  error?: boolean;
}

interface UseOpenAIChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  tokensUsed: number;
}

interface UseOpenAIChatReturn extends UseOpenAIChatState {
  sendMessage: (query: string) => Promise<void>;
  clearChat: () => void;
  clearError: () => void;
  retryLastMessage: () => Promise<void>;
}

const generateId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export function useOpenAIChat(): UseOpenAIChatReturn {
  const [state, setState] = useState<UseOpenAIChatState>({
    messages: [],
    isLoading: false,
    error: null,
    tokensUsed: 0,
  });

  const lastUserMessageRef = useRef<string | null>(null);

  const sendMessage = useCallback(
    async (query: string): Promise<void> => {
      if (!query.trim()) {
        setState((prev) => ({
          ...prev,
          error: "Please enter a valid query",
        }));
        return;
      }

      lastUserMessageRef.current = query;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: query.trim(),
        timestamp: new Date(),
      };

      const assistantPlaceholder: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage, assistantPlaceholder],
        isLoading: true,
        error: null,
      }));

      try {
        const conversationHistory = state.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const response = await fetch("/api/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query.trim(),
            conversationHistory,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to get response from AI");
        }

        setState((prev) => ({
          ...prev,
          messages: prev.messages.map((msg) =>
            msg.id === assistantPlaceholder.id
              ? {
                  ...msg,
                  content: data.response,
                  isStreaming: false,
                }
              : msg,
          ),
          isLoading: false,
          tokensUsed: prev.tokensUsed + (data.tokensUsed || 0),
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.";

        setState((prev) => ({
          ...prev,
          messages: prev.messages.map((msg) =>
            msg.id === assistantPlaceholder.id
              ? {
                  ...msg,
                  content: `Sorry, I encountered an error: ${errorMessage}`,
                  isStreaming: false,
                  error: true,
                }
              : msg,
          ),
          isLoading: false,
          error: errorMessage,
        }));
      }
    },
    [state.messages],
  );

  const clearChat = useCallback((): void => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
      tokensUsed: 0,
    });
    lastUserMessageRef.current = null;
  }, []);

  const clearError = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  const retryLastMessage = useCallback(async (): Promise<void> => {
    if (!lastUserMessageRef.current) {
      setState((prev) => ({
        ...prev,
        error: "No previous message to retry",
      }));
      return;
    }

    setState((prev) => {
      const messages = [...prev.messages];
      if (messages.length >= 2) {
        messages.splice(-2, 2);
      }
      return {
        ...prev,
        messages,
        error: null,
      };
    });

    await sendMessage(lastUserMessageRef.current);
  }, [sendMessage]);

  return {
    ...state,
    sendMessage,
    clearChat,
    clearError,
    retryLastMessage,
  };
}

export default useOpenAIChat;
