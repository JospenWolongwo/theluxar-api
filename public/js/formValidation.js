/* eslint-disable no-undef */

// Error messages for different scenarios
const ErrorMessages = {
  NETWORK_ERROR:
    'Unable to connect. Please check your internet connection and try again.',
  CSRF_MISSING:
    'Security token is missing. Please refresh the page and try again.',
  RECAPTCHA_ERROR:
    'Security verification failed. Please refresh the page and try again.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  ACCOUNT_EXISTS: 'An account with this email already exists.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  DEFAULT: 'An unexpected error occurred. Please try again.',
  VALIDATION_ERROR: 'Please correct the errors in the form.',
  INVALID_RESET_TOKEN: 'Password reset token is invalid or has expired.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  SOCIAL_AUTH_ERROR: 'Authentication failed. Please try again.',
  POPUP_BLOCKED: 'Please enable popups for social login to work.',
};

// New SocialAuthManager class to handle social login flows
class SocialAuthManager {
  constructor() {
    this.popup = null;
    this.authCompleted = false;
    this.setupSocialLoginHandlers();
  }

  setupSocialLoginHandlers() {
    document.querySelectorAll('.btn-google, .btn-github').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = button.classList.contains('btn-google')
          ? 'google'
          : 'github';
        this.handleSocialLogin(provider);
      });
    });

    // Listen for messages from popup
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'social-auth-success') {
        this.authCompleted = true;
        this.handleAuthSuccess(event.data);
      } else if (event.data.type === 'social-auth-error') {
        this.handleAuthError(event.data.error);
      }
    });
  }

  handleSocialLogin(provider) {
    const authUrl = `${window.baseUrl}/auth/${provider}`;
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    try {
      this.popup = window.open(
        authUrl,
        'socialAuth',
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      if (!this.popup || this.popup.closed) {
        throw new Error(ErrorMessages.POPUP_BLOCKED);
      }

      const pollTimer = setInterval(() => {
        if (this.popup.closed) {
          clearInterval(pollTimer);
          this.handlePopupClosed();
        }
      }, 500);
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  handleAuthSuccess(data) {
    if (this.popup) this.popup.close();
    if (data.tokens) {
      data.redirect
        ? (window.location.href = data.redirect)
        : window.location.reload();
    }
  }

  handleAuthError(error) {
    if (this.popup) this.popup.close();
    const errorContainer = document.querySelector('.form-errors');
    if (errorContainer) {
      errorContainer.textContent =
        error.message || ErrorMessages.SOCIAL_AUTH_ERROR;
      errorContainer.hidden = false;
      errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  handlePopupClosed() {
    if (!this.authCompleted)
      this.handleAuthError({ message: 'Authentication was cancelled.' });
  }
}

// Password validation mixin
const PasswordValidationMixin = {
  validatePasswordField(input, confirmFieldId) {
    const errorSpan = document.getElementById(`${input.id}-error`);

    if (input.type === 'password') {
      const passwordError = this.getPasswordError(input.value);
      if (passwordError) {
        errorSpan.textContent = passwordError;
        input.classList.add('invalid');
        input.setAttribute('aria-invalid', 'true');
        return false;
      }

      // If this is a confirm password field, check matching
      if (input.id === confirmFieldId) {
        const passwordsMatch = this.checkPasswordsMatch();
        if (!passwordsMatch) {
          errorSpan.textContent = ErrorMessages.PASSWORDS_DONT_MATCH;
          input.classList.add('invalid');
          input.setAttribute('aria-invalid', 'true');
          return false;
        }
      }
    }
    return true;
  },

  getPasswordError(password) {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password))
      return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password))
      return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password))
      return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(password))
      return 'Password must contain at least one special character';
    return null;
  },

  checkPasswordsMatch() {
    const password = this.form.querySelector('#' + this.passwordFieldId).value;
    const confirmPassword = this.form.querySelector(
      '#' + this.confirmFieldId,
    ).value;
    return password === confirmPassword;
  },
};

// Base form validator class
class BaseFormValidator {
  constructor(form) {
    this.form = form;
    this.errorContainer = this.createErrorContainer();
    this.inputs = form.querySelectorAll('input[required]:not([type="hidden"])');
    this.submitButton = form.querySelector('button[type="submit"]');
    this.setupInputValidation();
    this.setupLoadingState();
  }

  createErrorContainer() {
    const container = document.createElement('div');
    container.className = 'form-errors';
    container.setAttribute('role', 'alert');
    container.setAttribute('aria-live', 'polite');
    this.form.prepend(container);
    return container;
  }

  setupLoadingState() {
    if (this.submitButton) {
      // Store original button text
      this.submitButton.dataset.originalText = this.submitButton.innerHTML;

      // Create loading spinner
      // why are we creating a loading spinner manually?
      const spinner = document.createElement('span');
      spinner.className = 'loading-spinner';
      spinner.style.display = 'none';
      this.submitButton.prepend(spinner);
    }
  }

