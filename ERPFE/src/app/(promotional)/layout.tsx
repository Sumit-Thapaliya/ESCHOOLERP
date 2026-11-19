import { ChatWidget } from "@/components/promotional/chat-widget";
import { PromoNav } from "@/components/promotional/nav";
import { PromoStyles } from "@/components/promotional/styles";

export default function PromotionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <PromoStyles />
      <PromoNav />
      {children}
      <ChatWidget />
    </div>
  );
}
