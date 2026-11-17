"use client";

import { useState, type FormEvent } from "react";
import { Dialog } from "radix-ui";
import { LoaderCircle, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTenant } from "@/lib/api/tenants";
import { toApiError } from "@/lib/api/errors";
import { schoolsQueryKey } from "./hooks/use-schools";

const reservedSlugs = new Set(["www", "api", "admin", "app", "platform", "static", "assets", "cdn", "mail", "smtp", "support", "status", "docs", "help", "login", "auth"]);

function slugify(value: string) {
  return value.trimStart().split(/\s+/, 1)[0].toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").slice(0, 30).replace(/^-+|-+$/g, "");
}

function SchoolForm({ onClose, onPendingChange }: { onClose: () => void; onPendingChange: (pending: boolean) => void }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [principalEmail, setPrincipalEmail] = useState("");
  const [principalPassword, setPrincipalPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const schoolName = name.trim();
    const schoolSlug = slug.trim();
    if (schoolName.length < 2 || schoolName.length > 100) return setError("School name must be 2–100 characters.");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(schoolSlug) || schoolSlug.length < 3 || schoolSlug.length > 30 || reservedSlugs.has(schoolSlug)) return setError("Use 3–30 lowercase letters, numbers or single hyphens. Reserved names are not allowed.");
    if (principalPassword.length < 12 || principalPassword.length > 128) return setError("Principal password must be 12–128 characters.");
    setError("");
    setPending(true);
    onPendingChange(true);
    try {
      await createTenant({ name: schoolName, slug: schoolSlug, principalEmail: principalEmail.trim(), principalPassword });
      setPrincipalPassword("");
      await queryClient.invalidateQueries({ queryKey: schoolsQueryKey });
      toast.success("School created successfully.");
      onClose();
    } catch (cause) {
      const apiError = toApiError(cause);
      if (apiError.isNetworkError || apiError.status >= 500) {
        setError("Creation could not be confirmed. Check the school list and backend logs before retrying; the school may already exist or provisioning may have failed.");
      } else {
        setError(apiError.details.length ? apiError.details.join(" ") : apiError.message);
      }
      void queryClient.invalidateQueries({ queryKey: schoolsQueryKey });
    } finally {
      setPending(false);
      onPendingChange(false);
    }
  }

  return <form onSubmit={submit} className="mt-5 space-y-4"><div className="rounded-lg border border-border bg-muted px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">This creates a real school and its principal account. The principal must change the password on first login.</div><div><Label htmlFor="school-name">School name *</Label><Input id="school-name" className="mt-2 h-10" value={name} maxLength={100} required disabled={pending} onChange={(event) => { setName(event.target.value); if (!slugEdited) setSlug(slugify(event.target.value)); setError(""); }} placeholder="School name" /></div><div><Label htmlFor="school-slug">School slug *</Label><Input id="school-slug" className="mt-2 h-10" value={slug} maxLength={30} required disabled={pending} autoCapitalize="none" spellCheck={false} onChange={(event) => { setSlugEdited(true); setSlug(event.target.value.toLowerCase()); setError(""); }} placeholder="school-name" /><p className="mt-1.5 text-[11px] text-muted-foreground">Lowercase letters, numbers and single hyphens; used for the school subdomain.</p></div><div><Label htmlFor="principal-email">Principal email *</Label><Input id="principal-email" className="mt-2 h-10" type="email" autoComplete="off" required maxLength={254} disabled={pending} value={principalEmail} onChange={(event) => setPrincipalEmail(event.target.value)} placeholder="principal@school.edu" /></div><div><Label htmlFor="principal-password">Initial principal password *</Label><Input id="principal-password" className="mt-2 h-10" type="password" autoComplete="new-password" required minLength={12} maxLength={128} disabled={pending} value={principalPassword} onChange={(event) => setPrincipalPassword(event.target.value)} /><p className="mt-1.5 text-[11px] text-muted-foreground">12–128 characters. Share it securely with the principal.</p></div>{error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-relaxed text-destructive">{error}</p>}<div className="flex items-center justify-end gap-2 border-t border-border pt-4"><Button type="button" variant="outline" disabled={pending} onClick={onClose}>Cancel</Button><Button type="submit" disabled={pending}>{pending && <LoaderCircle className="animate-spin" />}{pending ? "Creating school…" : "Create school"}</Button></div></form>;
}

export function AddSchoolDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [pending, setPending] = useState(false);
  return <Dialog.Root open={open} onOpenChange={(value) => { if (!pending) onOpenChange(value); }}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40" /><Dialog.Content onEscapeKeyDown={(event) => { if (pending) event.preventDefault(); }} onInteractOutside={(event) => { if (pending) event.preventDefault(); }} className="fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-popover p-5 text-popover-foreground shadow-xl outline-none sm:p-6"><div className="flex items-start justify-between gap-4"><div><Dialog.Title className="text-lg font-semibold tracking-tight">Add a school</Dialog.Title><Dialog.Description className="mt-1 text-xs text-muted-foreground">Create a school and its first principal account.</Dialog.Description></div><Dialog.Close asChild><Button type="button" variant="ghost" size="icon-sm" disabled={pending} aria-label="Close dialog"><X /></Button></Dialog.Close></div>{open && <SchoolForm onClose={() => onOpenChange(false)} onPendingChange={setPending} />}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}
