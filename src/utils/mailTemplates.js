
// HTML templates for sending email.

const getEmailTemplate = ({ username, verificationLink }) => {
  const year = new Date().getFullYear();
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f6f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      h2 {
        color: #333;
      }
      p {
        color: #555;
        line-height: 1.6;
      }
      .verify-btn {
        display: inline-block;
          margin: 10px;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Hello, ${username} 👋</h2>
      <p>Thank you for signing up! Please verify your email by clicking the button below:</p>
      <a href="${verificationLink}" class="verify-btn">Verify Email</a>
      <p>If you didn’t create an account, you can ignore this email.</p>
      <div class="footer">
        &copy; ${year} AuthCompany. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

const getWelcomeEmailTemplate = (username) => {
  const year = new Date().getFullYear();
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Welcome to Our App</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
          }
          h2 {
            color: #333;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .highlight {
            font-weight: bold;
            color: #007bff;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Welcome, <span class="highlight">${username}</span> 👋</h2>
          <p>We're thrilled to have you on board. 🎉</p>
          <p>You’ve successfully signed up. Get ready to explore all the amazing features we offer!</p>
          <p>If you have any questions, feel free to reply to this email. We're here to help.</p>
          <div class="footer">
            &copy; ${year} AuthCompany. All rights reserved.
          </div>
        </div>
      </body>
    </html>
    `;
};

const getResetPasswordEmail = ({ username, resetLink }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Password Reset</title>
  <style>
    body {
      background-color: #f4f4f4;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h2 {
      color: #333;
    }
    p {
      color: #555;
      line-height: 1.6;
    }
    .reset-btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background-color: #28a745;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hello, ${username} 👋</h2>
    <p>You recently requested to reset your password. Click the button below to proceed:</p>
    <a href="${resetLink}" class="reset-btn">Reset Password</a>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} AuthCompany. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

const getPasswordResetSuccessTemplate = ({
  username,
  year = new Date().getFullYear(),
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset Successful</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      color: #333;
    }
    h2 {
      color: #2c3e50;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #aaa;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hello, ${username} 👋</h2>
    <p>Your password has been successfully changed.</p>
    <p>If you did not perform this action, please contact our support immediately.</p>
    <div class="footer">
      &copy; ${year} AuthCompany. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export {
  getEmailTemplate,
  getWelcomeEmailTemplate,
  getResetPasswordEmail,
  getPasswordResetSuccessTemplate,
};
