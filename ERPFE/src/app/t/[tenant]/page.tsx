import { TenantNavbar } from "@/components/tenant-pr-page/Tenant-navbar";
import { Hero } from "@/components/tenant-pr-page/Hero";
import { SchoolPrograms } from "@/components/tenant-pr-page/School-programs";
import { CampusFacilities } from "@/components/tenant-pr-page/Campus-facilities";
import { KeyDates } from "@/components/tenant-pr-page/Key-dates";
import { AdmissionsInquiry } from "@/components/tenant-pr-page/Admissions-inquiry";
import { TenantFooter } from "@/components/tenant-pr-page/Tenant-footer";

export default function TenantHomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-foreground">
      <TenantNavbar />
      <main className="flex-1">
        <Hero />
        <SchoolPrograms />
        <CampusFacilities />
        <KeyDates />
        <AdmissionsInquiry />
      </main>
      <TenantFooter />
    </div>
  );
}
