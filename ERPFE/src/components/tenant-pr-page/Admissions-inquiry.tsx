"use client";

import { useState } from "react";
import { useTenant } from "@/providers/tenant-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Clock, FileCheck2, MapPin, Phone, Send, UserCheck } from "lucide-react";

export function AdmissionsInquiry() {
  const { tenant } = useTenant();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: "",
    phone: "",
    email: "",
    grade: "Primary School (Grades 1-5)",
    notes: "",
  });

  const steps = [
    {
      step: "01",
      icon: Send,
      title: "Submit an Inquiry",
      description: "Fill out the short form with your contact details and child's intended grade level.",
    },
    {
      step: "02",
      icon: UserCheck,
      title: "Campus Visit & Meeting",
      description: "Tour classrooms and learning facilities while discussing curriculum with academic coordinators.",
    },
    {
      step: "03",
      icon: FileCheck2,
      title: "Enrollment & Welcome",
      description: "Submit prior academic records, complete admission registration, and receive your welcome pack.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <section id="admissions" className="border-b border-border/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Step Guide & Office Info */}
          <div className="space-y-8 lg:col-span-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Admissions Process
              </span>
              <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                How to Enroll at {tenant.name}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                We make the admission journey straightforward for prospective parents and transfer students.
              </p>
            </div>

            {/* 3 Steps */}
            <div className="space-y-6">
              {steps.map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">Step {item.step}</span>
                      <h3 className="font-heading text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Office Contact Note */}
            <div className="rounded-xl border border-border/70 bg-muted/40 p-5 text-xs text-muted-foreground">
              <h4 className="font-semibold text-foreground">Admissions Office Hours</h4>
              <div className="mt-2.5 space-y-1.5">
                <p className="flex items-center gap-2">
                  <Clock className="size-3.5 text-primary shrink-0" />
                  <span>Monday – Friday: 8:00 AM – 3:30 PM</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="size-3.5 text-primary shrink-0" />
                  <span>Direct Desk: +977 (01) 400-0000</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  <span>Main Campus Administrative Block</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs sm:p-8">
              <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
                Send an Admissions Inquiry
              </h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Our admissions coordinator will respond to your queries and help arrange a campus tour.
              </p>

              {submitted ? (
                <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
                  <CheckCircle2 className="size-10 text-primary" />
                  <h4 className="mt-3 font-heading text-lg font-semibold text-foreground">
                    Inquiry Received
                  </h4>
                  <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    Thank you for contacting {tenant.name}. Our team will review your inquiry and reach out via phone or email within one school day.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-5"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        parentName: "",
                        phone: "",
                        email: "",
                        grade: "Primary School (Grades 1-5)",
                        notes: "",
                      });
                    }}
                  >
                    Submit another inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="parentName">Parent or Guardian Name *</Label>
                      <Input
                        id="parentName"
                        required
                        placeholder="e.g. Maya Sharma"
                        value={formData.parentName}
                        onChange={(e) =>
                          setFormData({ ...formData, parentName: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        required
                        type="tel"
                        placeholder="e.g. 9800000000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g. parent@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="grade">Grade Level of Interest</Label>
                      <select
                        id="grade"
                        className="h-8 w-full rounded-lg border border-input bg-background px-2.5 py-1 text-sm text-foreground transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        value={formData.grade}
                        onChange={(e) =>
                          setFormData({ ...formData, grade: e.target.value })
                        }
                      >
                        <option value="Early Childhood / Kindergarten">
                          Early Childhood / Kindergarten
                        </option>
                        <option value="Primary School (Grades 1-5)">
                          Primary School (Grades 1-5)
                        </option>
                        <option value="Middle School (Grades 6-8)">
                          Middle School (Grades 6-8)
                        </option>
                        <option value="Secondary School (Grades 9-10)">
                          Secondary School (Grades 9-10)
                        </option>
                        <option value="High School / College Prep (Grades 11-12)">
                          High School / College Prep (Grades 11-12)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes">Questions or Specific Interests</Label>
                    <textarea
                      id="notes"
                      rows={3}
                      className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      placeholder="Tell us about your child's interests or questions regarding admission timelines..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" size="default" className="w-full sm:w-auto gap-2">
                      <Send className="size-3.5" />
                      <span>Send Admissions Inquiry</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
