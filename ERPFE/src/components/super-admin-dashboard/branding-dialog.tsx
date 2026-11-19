"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Dialog } from "radix-ui";
import Image from "next/image";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTenantBranding, uploadTenantBrandingImage } from "@/lib/api/tenants";
import { toApiError } from "@/lib/api/errors";
import { rootDomain } from "@/lib/tenant-slug";
import type { ApiEnvelope, BrandingInput, PublicTenantConfig } from "@/lib/api/types";
import type { School } from "./types";

type BrandingValues = {
  displayName: string;
  shortName: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  language: string;
};

export async function readBranding(school: School, signal?: AbortSignal): Promise<BrandingValues> {
  const host = school.customDomain || `${school.slug}.${rootDomain()}`;
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}/public/tenants/resolve?host=${encodeURIComponent(host)}`, { cache: "no-store", credentials: "omit", signal });
  if (!response.ok) throw new Error("Could not load current branding. Check that the school is active and the backend and domain settings are correct.");
  const envelope = await response.json() as ApiEnvelope<PublicTenantConfig>;
  const config = envelope?.data;
  const fields = ["name", "shortName", "description", "logoUrl", "faviconUrl", "language", "theme"];
  if (!config || config.slug !== school.slug || config.status !== "active" || fields.some((field) => !Object.prototype.hasOwnProperty.call(config, field)) || !config.theme?.primary || !config.theme?.secondary || typeof config.name !== "string" || typeof config.language !== "string") {
    throw new Error("The backend did not return complete current branding. No changes were made.");
  }
  return {
    displayName: config.name,
    shortName: config.shortName ?? "",
    description: config.description ?? "",
    logoUrl: config.logoUrl ?? "",
    faviconUrl: config.faviconUrl ?? "",
    primaryColor: config.theme.primary,
    secondaryColor: config.theme.secondary,
    language: config.language,
  };
}

function isHttpsUrl(value: string) {
  if (!value) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

type ImageSelection = { file: File | null; error: string };

function ImagePicker({ id, title, currentUrl, selection, onSelect, disabled }: { id: string; title: string; currentUrl: string; selection: ImageSelection; onSelect: (selection: ImageSelection) => void; disabled: boolean }) {
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [failedUrl, setFailedUrl] = useState("");
  useEffect(() => {
    if (!selection.file) return;
    const file = selection.file;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") setPreview({ file, url: reader.result }); };
    reader.readAsDataURL(file);
    return () => { if (reader.readyState === FileReader.LOADING) reader.abort(); };
  }, [selection.file]);

  function selectFile(file?: File) {
    if (!file) return;
    if (!/\.(png|jpe?g)$/i.test(file.name) || !["image/png", "image/jpeg"].includes(file.type)) return onSelect({ file: null, error: "Choose a PNG or JPG image." });
    if (file.size >= 5 * 1024 * 1024) return onSelect({ file: null, error: "The image must be smaller than 5 MB." });
    onSelect({ file, error: "" });
  }

  const previewUrl = selection.file ? (preview?.file === selection.file ? preview.url : "") : currentUrl;
  const imageUrl = previewUrl && previewUrl !== failedUrl ? previewUrl : "";
  return <div><Label htmlFor={id}>{title}</Label><div className={`relative mt-2 rounded-xl border border-dashed px-4 py-5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${dragging ? "border-primary bg-secondary/60" : "border-input bg-muted/30"} ${disabled ? "opacity-50" : "hover:border-primary/60 hover:bg-muted/60"}`} onDragOver={(event) => { event.preventDefault(); if (!disabled) setDragging(true); }} onDragLeave={(event) => { event.preventDefault(); setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); if (disabled) return; if (event.dataTransfer.files.length > 1) { onSelect({ file: null, error: "Choose one image at a time." }); return; } selectFile(event.dataTransfer.files[0]); }}><label htmlFor={id} className={`flex flex-col items-center text-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}><span className="grid size-14 place-items-center overflow-hidden rounded-xl bg-secondary text-secondary-foreground">{imageUrl ? <Image src={imageUrl} alt="" width={56} height={56} unoptimized className="size-full object-contain p-1" onError={() => setFailedUrl(imageUrl)} /> : <ImagePlus className="size-5" />}</span><span className="mt-2 max-w-full break-all text-xs font-semibold text-foreground">{selection.file ? selection.file.name : "Drag and drop an image, or browse"}</span><span className="mt-1 text-[11px] text-muted-foreground">PNG or JPG, less than 5 MB</span></label><input id={id} type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" className="sr-only" disabled={disabled} aria-describedby={`${id}-help${selection.error ? ` ${id}-error` : ""}`} onChange={(event) => { selectFile(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} /><div id={`${id}-help`} className="mt-2 text-center text-[11px] text-muted-foreground">{selection.file ? "New image selected. Publish to save." : currentUrl ? (failedUrl === currentUrl ? "Saved image could not be loaded." : "Saved image") : "No saved image."}</div></div>{selection.error && <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-destructive">{selection.error}</p>}{(selection.file || selection.error) && <Button type="button" variant="ghost" size="sm" disabled={disabled} className="mt-2" onClick={() => onSelect({ file: null, error: "" })}>Remove selection</Button>}</div>;
}

