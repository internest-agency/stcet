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

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ".career-form-section",
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.1,
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
          <div className="career-form-section mb-12 border-b border-gray-200 pb-8 lg:mb-16">
            <div className="flex items-end justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Careers
                </span>

                <h2 className="mt-3 text-3xl font-extrabold uppercase leading-tight tracking-[-0.035em] text-primary-700 sm:text-4xl">
                  Application Form
                </h2>
              </div>

              <span className="hidden text-[5rem] font-black leading-none tracking-[-0.08em] text-primary-700/[0.04] sm:block lg:text-[7rem]">
                01
              </span>
            </div>
          </div>

          {/* Personal Information */}
          <div className="career-form-section">
            <FormSectionHeading number="01" title="Personal Information" />

            <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
              <Field label="Full Name" required>
                <input
                  type="text"
                  name="fullName"
                  className={inputClass}
                  placeholder="Enter your full name"
                />
              </Field>

              <Field label="Mobile Number" required>
                <input
                  type="tel"
                  name="mobileNumber"
                  className={inputClass}
                  placeholder="Enter mobile number"
                />
              </Field>

              <Field label="Email Address" required>
                <input
                  type="email"
                  name="emailAddress"
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
                <input type="date" name="dateOfBirth" className={inputClass} />
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
          </div>

          {/* Academic Qualifications */}
          <div className="career-form-section mt-16 border-t border-gray-200 pt-12 sm:mt-20 sm:pt-16">
            <FormSectionHeading number="02" title="Academic Qualifications" />

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
          </div>

          {/* Position Applying For */}
          <div className="career-form-section mt-16 border-t border-gray-200 pt-12 sm:mt-20 sm:pt-16">
            <FormSectionHeading number="03" title="Position Applying For" />

            <div>
              <p className="mb-7 text-base leading-7 text-gray-600">
                Select the category that best matches the position you are
                applying for.
              </p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {positionCategories.map((category) => (
                  <label
                    key={category}
                    className="flex cursor-pointer items-center gap-3 border border-gray-200 bg-white px-5 py-4 transition-colors duration-200 hover:border-primary-700"
                  >
                    <input
                      type="radio"
                      name="positionCategory"
                      value={category}
                      className="h-4 w-4 accent-primary-700"
                    />

                    <span className="text-sm font-semibold leading-5 text-gray-700">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Department */}
            <div className="mt-12">
              <p className="mb-7 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                Department Applying For
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {departments.map((department) => (
                  <label
                    key={department}
                    className="flex cursor-pointer items-center gap-3 border border-gray-200 bg-white px-5 py-4 transition-colors duration-200 hover:border-primary-700"
                  >
                    <input
                      type="radio"
                      name="department"
                      value={department}
                      className="h-4 w-4 accent-primary-700"
                    />

                    <span className="text-sm font-semibold leading-5 text-gray-700">
                      {department}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Faculty Applicants */}
          <div className="career-form-section mt-16 border-t border-gray-200 pt-12 sm:mt-20 sm:pt-16">
            <FormSectionHeading number="04" title="For Faculty Applicants" />

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
          </div>

          {/* Professional Experience */}
          <div className="career-form-section mt-16 border-t border-gray-200 pt-12 sm:mt-20 sm:pt-16">
            <FormSectionHeading number="05" title="Professional Experience" />

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
          </div>

          {/* Resume */}
          <div className="career-form-section mt-16 border-t border-gray-200 pt-12 sm:mt-20 sm:pt-16">
            <FormSectionHeading number="06" title="Upload Resume / CV" />

            <label className="group flex cursor-pointer flex-col items-center justify-center border border-dashed border-gray-300 bg-white px-6 py-12 text-center transition-colors duration-300 hover:border-primary-700">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-primary-700 transition-colors duration-300 group-hover:bg-primary-700 group-hover:text-white">
                +
              </span>

              <span className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-primary-700">
                Choose Resume / CV
              </span>

              <span className="mt-2 text-sm text-gray-400">
                Upload your latest resume or CV
              </span>

              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                className="sr-only"
              />
            </label>
          </div>

          {/* Declaration */}
          <div className="career-form-section mt-16 border-t border-gray-200 pt-12 sm:mt-20 sm:pt-16">
            <FormSectionHeading number="07" title="Declaration" />

            <label className="flex cursor-pointer gap-4 border border-gray-200 bg-white p-6 sm:p-8">
              <input
                type="checkbox"
                name="declaration"
                className="mt-1 h-5 w-5 shrink-0 accent-primary-700"
              />

              <span className="text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                I certify that the information provided by me in this
                application is true and complete to the best of my knowledge. I
                understand that any incorrect or misleading information may
                result in disqualification from the selection process or
                withdrawal of an offer of employment.
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="career-form-section mt-12 border-t border-gray-200 pt-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <p className="max-w-xl text-sm leading-6 text-gray-500">
                Please review your information before submitting your
                application.
              </p>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary-700 px-8 py-3.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------- */
/* Helper Components                  */
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
