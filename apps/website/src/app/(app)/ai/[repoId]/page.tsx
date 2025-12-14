"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Bot,
  CodeIcon,
  ExternalLinkIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { requestDevServer } from "@/actions/dev-server";
import type { ChatMessage } from "@/app/api/chat/route";
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { Spinner } from "@/components/ui/spinner";
import { Tool } from "@/components/ui/tool";

export default function Chat() {
  const params = useParams();
  const repoId = params.repoId as string;
  const [ephemeralUrl, setEphemeralUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [devCommandRunning, setDevCommandRunning] = useState(false);
  const [installCommandRunning, setInstallCommandRunning] = useState(false);
  const [codeServerUrl, setCodeServerUrl] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({
        repoId: repoId,
      }),
      credentials: () => "include",
    }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchDevServer = async () => {
      const result = await requestDevServer({ repoId });
      setEphemeralUrl(result.ephemeralUrl);
      setCurrentUrl(result.ephemeralUrl);
      setDevCommandRunning(result.devCommandRunning);
      setInstallCommandRunning(result.installCommandRunning);
      setCodeServerUrl(result.codeServerUrl);
    };

    fetchDevServer();

    intervalRef.current = setInterval(fetchDevServer, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [repoId]);

  const handleGoBack = () => {
    const iframe = document.querySelector("iframe") as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      iframe.contentWindow.history.back();
    }
  };

  const handleGoForward = () => {
    const iframe = document.querySelector("iframe") as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      iframe.contentWindow.history.forward();
    }
  };

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleUrlChange = (newUrl: string) => {
    setCurrentUrl(newUrl);
  };

  const handleOpenExternal = () => {
    if (currentUrl) {
      window.open(currentUrl, "_blank");
    }
  };

  const handleOpenCodeServer = () => {
    if (codeServerUrl) {
      window.open(codeServerUrl, "_blank");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    await sendMessage({
      text: input,
    });
    setInput("");
    setIsLoading(false);
  };

  const renderMessageContent = (message: ChatMessage) => {
    return (
      <div className="space-y-2">
        {message.parts.map((part, i) => {
          const toolPart = part as any;

          if (part.type === "text") {
            return (
              <MessageContent
                key={`text-${i}`}
                markdown
                className="prose-h2:mt-0! prose-h2:scroll-m-0! dark:prose-invert"
              >
                {part.text}
              </MessageContent>
            );
          }

          if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
            const toolName =
              part.type === "dynamic-tool"
                ? toolPart.toolName
                : part.type.replace("tool-", "");

            return (
              <Tool
                key={`tool-${i}`}
                toolPart={{
                  type: toolName,
                  state: toolPart.state,
                  input: toolPart.input,
                  output: toolPart.output,
                  toolCallId: toolPart.toolCallId,
                  errorText: toolPart.errorText,
                }}
                className="w-full"
              />
            );
          }

          return null;
        })}
      </div>
    );
  };

  return (
    <div className="flex h-screen gap-2">
      <div className="w-[35%] m-2 bg-card flex border rounded-md flex-col py-6 px-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0"
        >
          {messages.map((message) => (
            <Message key={message.id}>
              {message.role === "user" ? (
                <MessageAvatar
                  src={"https://avatar.vercel.sh/MrUprizing?size=60"}
                  alt="User"
                  fallback="U"
                />
              ) : (
                <div className="h-8 w-8 shrink-0 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="size-4 text-primary-foreground" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                {renderMessageContent(message)}
              </div>
            </Message>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="w-full mt-4 px-3 shrink-0"
        >
          <InputGroup>
            <InputGroupInput
              placeholder="Build"
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              disabled={isLoading}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="submit"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? <Spinner className="size-3" /> : "Send"}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>

      <div className="w-[65%] m-2 h-full overflow-hidden">
        <WebPreview
          defaultUrl={ephemeralUrl}
          onUrlChange={handleUrlChange}
          style={{ height: "100%" }}
        >
          <WebPreviewNavigation>
            <WebPreviewNavigationButton
              onClick={handleGoBack}
              tooltip="Go back"
            >
              <ArrowLeftIcon className="size-4" />
            </WebPreviewNavigationButton>
            <WebPreviewNavigationButton
              onClick={handleGoForward}
              tooltip="Go forward"
            >
              <ArrowRightIcon className="size-4" />
            </WebPreviewNavigationButton>
            <WebPreviewNavigationButton onClick={handleReload} tooltip="Reload">
              <RefreshCcwIcon className="size-4" />
            </WebPreviewNavigationButton>
            {/*<WebPreviewUrl />*/}
            <WebPreviewNavigationButton
              onClick={handleOpenExternal}
              tooltip="Open in new tab"
            >
              <ExternalLinkIcon className="size-4" />
            </WebPreviewNavigationButton>
            <WebPreviewNavigationButton
              onClick={handleOpenCodeServer}
              tooltip="Open VS Code"
              disabled={!codeServerUrl}
            >
              <CodeIcon className="size-4" />
            </WebPreviewNavigationButton>
          </WebPreviewNavigation>

          <WebPreviewBody key={reloadKey} src={currentUrl} />

          <WebPreviewConsole
            logs={[
              {
                level: "log" as const,
                message: `Dev command: ${devCommandRunning ? "running" : "stopped"}`,
                timestamp: new Date(),
              },
              {
                level: "log" as const,
                message: `Install: ${installCommandRunning ? "running" : "completed"}`,
                timestamp: new Date(),
              },
            ]}
          />
        </WebPreview>
      </div>
    </div>
  );
}
