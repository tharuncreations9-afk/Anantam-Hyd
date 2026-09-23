"use client";

import { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { EVENT_TYPES } from "@/data/event-types";

const initial = {
  name: "",
  phone: "",
  email: "",
  eventType: "",
  preferredDate: "",
  guests: "",
  message: "",
};

export default function ContactForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = "Please share your name.";
    if (!values.phone.trim()) next.phone = "A phone number helps us respond.";
    if (!values.email.trim()) {
      next.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Please enter a valid email.";
    }
    if (!values.eventType) next.eventType = "Please select an event type.";
    if (!values.message.trim()) next.message = "Tell us a little about your plans.";
    return next;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    setSubmitError("");
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Could not send enquiry.");
      }
      setSubmitted(true);
      setValues(initial);
    } catch (error) {
      setSubmitError(error.message || "Could not send enquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full border-b border-forest-deep/20 bg-transparent py-3 text-sm text-charcoal outline-none transition-colors duration-500 placeholder:text-muted/60 focus:border-gold";

  return (
    <form id="enquiry-form" onSubmit={onSubmit} noValidate className="scroll-mt-32 space-y-8">
      {submitted ? (
        <div
          className="border border-forest/20 bg-cream px-6 py-5 text-sm leading-relaxed text-forest"
          role="status"
        >
          Thank you. Your enquiry has been received. Our team will get back to
          you shortly.
        </div>
      ) : null}

      {submitError ? (
        <div className="border border-red-700/20 bg-red-50 px-6 py-4 text-sm text-red-800" role="alert">
          {submitError}
        </div>
      ) : null}

      <div className="grid gap-8 md:grid-cols-2">
        <Field
          label="Name"
          name="name"
          value={values.name}
          onChange={onChange}
          error={errors.name}
          className={fieldClass}
          required
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={onChange}
          error={errors.phone}
          className={fieldClass}
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={onChange}
          error={errors.email}
          className={fieldClass}
          required
        />
        <div>
          <label htmlFor="eventType" className="label-caps mb-2 block">
            Event Type
            <span className="text-gold"> *</span>
          </label>
          <select
            id="eventType"
            name="eventType"
            value={values.eventType}
            onChange={onChange}
            className={`${fieldClass} cursor-pointer appearance-none bg-[length:12px] bg-[right_0_center] bg-no-repeat pr-6`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2377736b' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
            }}
            aria-invalid={Boolean(errors.eventType)}
            aria-describedby={errors.eventType ? "eventType-error" : undefined}
          >
            <option value="">Select event type</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.eventType ? (
            <p id="eventType-error" className="mt-2 text-xs text-red-700">
              {errors.eventType}
            </p>
          ) : null}
        </div>
        <Field
          label="Preferred Date"
          name="preferredDate"
          type="date"
          value={values.preferredDate}
          onChange={onChange}
          className={fieldClass}
        />
        <Field
          label="Number of Guests"
          name="guests"
          value={values.guests}
          onChange={onChange}
          className={fieldClass}
          placeholder="Approximate"
        />
      </div>

      <div>
        <label htmlFor="message" className="label-caps mb-2 block">
          Message
          <span className="text-gold"> *</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={onChange}
          className={`${fieldClass} resize-y`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message ? (
          <p id="message-error" className="mt-2 text-xs text-red-700">
            {errors.message}
          </p>
        ) : null}
      </div>

      <PrimaryButton as="button" type="submit" variant="solid" disabled={submitting}>
        {submitting ? "Sending…" : "Send Enquiry"}
      </PrimaryButton>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  className,
  type = "text",
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label htmlFor={name} className="label-caps mb-2 block">
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
