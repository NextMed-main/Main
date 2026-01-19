"use client";

import {
  AlertCircle,
  Bot,
  Check,
  Copy,
  Database,
  Loader2,
  RefreshCcw,
  Search,
  Send,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ChatMessage, useOpenAIChat } from "@/hooks/use-openai-chat";

/**
 * Suggested queries for researchers - EHR focused
 */
const SUGGESTED_QUERIES = [
  "What is the prevalence of hypertension by age group?",
  "Compare chronic conditions between Japan and UK patients",
  "Which medications are most commonly prescribed for diabetes?",
  "Show me the distribution of patients by region",
  "What are the top 10 diagnoses from patient visits?",
  "Analyze the age and gender demographics of the dataset",
];

/**
 * Message component for rendering individual chat messages
 */
function ChatMessageItem({
  message,
  onCopy,
}: {
  message: ChatMessage;
  onCopy: (content: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} group`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-blue-600 text-white"
            : message.error
              ? "bg-red-100 text-red-600"
              : "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : message.isStreaming ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : message.error ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Message content */}
      <div
        className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-blue-600 text-white rounded-tr-md"
              : message.error
                ? "bg-red-50 text-red-900 border border-red-200 rounded-tl-md"
                : "bg-slate-100 text-slate-900 rounded-tl-md"
          }`}
        >
          {message.isStreaming && !message.content ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">Analyzing EHR data</span>
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce" />
              </span>
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          )}
        </div>

        {/* Message actions */}
        {!isUser && message.content && !message.isStreaming && (
          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? "Copied!" : "Copy response"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

/**
 * AI Chat Panel Component for Researchers
 *
 * This component provides a chat interface for researchers to query
 * EHR data using natural language powered by OpenAI GPT-4o.
 */
export function AiChatPanel() {
  const {
    messages,
    isLoading,
    error,
    tokensUsed,
    sendMessage,
    clearChat,
    retryLastMessage,
  } = useOpenAIChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  // biome-ignore lint/correctness/useExhaustiveDependencies: messages dependency is intentionally needed for scroll behavior
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim() || isLoading) return;

      const query = input;
      setInput("");
      await sendMessage(query);
    },
    [input, isLoading, sendMessage],
  );

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  // Handle suggested query click
  const handleSuggestedQuery = useCallback(
    async (query: string) => {
      if (isLoading) return;
      setInput("");
      await sendMessage(query);
    },
    [isLoading, sendMessage],
  );

  // Copy to clipboard
  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  return (
    <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header - Always visible */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              EHR Research Assistant
            </h3>
            <p className="text-xs text-slate-500">
              Powered by OpenAI GPT-4o • 300,000 Patient Records
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tokensUsed > 0 && (
            <Badge variant="outline" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              {tokensUsed.toLocaleString()} tokens
            </Badge>
          )}
          {messages.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 min-h-[300px] max-h-[400px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
              <Bot className="h-7 w-7 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-lg text-slate-900 mb-2">
              Ask About EHR Data
            </h4>
            <p className="text-sm text-slate-500 max-w-md mb-5">
              I can help you analyze 300,000 patient records including
              demographics, chronic conditions, medications, and more.
            </p>

            {/* Suggested Queries */}
            <div className="w-full max-w-lg">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
                Suggested Queries
              </p>
              <div className="grid gap-2">
                {SUGGESTED_QUERIES.slice(0, 4).map((query) => (
                  <button
                    key={query}
                    type="button"
                    onClick={() => handleSuggestedQuery(query)}
                    disabled={isLoading}
                    className="text-left px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-300 transition-all text-sm text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="h-3 w-3 inline mr-2 text-emerald-500" />
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessageItem
                key={message.id}
                message={message}
                onCopy={handleCopy}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex-shrink-0 px-4 py-2 bg-red-50 border-t border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="truncate">{error}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={retryLastMessage}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700 hover:bg-red-100 flex-shrink-0"
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {/* Input Area - Always visible at bottom */}
      <div className="flex-shrink-0 border-t border-slate-200 p-4 bg-slate-50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about conditions, medications, demographics..."
              className="pl-10 pr-4 h-11 bg-white"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={!input.trim() || isLoading}
            className="h-11 px-5"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Press Enter to send your query
        </p>
      </div>
    </div>
  );
}

export default AiChatPanel;
