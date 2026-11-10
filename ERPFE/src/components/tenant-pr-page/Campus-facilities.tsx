"use client";

import { useTenant } from "@/providers/tenant-provider";

export function CampusFacilities() {
  const { tenant } = useTenant();

  const facilities = [
    {
      title: "Science and technology labs",
      description: "Dedicated Physics, Chemistry, Biology, and computer workstations for practical coursework.",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
      alt: "Science laboratory with microscopes and student equipment",
      capacity: "4 specialized labs",
    },
    {
      title: "Central library and study commons",
      description: "Quiet reading rooms, reference archives, and research stations stocked for all age groups.",
      imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
      alt: "Spacious library with study desks and book stacks",
      capacity: "Over 12,000 volumes",
    },
    {
      title: "Athletics grounds and courts",
      description: "Full-size football ground, basketball court, and athletic tracks supporting sports programs.",
      imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
      alt: "Outdoor school sporting field and track",
      capacity: "Outdoor and indoor sports",
    },
    {
      title: "Art and music studios",
      description: "Light-filled spaces designed for painting, ceramics, music practice, and drama workshops.",
      imageUrl: "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=800&q=80",
      alt: "Art room with student painting easels and supplies",
      capacity: "Fine arts and music suites",
    },
  ];

  return (
    <section id="facilities" className="border-b border-border/60 bg-muted/20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground break-words sm:text-3xl">
            Campus facilities
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Safe, well-maintained spaces designed to support learning, fitness, and artistic exploration.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 [grid-template-columns:repeat(auto-fit,minmax(0,1fr))] sm:[grid-template-columns:repeat(2,minmax(0,1fr))]">
          {facilities.map((facility) => (
            <div
              key={facility.title}
              className="group overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs transition-colors hover:border-primary/40"
            >
              <div className="relative aspect-16/9 w-full overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={facility.imageUrl}
                  alt={facility.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                />
                <span className="absolute bottom-3 left-3 rounded-md bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-xs">
                  {facility.capacity}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {facility.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {facility.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
