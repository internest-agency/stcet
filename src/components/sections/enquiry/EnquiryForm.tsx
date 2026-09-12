"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger);

const inputClass =
  "w-full border-b border-gray-300 bg-transparent px-0 py-3 text-base text-gray-900 outline-none transition-colors duration-200 placeholder:text-gray-400 focus:border-primary-700";

const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-gray-500";

const sectionTitles = [
  "Student Information",
  "Parent Information",
  "Student Academic Details",
  "Course Preference",
];

export default function EnquiryForm() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ".enquiry-form-section",
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: "power3.out",
            },
          );
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-gray-50">
      <Container className="py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          {/* Form Header */}
          <div className="mb-12 border-b border-gray-200 pb-8 lg:mb-16">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  STCET Enquiry Form
                </span>

                <h2 className="mt-3 text-3xl font-extrabold uppercase leading-tight tracking-[-0.035em] text-primary-700 sm:text-4xl">
                  2026–27
                </h2>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
                  Enquiry Form No.
                </p>

                <div className="mt-3 h-8 w-40 border-b border-gray-300" />
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
                  Date
                </p>

                <div className="mt-3 h-8 w-40 border-b border-gray-300" />
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="enquiry-form-section">
            <FormSectionHeading number="01" title="Student Information" />

            <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
              <Field label="1. Student Name" required>
                <input
                  type="text"
                  name="studentName"
                  className={inputClass}
                  placeholder="Enter student name"
                />
              </Field>

              <Field label="2. Date of Birth" required>
                <input type="date" name="dateOfBirth" className={inputClass} />
              </Field>

              <Field label="3. Mobile Number" required>
                <input
                  type="tel"
                  name="studentMobile"
                  className={inputClass}
                  placeholder="Enter mobile number"
                />
              </Field>

              <Field label="4. Email ID" required>
                <input
                  type="email"
                  name="studentEmail"
                  className={inputClass}
                  placeholder="Enter email address"
                />
              </Field>

              <Field label="5. Category">
                <select
                  name="category"
                  className={`${inputClass} cursor-pointer`}
                  defaultValue=""
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
                  <RadioOption name="hostelRequired" value="yes" label="Yes" />

                  <RadioOption name="hostelRequired" value="no" label="No" />
                </div>
              </Field>

              <Field label="7. College Transport Required">
                <div className="flex gap-8 pt-3">
                  <RadioOption
                    name="transportRequired"
                    value="yes"
                    label="Yes"
                  />

                  <RadioOption name="transportRequired" value="no" label="No" />
                </div>
              </Field>
            </div>
          </div>

          {/* Parent Information */}
          <div className="enquiry-form-section mt-16 border-t border-gray-200 pt-12 sm:mt-20 sm:pt-16">
            <FormSectionHeading number="02" title="Parent Information" />

            <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
              <Field label="8. Parent / Guardian's Name" required>
                <input
                  type="text"
                  name="parentName"
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
                  className={inputClass}
                  placeholder="Enter mobile number"
                />
              </Field>

              <Field label="11. Email ID">
                <input
                  type="email"
                  name="parentEmail"
                  className={inputClass}
                  placeholder="Enter email address"
                />
              </Field>

              <Field label="12. Annual Income">
                <input
                  type="text"
                  name="annualIncome"
                  className={inputClass}
                  placeholder="Enter annual income"
                />
              </Field>

              <Field label="13. Address" fullWidth>
                <textarea
                  name="address"
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Enter address"
                />
              </Field>
            </div>
          </div>

          {/* Academic Details */}
          <div className="enquiry-form-section mt-16 border-t border-gray-200 pt-12 sm:mt-20 sm:pt-16">
            <FormSectionHeading number="03" title="Student Academic Details" />

            {/* 10th Standard */}
            <div className="mb-12">
              <div className="mb-7 flex items-center gap-4">
                <span className="h-px w-8 bg-accent-400" />

                <h3 className="text-sm font-extrabold uppercase tracking-[0.15em] text-primary-700">
                  10th Std
                </h3>
              </div>

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
                    className={inputClass}
                    placeholder="Enter total marks"
                  />
                </Field>
              </div>
            </div>

            {/* 12th Standard */}
            <div>
              <div className="mb-7 flex items-center gap-4">
                <span className="h-px w-8 bg-accent-400" />

                <h3 className="text-sm font-extrabold uppercase tracking-[0.15em] text-primary-700">
                  12th Std
                </h3>
              </div>

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
                    className={inputClass}
                    placeholder="Enter Maths marks"
                  />
                </Field>

                <Field label="Physics (/200)">
                  <input
                    type="text"
                    name="physicsMarks"
                    className={inputClass}
                    placeholder="Enter Physics marks"
                  />
                </Field>

                <Field label="Chemistry (/200)">
                  <input
                    type="text"
                    name="chemistryMarks"
                    className={inputClass}
                    placeholder="Enter Chemistry marks"
                  />
                </Field>

                <Field label="20. MPC %">
                  <input
                    type="text"
                    name="mpcPercentage"
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

                    <RadioOption name="tneaCounselling" value="no" label="No" />
                  </div>
                </Field>
              </div>
            </div>
          </div>

          {/* Course Preference */}
          <div className="enquiry-form-section mt-16 border-t border-gray-200 pt-12 sm:mt-20 sm:pt-16">
            <FormSectionHeading number="04" title="Course Preference" />

            <p className="mb-8 max-w-2xl text-base leading-7 text-gray-600">
              22. Mark your preference 1, 2, 3 according to interest.
            </p>

            <div className="overflow-hidden border-y border-gray-200">
              {[
                "B.E. CSE",
                "B.E. CSE (AI+ML)",
                "B.E. ECE",
                "B.E. EEE",
                "B.Tech. IT",
              ].map((course, index) => (
                <div
                  key={course}
                  className="flex items-center justify-between gap-5 border-b border-gray-200 py-5 last:border-b-0"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-sm font-black tracking-[0.08em] text-accent-400">
                      0{index + 1}
                    </span>

                    <span className="text-base font-bold text-gray-800 sm:text-lg">
                      {course}
                    </span>
                  </div>

                  <select
                    name={`coursePreference${index + 1}`}
                    className="w-24 border-b border-gray-300 bg-transparent px-2 py-2 text-center text-sm font-bold text-gray-800 outline-none focus:border-primary-700"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Rank
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Source */}
          <div className="enquiry-form-section mt-16 border-t border-gray-200 pt-12 sm:mt-20 sm:pt-16">
            <div className="mb-8">
              <span className="text-sm font-extrabold text-primary-700">
                23. How did you know about us?
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Social Media",
                "Advertisements",
                "Friends & Relatives",
                "Others",
              ].map((source) => (
                <label
                  key={source}
                  className="flex cursor-pointer items-center gap-3 border border-gray-200 bg-white px-5 py-4 transition-colors hover:border-primary-700"
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
          </div>

          {/* Signatures */}
          <div className="enquiry-form-section mt-16 border-t border-gray-200 pt-12 sm:mt-20 sm:pt-16">
            <div className="grid gap-10 md:grid-cols-2">
              <SignatureBox label="24. Student Signature" />

              <SignatureBox label="25. Parent Signature" />
            </div>
          </div>

          {/* Submit */}
          <div className="enquiry-form-section mt-14 border-t border-gray-200 pt-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <p className="max-w-xl text-sm leading-6 text-gray-500">
                By submitting this enquiry form, you are providing your details
                to STCET for enquiry and admission-related communication.
              </p>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary-700 px-8 py-3.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Submit Enquiry
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------- */
/* Helper Components                   */
/* ---------------------------------- */

function FormSectionHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="mb-10 flex items-start gap-5">
      <span className="pt-1 text-sm font-black tracking-[0.08em] text-accent-400">
        {number}
      </span>

      <div>
        <h2 className="text-2xl font-extrabold uppercase leading-tight tracking-[-0.025em] text-primary-700 sm:text-3xl">
          {title}
        </h2>

        <div className="mt-4 h-1 w-10 bg-accent-400" />
      </div>
    </div>
  );
}

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

function SignatureBox({ label }: { label: string }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="mt-3 flex h-32 items-end border-b border-gray-300 bg-white px-5 pb-4">
        <span className="text-xs text-gray-300">Signature</span>
      </div>
    </div>
  );
}
