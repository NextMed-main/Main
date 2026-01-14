"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Message interface for the chat history
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  error?: boolean;
}

/**
 * Hook state interface
 */
interface UseGeminiChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  tokensUsed: number;
}

/**
 * Hook return interface
 */
interface UseGeminiChatReturn extends UseGeminiChatState {
  sendMessage: (query: string) => Promise<void>;
  clearChat: () => void;
  clearError: () => void;
  retryLastMessage: () => Promise<void>;
}

/**
 * Generate a unique ID for messages
 */
const generateId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Custom hook for managing Gemini AI chat interactions
 *
 * This hook handles:
 * - Sending queries to the Gemini API endpoint
 * - Managing conversation history
 * - Loading states and error handling
 * - Token usage tracking
 *
 * @example
 * ```tsx
 * const { messages, isLoading, sendMessage, clearChat } = useGeminiChat();
 *
 * const handleSubmit = async (query: string) => {
 *   await sendMessage(query);
 * };
 * ```
 */
export function useGeminiChat(): UseGeminiChatReturn {
  const [state, setState] = useState<UseGeminiChatState>({
    messages: [],
    isLoading: false,
    error: null,
    tokensUsed: 0,
  });

  // Track the last user message for retry functionality
  const lastUserMessageRef = useRef<string | null>(null);

  /**
   * Send a message to the Gemini API
   */
  const sendMessage = useCallback(
    async (query: string): Promise<void> => {
      if (!query.trim()) {
        setState((prev) => ({
          ...prev,
          error: "Please enter a valid query",
        }));
        return;
      }

      // Store for retry
      lastUserMessageRef.current = query;

      // Create user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: query.trim(),
        timestamp: new Date(),
      };

      // Create placeholder for assistant response
      const assistantPlaceholder: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      // Update state with user message and placeholder
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage, assistantPlaceholder],
        isLoading: true,
        error: null,
      }));

      try {
        // Prepare conversation history for context (excluding the placeholder)
        const conversationHistory = state.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // Make API request
        const response = await fetch("/api/gemini", {
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

        // Update the placeholder message with actual response
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
        // Update placeholder to show error state
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

  /**
   * Clear all chat messages and reset state
   */
  const clearChat = useCallback((): void => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
      tokensUsed: 0,
    });
    lastUserMessageRef.current = null;
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  /**
   * Retry the last user message
   */
  const retryLastMessage = useCallback(async (): Promise<void> => {
    if (!lastUserMessageRef.current) {
      setState((prev) => ({
        ...prev,
        error: "No previous message to retry",
      }));
      return;
    }

    // Remove the last assistant message (error message) before retrying
    setState((prev) => {
      const messages = [...prev.messages];
      // Remove last two messages (user + failed assistant response)
      if (messages.length >= 2) {
        messages.splice(-2, 2);
      }
      return {
        ...prev,
        messages,
        error: null,
      };
    });

    // Retry with the last user message
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

export default useGeminiChat;
