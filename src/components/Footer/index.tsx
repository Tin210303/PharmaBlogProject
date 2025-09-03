import React, { useState } from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import styles from './index.module.css';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
}

const Footer: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Message sent successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      });
    } catch (error) {
      alert('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left Column - Company Info */}
        <div className={styles.companyInfo}>
          <h2 className={styles.title}>Pharma News</h2>
          
          <div className={styles.contactInfo}>
            <p>123-456-7890</p>
            <p>pharmanews.clinpharm@gmail.com</p>
          </div>

          <div className={styles.socialLinks}>
            <div 
              className={styles.socialLink}
              aria-label="Facebook"
            >
              <a target='_blank' href='https://www.facebook.com/profile.php?id=100063672543408'><Facebook size={20} /></a>
            </div>
            <div 
              className={styles.socialLink}
              aria-label="Twitter"
            >
              <a target='_blank' href='#'><Twitter size={20} /></a>
            </div>
            <div 
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <a target='_blank' href='#'><Instagram size={20} /></a>
            </div>
          </div>

          <div className={styles.copyright}>
            <p>© 2025 by Pharma News.</p>
            <p>Powered and secured by <span className={styles.wixLink}>Wix</span></p>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className={styles.contactSection}>
          <h3 className={styles.contactTitle}>Contact</h3>
          <p className={styles.contactSubtitle}>Ask me anything</p>

          <div className={styles.formContainer}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
                />
                {errors.firstName && (
                  <p className={styles.errorMessage}>{errors.firstName}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.lastName ? styles.error : ''}`}
                />
                {errors.lastName && (
                  <p className={styles.errorMessage}>{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
              />
              {errors.email && (
                <p className={styles.errorMessage}>{errors.email}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Leave Us a Message...
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className={`${styles.textarea} ${errors.message ? styles.error : ''}`}
                placeholder="Your message here..."
              />
              {errors.message && (
                <p className={styles.errorMessage}>{errors.message}</p>
              )}
            </div>

            <div className={styles.submitContainer}>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;