  setLoading(isLoading) {
    if (this.submitButton) {
      // how do we know the spinner is within the button?
      // const spinner = this.submitButton.querySelector('.loading-spinner');
      if (isLoading) {
        this.submitButton.disabled = true;
        // spinner.style.display = 'inline-block';
        this.submitButton.textContent = ' Loading...';
        // this.submitButton.prepend(spinner);
      } else {
        this.submitButton.disabled = false;
        // spinner.style.display = 'none';
        this.submitButton.innerHTML = this.submitButton.dataset.originalText;
      }
    }
  }

  setupInputValidation() {
    this.inputs.forEach((input) => {
      const errorSpan = document.createElement('span');
      errorSpan.className = 'error-message';
      errorSpan.id = `${input.id}-error`;
      errorSpan.setAttribute('aria-live', 'polite');
      input.parentNode.insertBefore(errorSpan, input.nextSibling);

      input.addEventListener('input', () => {
        this.validateField(input);
        this.clearFormError();
      });
    });
  }

  showError(message, isFormLevel = true) {
    if (isFormLevel) {
      this.errorContainer.textContent = message;
      this.errorContainer.hidden = false;
      this.errorContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  clearFormError() {
    this.errorContainer.textContent = '';
    this.errorContainer.hidden = true;
  }

  validateField(input) {
    if (input.type === 'hidden') {
      input.classList.remove('invalid');
      return true;
    }

    const errorSpan = document.getElementById(`${input.id}-error`);
    let isValid = true;
    errorSpan.textContent = '';

    if (!input.value.trim()) {
      errorSpan.textContent = 'This field is required';
      isValid = false;
    } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
      errorSpan.textContent = 'Please enter a valid email address';
      isValid = false;
    }

    input.classList.toggle('invalid', !isValid);
    input.setAttribute('aria-invalid', !isValid);
    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.clearFormError();
    let isValid = true;

    // Validate CSRF token
    const csrfInput = this.form.querySelector('input[name="_csrf"]');
    if (!csrfInput || !csrfInput.value) {
      this.showError(ErrorMessages.CSRF_MISSING);
      return;
    }

    // Validate all fields
    this.inputs.forEach((input) => {
      if (!this.validateField(input)) isValid = false;
    });

    if (!isValid) {
      this.showError(ErrorMessages.VALIDATION_ERROR);
      const firstInvalid = this.form.querySelector(
        '.invalid:not([type="hidden"])',
      );
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      this.setLoading(true);
      await this.submitForm();
    } catch (error) {
      console.error('Form submission error:', error);
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  handleError(error) {
    let errorMessage = ErrorMessages.DEFAULT;

    if (!navigator.onLine) {
      errorMessage = ErrorMessages.NETWORK_ERROR;
    } else if (
      error.name === 'TypeError' ||
      error.message.includes('Failed to fetch')
    ) {
      errorMessage = ErrorMessages.NETWORK_ERROR;
    } else if (error.status === 401) {
      errorMessage = ErrorMessages.INVALID_CREDENTIALS;
    } else if (error.status === 403) {
      errorMessage = ErrorMessages.CSRF_MISSING;
    } else if (error.status === 409) {
      errorMessage = ErrorMessages.ACCOUNT_EXISTS;
    } else if (error.status >= 500) {
      errorMessage = ErrorMessages.SERVER_ERROR;
    } else if (error.message) {
      errorMessage = error.message;
    }

    this.showError(errorMessage);
  }

  async submitForm() {
    throw new Error('submitForm must be implemented by child classes');
  }
}

// Form submission helper methods
const FormSubmissionMixin = {
  async getCaptchaToken(action) {
    if (typeof grecaptcha === 'undefined') {
      throw new Error(ErrorMessages.RECAPTCHA_ERROR);
    }

    try {
      return await grecaptcha.execute(window.RECAPTCHA_SITE_KEY, { action });
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      throw new Error(ErrorMessages.RECAPTCHA_ERROR);
    }
  },

  async sendFormData(captchaToken) {
    const formData = new URLSearchParams();

    // Add form fields
    for (const [key, value] of new FormData(this.form)) {
      formData.append(key, value);
    }
    // Add reCAPTCHA token
    formData.append('recaptchaToken', captchaToken);

    try {
      const response = await fetch(this.form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-csrf-token': this.form.querySelector('input[name="_csrf"]').value,
        },
        body: formData.toString(),
        credentials: 'include',
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          throw { ...error, status: response.status };
        }
        throw { status: response.status, message: ErrorMessages.DEFAULT };
      }

      if (contentType && contentType.includes('text/html')) {
        const html = await response.text();
        document.documentElement.innerHTML = html;
        // Re-run scripts
        Array.from(document.getElementsByTagName('script')).forEach(
          (oldScript) => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach((attr) => {
              newScript.setAttribute(attr.name, attr.value);
            });
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
          },
        );
        return;
      }

      const data = await response.json();
      if (data && data.redirect) {
        window.location.href = data.redirect;
      }
    } catch (error) {
      if (!error.status) {
        throw new Error(ErrorMessages.NETWORK_ERROR);
      }
      throw error;
    }
  },
};

