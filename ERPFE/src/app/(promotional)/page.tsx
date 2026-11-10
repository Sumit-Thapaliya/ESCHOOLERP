import { Configurator } from "@/components/promotional/configurator";
import { Faq } from "@/components/promotional/faq";
import { Finale } from "@/components/promotional/finale";
import { PromoFooter } from "@/components/promotional/footer";
import { Hero } from "@/components/promotional/hero";
import { PaperBand } from "@/components/promotional/paper";
import { Quotes } from "@/components/promotional/quotes";
import { SystemGrid } from "@/components/promotional/grid";
import { TrustStrip } from "@/components/promotional/trust-strip";
import { Why } from "@/components/promotional/why";

export const metadata = {
  title: "Baudhika ERP — School & College Management Software",
  description:
    "Admissions, billing, payroll and records in one reconciled system. Live in 7 days. Built for schools and colleges in Nepal.",
};

export default function PromotionalPage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Why />
      <SystemGrid />
      <Configurator />
      <Quotes />
      <PaperBand />
      <Faq />
      <Finale />
      <PromoFooter />
    </>
  );
}