function BrandingForm({ school, initial, onClose, onPendingChange, onPublished }: { school: School; initial: BrandingValues; onClose: () => void; onPendingChange: (pending: boolean) => void; onPublished?: () => void }) {
  const [values, setValues] = useState(initial);
  const [logo, setLogo] = useState<ImageSelection>({ file: null, error: "" });
  const [favicon, setFavicon] = useState<ImageSelection>({ file: null, error: "" });
  const [error, setError] = useState("");
  const [needsReload, setNeedsReload] = useState(false);
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const uploads = useRef(new Map<File, string>());

  function change(field: keyof BrandingValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || needsReload || logo.error || favicon.error) return;
    const clean = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()])) as BrandingValues;
    if (clean.displayName.length < 2 || clean.displayName.length > 100) return setError("Display name must be 2–100 characters.");
    if (!isHttpsUrl(clean.logoUrl) || !isHttpsUrl(clean.faviconUrl)) return setError("Logo and favicon links must use HTTPS.");
    if (!/^#[0-9a-f]{6}$/i.test(clean.primaryColor) || !/^#[0-9a-f]{6}$/i.test(clean.secondaryColor)) return setError("Enter six-digit hex colours, such as #165c95.");
    if (!/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})?$/.test(clean.language)) return setError("Enter a valid language code, such as en or ne.");
    inFlight.current = true;
    setPending(true);
    onPendingChange(true);
    setError("");
    let publishing = false;
    try {
      const latest = await readBranding(school);
      if (JSON.stringify(latest) !== JSON.stringify(initial)) {
        setNeedsReload(true);
        setError("Branding changed since you opened this form. Close and reopen it to review the latest values before saving.");
        return;
      }
      async function imageUrl(file: File | null, currentUrl: string) {
        if (!file) return currentUrl || null;
        let url = uploads.current.get(file);
        if (!url) {
          url = (await uploadTenantBrandingImage(school.id, file)).url;
          if (!url || !isHttpsUrl(url)) throw new Error("Image upload returned an invalid URL.");
          uploads.current.set(file, url);
        }
        return url;
      }
      const logoUrl = await imageUrl(logo.file, clean.logoUrl);
      const faviconUrl = await imageUrl(favicon.file, clean.faviconUrl);
      if ((logo.file || favicon.file) && JSON.stringify(await readBranding(school)) !== JSON.stringify(initial)) {
        setNeedsReload(true);
        setError("Branding changed since you opened this form. Close and reopen it to review the latest values before saving.");
        return;
      }
      const input: BrandingInput = {
        displayName: clean.displayName,
        shortName: clean.shortName || null,
        description: clean.description || null,
        logoUrl,
        faviconUrl,
        primaryColor: clean.primaryColor,
        secondaryColor: clean.secondaryColor,
        language: clean.language,
      };
      publishing = true;
      await updateTenantBranding(school.id, input);
      onPublished?.();
      toast.success("School branding published.");
      onClose();
    } catch (cause) {
      const apiError = toApiError(cause);
      if (publishing && (apiError.isNetworkError || apiError.status >= 500)) {
        setNeedsReload(true);
        setError("The update could not be confirmed. Close and reopen branding to check the current values before trying again.");
      } else {
        setError(apiError.details.length ? apiError.details.join(" ") : apiError.message);
      }
    } finally {
      inFlight.current = false;
      setPending(false);
      onPendingChange(false);
    }
  }

  const fieldClass = "mt-2 h-10";
  return <form onSubmit={submit} className="mt-5 space-y-4"><p className="rounded-lg border border-border bg-muted px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">Publishing replaces all branding fields below. Review them before saving; empty optional fields will be cleared.</p><div><Label htmlFor="branding-name">Display name *</Label><Input id="branding-name" className={fieldClass} value={values.displayName} onChange={(event) => change("displayName", event.target.value)} required minLength={2} maxLength={100} disabled={pending} /></div><div><Label htmlFor="branding-short-name">Short name</Label><Input id="branding-short-name" className={fieldClass} value={values.shortName} onChange={(event) => change("shortName", event.target.value)} maxLength={30} disabled={pending} /></div><div><Label htmlFor="branding-description">Description</Label><textarea id="branding-description" className="mt-2 min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" value={values.description} onChange={(event) => change("description", event.target.value)} maxLength={300} disabled={pending} /></div><ImagePicker id="branding-logo" title="School logo" currentUrl={values.logoUrl} selection={logo} onSelect={setLogo} disabled={pending} /><ImagePicker id="branding-favicon" title="Favicon" currentUrl={values.faviconUrl} selection={favicon} onSelect={setFavicon} disabled={pending} /><div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="branding-primary">Primary colour *</Label><Input id="branding-primary" className={fieldClass} value={values.primaryColor} onChange={(event) => change("primaryColor", event.target.value)} maxLength={7} required disabled={pending} /></div><div><Label htmlFor="branding-secondary">Secondary colour *</Label><Input id="branding-secondary" className={fieldClass} value={values.secondaryColor} onChange={(event) => change("secondaryColor", event.target.value)} maxLength={7} required disabled={pending} /></div></div><div><Label htmlFor="branding-language">Language code *</Label><Input id="branding-language" className={fieldClass} value={values.language} onChange={(event) => change("language", event.target.value)} maxLength={12} required disabled={pending} /></div>{error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-relaxed text-destructive">{error}</p>}<div className="flex justify-end gap-2 border-t border-border pt-4"><Button type="button" variant="outline" disabled={pending} onClick={onClose}>Cancel</Button><Button type="submit" disabled={pending || needsReload || Boolean(logo.error || favicon.error)}>{pending && <LoaderCircle className="animate-spin" />}{pending ? "Publishing…" : "Publish branding"}</Button></div></form>;
}

