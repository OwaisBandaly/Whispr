import transporter from "../config/nodemailer.config.js";
import {
  getEmailTemplate,
  getWelcomeEmailTemplate,
  getPasswordResetSuccessTemplate,
  getResetPasswordEmail,
} from "./mailTemplates.js";

export const VerifyEmailMail = async (user, verificationUrl) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user?.email,
      subject: "Verify your email",
      html: getEmailTemplate({
        username: user?.username,
        verificationLink: verificationUrl,
      }),
    });
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const VerifyEmailSuccessMail = async (user) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user?.email,
      subject: "Email Verified Successfully",
      html: getWelcomeEmailTemplate(user?.username),
    });
    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export const PasswordResetSuccessMail = async (user) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user?.email,
      subject: "Password Reset Successfull",
      html: getPasswordResetSuccessTemplate({ username: user?.username }),
    });
    console.log("success email sent successfully");
  } catch (error) {
    console.error("Error sending success email:", error);
  }
};

export const ForgerPasswordLinkMail = async (user, resetLink) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user?.email,
      subject: "Reset Password Link",
      html: getResetPasswordEmail({
        username: user.username,
        resetLink: resetLink,
      }),
    });
    console.log("Password Reset link sent successfully");
  } catch (error) {
    console.error("Error sending Reset Link:", error);
  }
};
