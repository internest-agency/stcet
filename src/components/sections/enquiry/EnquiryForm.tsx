"use client";

import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger);

const inputClass =
  "w-full border-b border-gray-300 bg-transparent px-0 py-3 text-base text-gray-900 outline-none transition-colors duration-200 placeholder:text-gray-400 focus:border-primary-700";

const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-gray-500";

const courses = [
  "B.E. CSE",
  "B.E. CSE (AI+ML)",
  "B.E. ECE",
  "B.E. EEE",
  "B.Tech. IT",
];

const enquirySources = [
  "Social Media",
  "Advertisements",
  "Friends & Relatives",
  "Others",
];

export default function EnquiryForm() {
  const sectionRef = useRef<HTMLElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState("");

  const [coursePreferences, setCoursePreferences] = useState<
    Record<string, string>
  >({});

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ".enquiry-form-card",
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
          );
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  /*
   * Prevent duplicate course rankings.
   *
   * Example:
   * CSE = 1
   * ECE = 1
   *
   * The second "1" will automatically be cleared.
   */
  const handleCoursePreferenceChange = (course: string, value: string) => {
    setCoursePreferences((previous) => {
      const updated = {
        ...previous,
        [course]: value,
      };

      if (value) {
        Object.keys(updated).forEach((key) => {
          if (key !== course && updated[key] === value) {
            updated[key] = "";
          }
        });
      }

      return updated;
    });
  };

  const validateCoursePreferences = () => {
    const selectedRanks = Object.values(coursePreferences).filter(Boolean);

    return new Set(selectedRanks).size === selectedRanks.length;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitStatus("idle");
    setErrorMessage("");

    const form = event.currentTarget;

    /*
     * Browser validation
     */
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    /*
     * Course ranking validation
     */
    if (!validateCoursePreferences()) {
      setSubmitStatus("error");
      setErrorMessage("Each course preference rank can only be used once.");

      return;
    }

    const formData = new FormData(form);

    /*
     * Add course preferences from React state.
     */
    courses.forEach((course, index) => {
      formData.set(
        `coursePreference${index + 1}`,
        coursePreferences[course] || "",
      );
    });

    setIsSubmitting(true);

    try {
      /*
       * Next.js API endpoint.
       *
       * Create:
       * app/api/enquiry/route.ts
       *
       * The endpoint should accept multipart/form-data
       * or normal FormData fields.
       */
      const response = await fetch("/api/enquiry", {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to submit your enquiry. Please try again.",
        );
      }

      setSubmitStatus("success");

      setErrorMessage("");

      /*
       * Reset form after successful submission.
       */
      form.reset();

      setCoursePreferences({});

      /*
       * Scroll the success message into view.
       */
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      console.error("Enquiry form submission failed:", error);

      setSubmitStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your enquiry.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="application"
      ref={sectionRef}
      className="bg-gray-50 py-14 sm:py-18 lg:py-20"
    >
      <Container>
        <div className="mx-auto max-w-5xl">
          {/* ================================================= */}
          {/* UNIFIED FORM CARD                                */}
          {/* ================================================= */}

          <div className="enquiry-form-card overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* ================================================= */}
            {/* FORM HEADER                                      */}
            {/* ================================================= */}

            <div className="border-b border-gray-100 bg-gray-50/70 px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                {/* Title */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                    2026–27
                  </span>

                  <h2 className="mt-3 text-3xl font-extrabold uppercase leading-tight tracking-[-0.035em] text-primary-700 sm:text-4xl">
                    STCET Enquiry Form
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                    Please complete the enquiry form below. Our admission team
                    will contact you regarding your enquiry.
                  </p>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* ACTUAL FORM                                      */}
            {/* ================================================= */}

            <form onSubmit={handleSubmit} noValidate={false}>
              <div className="px-6 sm:px-10 lg:px-12">
                {/* ================================================= */}
                {/* 01 STUDENT INFORMATION                           */}
                {/* ================================================= */}

                <FormSection number="01" title="Student Information">
                  <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                    <Field label="1. Student Name" required>
                      <input
                        type="text"
                        name="studentName"
                        required
                        autoComplete="name"
                        className={inputClass}
                        placeholder="Enter student name"
                      />
                    </Field>

                    <Field label="2. Date of Birth" required>
                      <input
                        type="date"
                        name="dateOfBirth"
                        required
                        className={inputClass}
                      />
                    </Field>

                    <Field label="3. Mobile Number" required>
                      <input
                        type="tel"
                        name="studentMobile"
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        className={inputClass}
                        placeholder="Enter mobile number"
                      />
                    </Field>

                    <Field label="4. Email ID" required>
                      <input
                        type="email"
                        name="studentEmail"
                        required
                        autoComplete="email"
                        className={inputClass}
                        placeholder="Enter email address"
                      />
                    </Field>

                    <Field label="5. Category">
                      <select
                        name="category"
                        defaultValue=""
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="" disabled>
                          Select category
                        </option>

                        <option value="OC">OC</option>
                        <option value="OBC">OBC</option>
                        <option value="BCM">BCM</option>
                        <option value="MBC">MBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="other">Other</option>
                      </select>

                      <p className="mt-2 text-xs text-gray-400">
                        Other – Sports Quota / Differently Abled
                      </p>
                    </Field>

                    <Field label="6. Hostel Required">
                      <div className="flex gap-8 pt-3">
                        <RadioOption
                          name="hostelRequired"
                          value="yes"
                          label="Yes"
                        />

                        <RadioOption
                          name="hostelRequired"
                          value="no"
                          label="No"
                        />
                      </div>
                    </Field>

                    <Field label="7. College Transport Required">
                      <div className="flex gap-8 pt-3">
                        <RadioOption
                          name="transportRequired"
                          value="yes"
                          label="Yes"
                        />

                        <RadioOption
                          name="transportRequired"
                          value="no"
                          label="No"
                        />
                      </div>
                    </Field>
                  </div>
                </FormSection>

                {/* ================================================= */}
                {/* 02 PARENT INFORMATION                            */}
                {/* ================================================= */}

                <FormSection number="02" title="Parent Information">
                  <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                    <Field label="8. Parent / Guardian's Name" required>
                      <input
                        type="text"
                        name="parentName"
                        required
                        autoComplete="name"
                        className={inputClass}
                        placeholder="Enter parent / guardian name"
                      />
                    </Field>

                    <Field label="9. Occupation">
                      <input
                        type="text"
                        name="occupation"
                        className={inputClass}
                        placeholder="Enter occupation"
                      />
                    </Field>

                    <Field label="10. Mobile Number" required>
                      <input
                        type="tel"
                        name="parentMobile"
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        className={inputClass}
                        placeholder="Enter mobile number"
                      />
                    </Field>

                    <Field label="11. Email ID">
                      <input
                        type="email"
                        name="parentEmail"
                        autoComplete="email"
                        className={inputClass}
                        placeholder="Enter email address"
                      />
                    </Field>

                    <Field label="12. Annual Income">
                      <input
                        type="text"
                        name="annualIncome"
                        inputMode="numeric"
                        className={inputClass}
                        placeholder="Enter annual income"
                      />
                    </Field>

                    <Field label="13. Address" fullWidth>
                      <textarea
                        name="address"
                        rows={3}
                        autoComplete="street-address"
                        className={`${inputClass} resize-none`}
                        placeholder="Enter address"
                      />
                    </Field>
                  </div>
                </FormSection>

                {/* ================================================= */}
                {/* 03 ACADEMIC DETAILS                              */}
                {/* ================================================= */}

                <FormSection number="03" title="Student Academic Details">
                  {/* 10th */}
                  <div className="mb-10">
                    <SubSectionTitle title="10th Std" />

                    <div className="grid gap-x-10 gap-y-8 md:grid-cols-3">
                      <Field label="14. School Name">
                        <input
                          type="text"
                          name="tenthSchool"
                          className={inputClass}
                          placeholder="Enter school name"
                        />
                      </Field>

                      <Field label="15. Board">
                        <input
                          type="text"
                          name="tenthBoard"
                          className={inputClass}
                          placeholder="Enter board"
                        />
                      </Field>

                      <Field label="16. Total Marks Obtained">
                        <input
                          type="text"
                          name="tenthMarks"
                          inputMode="numeric"
                          className={inputClass}
                          placeholder="Enter total marks"
                        />
                      </Field>
                    </div>
                  </div>

                  {/* 12th */}
                  <div>
                    <SubSectionTitle title="12th Std" />

                    <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                      <Field label="17. School Name">
                        <input
                          type="text"
                          name="twelfthSchool"
                          className={inputClass}
                          placeholder="Enter school name"
                        />
                      </Field>

                      <Field label="18. Board">
                        <input
                          type="text"
                          name="twelfthBoard"
                          className={inputClass}
                          placeholder="Enter board"
                        />
                      </Field>

                      <Field label="19. Marks – Maths (/200)">
                        <input
                          type="text"
                          name="mathsMarks"
                          inputMode="numeric"
                          className={inputClass}
                          placeholder="Enter Maths marks"
                        />
                      </Field>

                      <Field label="Physics (/200)">
                        <input
                          type="text"
                          name="physicsMarks"
                          inputMode="numeric"
                          className={inputClass}
                          placeholder="Enter Physics marks"
                        />
                      </Field>

                      <Field label="Chemistry (/200)">
                        <input
                          type="text"
                          name="chemistryMarks"
                          inputMode="numeric"
                          className={inputClass}
                          placeholder="Enter Chemistry marks"
                        />
                      </Field>

                      <Field label="20. MPC %">
                        <input
                          type="text"
                          name="mpcPercentage"
                          inputMode="decimal"
                          className={inputClass}
                          placeholder="Enter MPC percentage"
                        />
                      </Field>

                      <Field
                        label="21. Have you applied for / attended TNEA Counselling?"
                        fullWidth
                      >
                        <div className="flex gap-8 pt-3">
                          <RadioOption
                            name="tneaCounselling"
                            value="yes"
                            label="Yes"
                          />

                          <RadioOption
                            name="tneaCounselling"
                            value="no"
                            label="No"
                          />
                        </div>
                      </Field>
                    </div>
                  </div>
                </FormSection>

                {/* ================================================= */}
                {/* 04 COURSE PREFERENCE                             */}
                {/* ================================================= */}

                <FormSection number="04" title="Course Preference">
                  <p className="mb-6 max-w-2xl text-sm leading-6 text-gray-500">
                    22. Mark your preference as 1, 2 or 3 according to your
                    interest. Each rank can be selected only once.
                  </p>

                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    {courses.map((course, index) => {
                      const selectedValue = coursePreferences[course] || "";

                      return (
                        <div
                          key={course}
                          className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50/50 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5"
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black tracking-[0.08em] text-accent-400 shadow-sm">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <span className="text-sm font-bold text-gray-800 sm:text-base">
                              {course}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 pl-12 sm:pl-0">
                            <span className="text-xs font-bold uppercase tracking-[0.1em] text-gray-400">
                              Rank
                            </span>

                            <select
                              name={`coursePreference${index + 1}`}
                              value={selectedValue}
                              onChange={(event) =>
                                handleCoursePreferenceChange(
                                  course,
                                  event.target.value,
                                )
                              }
                              className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-center text-sm font-bold text-gray-800 outline-none transition-colors focus:border-primary-700"
                            >
                              <option value="">—</option>

                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </FormSection>

                {/* ================================================= */}
                {/* HOW DID YOU KNOW                                 */}
                {/* ================================================= */}

                <FormSection number="05" title="Enquiry Source">
                  <p className="mb-6 text-sm font-bold text-primary-700">
                    23. How did you know about us?
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {enquirySources.map((source) => (
                      <label
                        key={source}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3.5 transition-colors hover:border-primary-700 hover:bg-white"
                      >
                        <input
                          type="radio"
                          name="howDidYouKnow"
                          value={source}
                          className="h-4 w-4 accent-primary-700"
                        />

                        <span className="text-sm font-semibold text-gray-700">
                          {source}
                        </span>
                      </label>
                    ))}
                  </div>
                </FormSection>

                {/* ================================================= */}
                {/* STATUS MESSAGES                                  */}
                {/* ================================================= */}

                {submitStatus === "success" && (
                  <div
                    role="status"
                    className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                        ✓
                      </span>

                      <div>
                        <p className="font-bold text-green-800">
                          Enquiry submitted successfully
                        </p>

                        <p className="mt-1 text-sm leading-6 text-green-700">
                          Thank you for your enquiry. Our admission team will
                          contact you soon.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && errorMessage && (
                  <div
                    role="alert"
                    className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5"
                  >
                    <p className="font-bold text-red-800">
                      Unable to submit enquiry
                    </p>

                    <p className="mt-1 text-sm leading-6 text-red-700">
                      {errorMessage}
                    </p>
                  </div>
                )}

                {/* ================================================= */}
                {/* SUBMIT                                            */}
                {/* ================================================= */}

                <div className="border-t border-gray-100 py-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xl text-xs leading-5 text-gray-400">
                      By submitting this enquiry form, you are providing your
                      details to STCET for enquiry and admission-related
                      communication.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex min-w-[180px] shrink-0 items-center justify-center gap-2 rounded-full bg-primary-700 px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Enquiry"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ================================================= */
/* FORM SECTION                                      */
/* ================================================= */

function FormSection({
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-gray-100 py-9 sm:py-10">
      <div className="mb-7 flex items-start gap-4 sm:mb-8">
        <div>
          <h2 className="text-xl font-extrabold uppercase leading-tight tracking-tight text-primary-700 sm:text-2xl">
            {title}
          </h2>
        </div>
      </div>

      {children}
    </section>
  );
}

/* ================================================= */
/* SUB SECTION TITLE                                 */
/* ================================================= */

function SubSectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary-700 sm:text-sm">
        {title}
      </h3>
    </div>
  );
}

/* ================================================= */
/* FIELD                                             */
/* ================================================= */

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

/* ================================================= */
/* RADIO OPTION                                      */
/* ================================================= */

function RadioOption({
  name,
  value,
  label,
}: {
  name: string;
  value: string;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="radio"
        name={name}
        value={value}
        className="h-4 w-4 accent-primary-700"
      />

      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </label>
  );
}
