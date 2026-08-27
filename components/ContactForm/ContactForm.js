"use client";

import { useState, useRef } from "react";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import styles from "./ContactForm.module.css";

export default function ContactForm({
  formType = "general",
  defaultCategory = "",
  defaultProduct = ""
}) {
  const isCustom = formType === "custom";

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappPreferred: false,
    country: "",
    projectType: "Residential",
    category: defaultCategory || "Sacred Sanctuaries",
    productName: defaultProduct || "",
    dimensions: "",
    message: "",
    referenceFile: null
  });

  // Validation States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const successRef = useRef(null);

  // Field Inputs Handler
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear validation error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Submit validator
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message details are required.";
    }

    if (isCustom) {
      if (!formData.country.trim()) newErrors.country = "Country is required.";
      if (!formData.dimensions.trim()) newErrors.dimensions = "Approximate dimensions are required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Post inquiry to real backend API endpoint
      const res = await fetch("/api/admin/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          inquiryType: formType,
          message: `[${formData.projectType || "General"}] ${formData.dimensions ? `Dimensions: ${formData.dimensions}. ` : ""}${formData.message}`
        })
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry");
      }

      setIsSuccess(true);
      
      // Focus on success banner for screen readers
      setTimeout(() => {
        successRef.current?.focus();
      }, 50);
    } catch (err) {
      console.error("Submission error:", err);
      setErrors({ form: "An error occurred. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        className={styles.successMessage}
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
      >
        <span className={styles.successIcon}>✓</span>
        <h3 className={styles.successTitle}>Inquiry Sent Successfully</h3>
        <p>
          Thank you for contacting Jaipur Stonecraft. Our design coordination office will review your requirements and reach out within 24–48 business hours.
        </p>
        <button
          onClick={() => {
            setIsSuccess(false);
            setFormData({
              name: "",
              email: "",
              phone: "",
              whatsappPreferred: false,
              country: "",
              projectType: "Residential",
              category: defaultCategory || "Sacred Sanctuaries",
              productName: defaultProduct || "",
              dimensions: "",
              message: "",
              referenceFile: null
            });
          }}
          className={styles.resetButton}
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {errors.form && (
        <div className={styles.formError} role="alert">
          {errors.form}
        </div>
      )}

      {/* Row 1: Name & Email */}
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Full Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.input} ${errors.name ? styles.inputInvalid : ""}`}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.name && (
            <span id="name-error" className={styles.errorText} role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.inputInvalid : ""}`}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.email && (
            <span id="email-error" className={styles.errorText} role="alert">
              {errors.email}
            </span>
          )}
        </div>
      </div>

      {/* Row 2: Phone & Optional WhatsApp Preference */}
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>
            Phone Number <span className={styles.required}>*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`${styles.input} ${errors.phone ? styles.inputInvalid : ""}`}
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <span id="phone-error" className={styles.errorText} role="alert">
              {errors.phone}
            </span>
          )}
        </div>

        <div className={styles.formGroup} style={{ justifyContent: "center" }}>
          {isCustom ? (
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="whatsappPreferred"
                name="whatsappPreferred"
                checked={formData.whatsappPreferred}
                onChange={handleChange}
                className={styles.checkbox}
                disabled={isSubmitting}
              />
              <label htmlFor="whatsappPreferred" className={styles.checkboxLabel}>
                Preferred communication via WhatsApp
              </label>
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label htmlFor="projectType" className={styles.label}>
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className={styles.select}
                disabled={isSubmitting}
              >
                <option value="Residential">Residential</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Temple">Temple / Sacred</option>
                <option value="Commercial">Commercial</option>
                <option value="Garden/Landscape">Garden / Landscape</option>
                <option value="Memorial/Tribute">Memorial / Tribute</option>
                <option value="Custom">Custom / Other</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Custom Fields segment */}
      {isCustom && (
        <>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="country" className={styles.label}>
                Country <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`${styles.input} ${errors.country ? styles.inputInvalid : ""}`}
                aria-required="true"
                aria-invalid={!!errors.country}
                aria-describedby={errors.country ? "country-error" : undefined}
                disabled={isSubmitting}
              />
              {errors.country && (
                <span id="country-error" className={styles.errorText} role="alert">
                  {errors.country}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.label}>
                Collection Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={styles.select}
                disabled={isSubmitting}
              >
                <option value="Sacred Sanctuaries">Sacred Sanctuaries</option>
                <option value="Architectural Stone">Architectural Stone</option>
                <option value="Garden & Water">Garden & Water</option>
                <option value="Luxury Stone Objects">Luxury Stone Objects</option>
                <option value="Custom & Tribute">Custom & Tribute</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="dimensions" className={styles.label}>
                Approximate Dimensions <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="dimensions"
                name="dimensions"
                placeholder="e.g. Height: 5ft, Base: 3x3ft"
                value={formData.dimensions}
                onChange={handleChange}
                className={`${styles.input} ${errors.dimensions ? styles.inputInvalid : ""}`}
                aria-required="true"
                aria-invalid={!!errors.dimensions}
                aria-describedby={errors.dimensions ? "dimensions-error" : undefined}
                disabled={isSubmitting}
              />
              {errors.dimensions && (
                <span id="dimensions-error" className={styles.errorText} role="alert">
                  {errors.dimensions}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="referenceFile" className={styles.label}>
                Reference Image or Blueprint (Optional)
              </label>
              <input
                type="file"
                id="referenceFile"
                name="referenceFile"
                accept="image/*,.pdf,.dwg"
                onChange={handleChange}
                className={styles.fileInput}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </>
      )}

      {/* Message description box */}
      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>
          {isCustom ? "Describe Your Project Requirements" : "Message / Inquiry details"}{" "}
          <span className={styles.required}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className={`${styles.textarea} ${errors.message ? styles.inputInvalid : ""}`}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          disabled={isSubmitting}
          placeholder={
            isCustom
              ? "Share details about posture, stone choices, installation environment, and time frames..."
              : "Tell us about your requirements..."
          }
        />
        {errors.message && (
          <span id="message-error" className={styles.errorText} role="alert">
            {errors.message}
          </span>
        )}
      </div>

      <div style={{ marginTop: "var(--spacing-md)", alignSelf: "flex-start" }}>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
        </button>
      </div>
    </form>
  );
}
