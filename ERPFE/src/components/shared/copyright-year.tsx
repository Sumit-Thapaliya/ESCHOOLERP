"use cache";

export async function CopyrightYear() {
  return <>{new Date().getFullYear()}</>;
}