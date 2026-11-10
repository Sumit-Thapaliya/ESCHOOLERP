import { ChatWidget } from "@/components/promotional/chat-widget";
import { PromoNav } from "@/components/promotional/nav";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { PromoStyles } from "@/components/promotional/styles";

export default function PromotionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <PromoStyles />
      <ScrollProgress />
      <PromoNav />
      {children}
      <ChatWidget />
    </div>
  );
}
