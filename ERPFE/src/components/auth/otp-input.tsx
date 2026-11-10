"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "cn";

type Status = "idle" | "verifying" | "error" | "success";

type OtpInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  onComplete?: (code: string) => void;
  status?: Status;
  disabled?: boolean;
  autoFocus?: boolean;
};

const OTP_LENGTH = 6;

export function OtpInput({
  value,
  onChange,
  onComplete,
  status = "idle",
  disabled = false,
  autoFocus = true,
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const locked = disabled || status === "verifying" || status === "success";

  function commit(next: string[]) {
    onChange(next);
    const joined = next.join("");
    if (joined.length === OTP_LENGTH && !joined.includes("") && onComplete) {
      onComplete(joined);
    }
  }

  function handleChange(index: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    const next = [...value];

    if (!digits) {
      next[index] = "";
      onChange(next);
      return;
    }

    let cursor = index;
    for (const digit of digits.split("")) {
      if (cursor >= OTP_LENGTH) break;
      next[cursor] = digit;
      cursor += 1;
    }

    if (cursor < OTP_LENGTH) refs.current[cursor]?.focus();
    commit(next);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...value];
      if (next[index]) {
        next[index] = "";
        onChange(next);
        return;
      }
      if (index > 0) {
        next[index - 1] = "";
        onChange(next);
        refs.current[index - 1]?.focus();
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      refs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      refs.current[index + 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    event.preventDefault();

    const next = Array.from({ length: OTP_LENGTH }, (_, i) => text[i] ?? "");
    refs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
    commit(next);
  }

  return (
    <motion.div
      className="flex gap-2"
      role="group"
      aria-label="One-time passcode"
      animate={status === "error" ? { x: [0, -9, 9, -6, 6, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.currentTarget.select()}
          autoFocus={autoFocus && index === 0}
          disabled={locked}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={OTP_LENGTH}
          placeholder=" "
          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
          className={cn(
            "h-12 min-w-0 flex-1 rounded-xl border text-center font-mono text-[19px] font-semibold outline-none transition-all sm:h-13",
            "border-input bg-transparent text-foreground caret-primary placeholder:text-transparent",
            "hover:border-ring/40 focus:-translate-y-px focus:border-ring focus:ring-3 focus:ring-ring/25",
            "dark:bg-input/20",
            digit && "border-primary/40 bg-primary/5",
            status === "error" && "border-destructive bg-destructive/5",
            status === "success" && "border-teal/60 bg-teal/10 text-teal",
            locked && status !== "success" && "opacity-60",
          )}
        />
      ))}
    </motion.div>
  );
}