"use client";

import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger);

const inputClass =
  "w-full rounded-none border-b border-gray-300 bg-transparent px-0 py-3 text-base text-gray-900 outline-none transition-colors duration-200 placeholder:text-gray-400 focus:border-primary-700";

const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-gray-500";

const positionCategories = [
  "Teaching / Faculty",
  "Administrative",
  "Technical / Laboratory",
  "Student Support",
  "Placement / Training",
  "Library",
  "Finance / Accounts",
  "HR / Administration",
  "IT / Systems",
  "Other",
];

const departments = [
  "Computer Science & Engineering",
  "CSE – Artificial Intelligence & Machine Learning",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Information Technology",
  "Mathematics",
  "English / Humanities",
  "Other",
];

export default function CareerApplicationForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ".career-form-card",
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
            },
          );
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setSubmitStatus("idle");
    setErrorMessage("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setErrorMessage("Please upload your resume in PDF, DOC, or DOCX format.");

      return;
    }

    if (file.size > maxSize) {
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setErrorMessage("Resume file size must be 5 MB or less.");

      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitStatus("idle");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!selectedFile) {
      setSubmitStatus("error");
      setErrorMessage("Please upload your resume / CV before submitting.");
      return;
    }

    const declaration = formData.get("declaration");

    if (!declaration) {
      setSubmitStatus("error");
      setErrorMessage(
        "Please accept the declaration before submitting your application.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * The API endpoint should accept multipart/form-data.
       *
       * Expected endpoint:
       * POST /api/careers
       *
       * The FormData object contains all form fields including:
       * - resume
       * - personal information
       * - academic qualifications
       * - position details
       * - experience
       * - declaration
       */

      const response = await fetch("/api/careers", {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "We could not submit your application. Please try again.",
        );
      }

      setSubmitStatus("success");

      form.reset();
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      window.scrollTo({
        top: sectionRef.current?.offsetTop ?? 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Career application submission failed:", error);

      setSubmitStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="bg-gray-50 py-8 sm:py-12 lg:py-16">
      <Container>
        <div className="mx-auto max-w-5xl">
          {/* Unified Form Card */}
          <div className="career-form-card overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-100 bg-gray-50/70 px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                    Careers
                  </span>

                  <h2 className="mt-3 text-3xl font-extrabold uppercase leading-tight tracking-[-0.035em] text-primary-700 sm:text-4xl">
                    Application Form
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                    Complete the form below and submit your application with
                    your latest resume or CV.
                  </p>
                </div>

                <span className="hidden text-[5rem] font-black leading-none tracking-[-0.08em] text-primary-700/[0.04] sm:block lg:text-[7rem]">
                  01
                </span>
              </div>
            </div>

            {/* Actual Form */}
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
                {/* Personal Information */}
                <FormSection number="01" title="Personal Information">
                  <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                    <Field label="Full Name" required>
                      <input
                        type="text"
                        name="fullName"
                        required
                        className={inputClass}
                        placeholder="Enter your full name"
                      />
                    </Field>

                    <Field label="Mobile Number" required>
                      <input
                        type="tel"
                        name="mobileNumber"
                        required
                        className={inputClass}
                        placeholder="Enter mobile number"
                      />
                    </Field>

                    <Field label="Email Address" required>
                      <input
                        type="email"
                        name="emailAddress"
                        required
                        className={inputClass}
                        placeholder="Enter email address"
                      />
                    </Field>

                    <Field label="Gender">
                      <select
                        name="gender"
                        defaultValue=""
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="" disabled>
                          Select gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>

                    <Field label="Date of Birth">
                      <input
                        type="date"
                        name="dateOfBirth"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Address" fullWidth>
                      <textarea
                        name="address"
                        rows={3}
                        className={`${inputClass} resize-none`}
                        placeholder="Enter your address"
                      />
                    </Field>
                  </div>
                </FormSection>

                {/* Academic Qualifications */}
                <FormSection number="02" title="Academic Qualifications">
                  <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                    <Field label="Highest Qualification">
                      <select
                        name="highestQualification"
                        defaultValue=""
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="" disabled>
                          Select qualification
                        </option>
                        <option value="diploma">Diploma</option>
                        <option value="ug">Undergraduate Degree</option>
                        <option value="pg">Postgraduate Degree</option>
                        <option value="phd">Ph.D.</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>

                    <Field label="Degree / Specialisation">
                      <input
                        type="text"
                        name="degreeSpecialisation"
                        className={inputClass}
                        placeholder="Enter degree / specialisation"
                      />
                    </Field>

                    <Field label="University / Institution">
                      <input
                        type="text"
                        name="universityInstitution"
                        className={inputClass}
                        placeholder="Enter university / institution"
                      />
                    </Field>

                    <Field label="Year of Passing">
                      <input
                        type="text"
                        name="yearOfPassing"
                        className={inputClass}
                        placeholder="Enter year"
                      />
                    </Field>

                    <Field
                      label="Additional Qualifications / Certifications"
                      fullWidth
                    >
                      <textarea
                        name="additionalQualifications"
                        rows={3}
                        className={`${inputClass} resize-none`}
                        placeholder="Enter additional qualifications / certifications"
                      />
                    </Field>
                  </div>
                </FormSection>

                {/* Position */}
                <FormSection number="03" title="Position Applying For">
                  <div>
                    <p className="mb-5 text-sm leading-6 text-gray-500">
                      Select the category that best matches the position you are
                      applying for.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {positionCategories.map((category) => (
                        <label
                          key={category}
                          className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3.5 transition-colors hover:border-primary-700 hover:bg-white"
                        >
                          <input
                            type="radio"
                            name="positionCategory"
                            value={category}
                            required
                            className="h-4 w-4 accent-primary-700"
                          />

                          <span className="text-sm font-semibold leading-5 text-gray-700">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="mb-5 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                      Department Applying For
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {departments.map((department) => (
                        <label
                          key={department}
                          className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3.5 transition-colors hover:border-primary-700 hover:bg-white"
                        >
                          <input
                            type="radio"
                            name="department"
                            value={department}
                            required
                            className="h-4 w-4 accent-primary-700"
                          />

                          <span className="text-sm font-semibold leading-5 text-gray-700">
                            {department}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </FormSection>

                {/* Faculty */}
                <FormSection number="04" title="For Faculty Applicants">
                  <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                    <Field label="Ph.D. Status">
                      <select
                        name="phdStatus"
                        defaultValue=""
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="" disabled>
                          Select status
                        </option>
                        <option value="completed">Completed</option>
                        <option value="pursuing">Pursuing</option>
                        <option value="not-applicable">Not Applicable</option>
                      </select>
                    </Field>

                    <Field label="Area of Specialisation">
                      <input
                        type="text"
                        name="areaOfSpecialisation"
                        className={inputClass}
                        placeholder="Enter area of specialisation"
                      />
                    </Field>

                    <Field label="Relevant Certifications" fullWidth>
                      <textarea
                        name="relevantCertifications"
                        rows={3}
                        className={`${inputClass} resize-none`}
                        placeholder="Enter relevant certifications"
                      />
                    </Field>
                  </div>
                </FormSection>

                {/* Experience */}
                <FormSection number="05" title="Professional Experience">
                  <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                    <Field label="Total Experience (Years & Months)">
                      <input
                        type="text"
                        name="totalExperience"
                        className={inputClass}
                        placeholder="e.g. 5 years 6 months"
                      />
                    </Field>

                    <Field label="Teaching Experience (Years & Months)">
                      <input
                        type="text"
                        name="teachingExperience"
                        className={inputClass}
                        placeholder="e.g. 3 years 6 months"
                      />
                    </Field>

                    <Field label="Industry Experience (Years & Months)">
                      <input
                        type="text"
                        name="industryExperience"
                        className={inputClass}
                        placeholder="e.g. 2 years"
                      />
                    </Field>

                    <Field label="Current / Most Recent Organisation">
                      <input
                        type="text"
                        name="recentOrganisation"
                        className={inputClass}
                        placeholder="Enter organisation"
                      />
                    </Field>

                    <Field label="Current / Most Recent Designation">
                      <input
                        type="text"
                        name="recentDesignation"
                        className={inputClass}
                        placeholder="Enter designation"
                      />
                    </Field>

                    <Field label="Current / Last Drawn Salary (Optional)">
                      <input
                        type="text"
                        name="lastDrawnSalary"
                        className={inputClass}
                        placeholder="Enter salary"
                      />
                    </Field>

                    <Field label="Notice Period" fullWidth>
                      <input
                        type="text"
                        name="noticePeriod"
                        className={inputClass}
                        placeholder="Enter notice period"
                      />
                    </Field>
                  </div>
                </FormSection>

                {/* Resume */}
                <FormSection number="06" title="Upload Resume / CV">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      className="sr-only"
                      onChange={handleFileChange}
                    />

                    {!selectedFile ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="group flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition-all duration-300 hover:border-primary-700 hover:bg-primary-700/[0.02]"
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-bold text-primary-700 shadow-sm transition-colors group-hover:bg-primary-700 group-hover:text-white">
                          +
                        </span>

                        <span className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-primary-700">
                          Choose Resume / CV
                        </span>

                        <span className="mt-2 text-sm text-gray-400">
                          PDF, DOC or DOCX · Maximum 5 MB
                        </span>
                      </button>
                    ) : (
                      <div className="flex flex-col gap-4 rounded-xl border border-primary-200 bg-primary-700/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold text-white">
                            CV
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-gray-800">
                              {selectedFile.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {formatFileSize(selectedFile.size)} · Resume
                              attached
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                              ✓
                            </span>
                            Attached
                          </span>

                          <button
                            type="button"
                            onClick={removeFile}
                            className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500 transition-colors hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}

                    {errorMessage && !selectedFile && (
                      <p className="mt-3 text-sm font-medium text-red-600">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </FormSection>

                {/* Declaration */}
                <FormSection number="07" title="Declaration">
                  <label className="flex cursor-pointer gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                    <input
                      type="checkbox"
                      name="declaration"
                      required
                      className="mt-1 h-5 w-5 shrink-0 accent-primary-700"
                    />

                    <span className="text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                      I certify that the information provided by me in this
                      application is true and complete to the best of my
                      knowledge. I understand that any incorrect or misleading
                      information may result in disqualification from the
                      selection process or withdrawal of an offer of employment.
                    </span>
                  </label>
                </FormSection>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <div
                    role="status"
                    className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700"
                  >
                    Your application has been submitted successfully. Thank you
                    for applying.
                  </div>
                )}

                {submitStatus === "error" && errorMessage && selectedFile && (
                  <div
                    role="alert"
                    className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
                  >
                    {errorMessage}
                  </div>
                )}

                {/* Submit */}
                <div className="flex flex-col gap-5 border-t border-gray-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-sm leading-6 text-gray-500">
                    Please review your information before submitting your
                    application.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full bg-primary-700 px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------- */
/* Form Section                       */
/* ---------------------------------- */

function FormSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-gray-100 py-9 first:pt-0 last:border-b-0 sm:py-10">
      <div className="mb-7 flex items-start gap-4">
        <span className="pt-1 text-xs font-black tracking-[0.08em] text-accent-400">
          {number}
        </span>

        <div>
          <h2 className="text-xl font-extrabold uppercase leading-tight tracking-tight text-primary-700 sm:text-2xl">
            {title}
          </h2>

          <div className="mt-3 h-1 w-8 bg-accent-400" />
        </div>
      </div>

      {children}
    </section>
  );
}

/* ---------------------------------- */
/* Field                              */
/* ---------------------------------- */

function Field({
  label,
  children,
  required = false,
  fullWidth = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className={labelClass}>
        {label}

        {required && (
          <span className="ml-1 text-accent-400" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

/* ---------------------------------- */
/* File Size                           */
/* ---------------------------------- */

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