// Login form validator
class LoginFormValidator extends BaseFormValidator {
  constructor(form) {
    super(form);
    this.passwordFieldId = 'password';
  }

  validateField(input) {
    const isValid = super.validateField(input);
    if (!isValid) return false;

    if (input.type === 'password') {
      const errorSpan = document.getElementById(`${input.id}-error`);
      if (input.value.length < 8) {
        errorSpan.textContent = 'Password must be at least 8 characters';
        input.classList.add('invalid');
        input.setAttribute('aria-invalid', 'true');
        return false;
      }
    }
    return true;
  }
  async submitForm() {
    const token = await this.getCaptchaToken('login');
    await this.sendFormData(token);
  }
}

// Signup form validator
class SignupFormValidator extends BaseFormValidator {
  constructor(form) {
    super(form);
    this.passwordFieldId = 'password';
    this.confirmFieldId = 'confirm-password';
  }

  validateField(input) {
    const isValid = super.validateField(input);
    if (!isValid) return false;
    return this.validatePasswordField(input, this.confirmFieldId);
  }

  async submitForm() {
    const token = await this.getCaptchaToken('signup');
    await this.sendFormData(token);
  }
}

// Forgot Password form validator
class ForgotPasswordFormValidator extends BaseFormValidator {
  async submitForm() {
    const token = await this.getCaptchaToken('forgot_password');
    await this.sendFormData(token);
  }
}

// Reset Password form validator
class ResetPasswordFormValidator extends BaseFormValidator {
  constructor(form) {
    super(form);
    this.passwordFieldId = 'newPassword';
    this.confirmFieldId = 'confirmPassword';
    this.resetToken = this.form.querySelector('input[name="token"]');
  }

  validateField(input) {
    const isValid = super.validateField(input);
    if (!isValid) return false;
    return this.validatePasswordField(input, this.confirmFieldId);
  }

  async submitForm() {
    if (!this.resetToken || !this.resetToken.value) {
      throw new Error(ErrorMessages.INVALID_RESET_TOKEN);
    }
    const token = await this.getCaptchaToken('reset_password');
    await this.sendFormData(token);
  }
}

// Add mixins to validator classes
Object.assign(SignupFormValidator.prototype, PasswordValidationMixin);
Object.assign(ResetPasswordFormValidator.prototype, PasswordValidationMixin);

// Add form submission methods to both validator classes
Object.assign(LoginFormValidator.prototype, FormSubmissionMixin);
Object.assign(SignupFormValidator.prototype, FormSubmissionMixin);
Object.assign(ForgotPasswordFormValidator.prototype, FormSubmissionMixin);
Object.assign(ResetPasswordFormValidator.prototype, FormSubmissionMixin);

// Token display functionality
class TokenDisplay {
  static init() {
    document.querySelectorAll('.copy-button').forEach((button) => {
      button.addEventListener('click', () => {
        const tokenText =
          button.parentElement.querySelector('code').textContent;

        navigator.clipboard
          .writeText(tokenText)
          .then(() => {
            const originalHTML = button.innerHTML;
            button.textContent = 'Copied!';
            setTimeout(() => {
              button.innerHTML = originalHTML;
            }, 2000);
          })
          .catch(() => {
            button.textContent = 'Failed to copy';
            setTimeout(() => {
              button.innerHTML = originalHTML;
            }, 2000);
          });
      });
    });
  }
}

// Initialize forms and token display on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });
  }

  // Password toggle functionality
  const toggleButtons = document.querySelectorAll('.password-toggle');
  toggleButtons.forEach((toggleButton) => {
    toggleButton.addEventListener('click', () => {
      const input = toggleButton.parentNode.querySelector('input');
      const isPasswordVisible = input.type === 'text';
      input.type = isPasswordVisible ? 'password' : 'text';
      toggleButton.classList.toggle('active', !isPasswordVisible);
      toggleButton.setAttribute(
        'aria-label',
        isPasswordVisible ? 'Show password' : 'Hide password',
      );
    });
  });

  // Initialize forms
  new SocialAuthManager();
  document.querySelectorAll('form').forEach((form) => {
    let validator;
    if (form.action.includes('login')) {
      validator = new LoginFormValidator(form);
    } else if (form.action.includes('signup')) {
      validator = new SignupFormValidator(form);
    } else if (form.action.includes('forgot-password')) {
      validator = new ForgotPasswordFormValidator(form);
    } else if (form.action.includes('reset-password')) {
      validator = new ResetPasswordFormValidator(form);
    }

    if (validator) {
      form.addEventListener('submit', (event) => validator.handleSubmit(event));
    }
  });

  // Initialize token display if on token display page
  if (document.querySelector('.token-display')) {
    TokenDisplay.init();
  }
});