function BrandingContent({ school, onClose, onPendingChange, onPublished }: { school: School; onClose: () => void; onPendingChange: (pending: boolean) => void; onPublished?: () => void }) {
  const [initial, setInitial] = useState<BrandingValues | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    readBranding(school, controller.signal).then(setInitial).catch((cause) => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not load branding."); });
    return () => controller.abort();
  }, [school, attempt]);
  if (error) return <div className="mt-5 space-y-4"><p role="alert" className="text-sm text-destructive">{error}</p><div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Close</Button><Button onClick={() => { setError(""); setAttempt((current) => current + 1); }}>Try again</Button></div></div>;
  if (!initial) return <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground" role="status"><LoaderCircle className="size-4 animate-spin" /> Loading current branding…</div>;
  return <BrandingForm school={school} initial={initial} onClose={onClose} onPendingChange={onPendingChange} onPublished={onPublished} />;
}

export function BrandingDialog({ school, open, onOpenChange, onPublished }: { school: School; open: boolean; onOpenChange: (open: boolean) => void; onPublished?: () => void }) {
  const [pending, setPending] = useState(false);
  return <Dialog.Root open={open} onOpenChange={(value) => { if (!pending) onOpenChange(value); }}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40" /><Dialog.Content onEscapeKeyDown={(event) => { if (pending) event.preventDefault(); }} onInteractOutside={(event) => { if (pending) event.preventDefault(); }} className="fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-border bg-popover p-5 text-popover-foreground shadow-xl outline-none sm:p-6"><div className="flex items-start justify-between gap-4"><div><Dialog.Title className="text-lg font-semibold tracking-tight">School branding</Dialog.Title><Dialog.Description className="mt-1 text-xs text-muted-foreground">Update the public branding for {school.name}.</Dialog.Description></div><Dialog.Close asChild><Button type="button" variant="ghost" size="icon-sm" disabled={pending} aria-label="Close dialog"><X /></Button></Dialog.Close></div>{open && <BrandingContent school={school} onClose={() => onOpenChange(false)} onPendingChange={setPending} onPublished={onPublished} />}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}
