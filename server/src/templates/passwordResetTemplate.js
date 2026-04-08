export function passwordResetTemplate({ otpCode }) {
  return `
    <!doctype html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8" />
        <title>Password Reset - ScreenGuardian</title>
        <style>
          body {
            direction: ltr;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 480px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            padding: 24px 24px 32px;
            box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
          }
          .header {
            text-align: center;
            margin-bottom: 24px;
          }
          .title {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 8px;
          }
          .subtitle {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
          }
          .content {
            font-size: 14px;
            color: #374151;
            line-height: 1.7;
            margin-bottom: 24px;
          }
          .otp-wrapper {
            text-align: center;
            margin: 24px 0;
          }
          .otp-code {
            display: inline-block;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 8px;
            padding: 12px 24px;
            border-radius: 12px;
            background: #111827;
            color: #ffffff;
          }
          .meta {
            font-size: 12px;
            color: #9ca3af;
            text-align: center;
          }
          a {
            color: #4f46e5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">Password reset</h1>
            <p class="subtitle">We received a request to reset the password for your ScreenGuardian account.</p>
          </div>
          <div class="content">
            <p>If you made this request, use the code below in the app to set a new password.</p>
            <p>This code will be active for 1 hour.</p>
          </div>
          <div class="otp-wrapper">
            <div class="otp-code">
              ${otpCode}
            </div>
          </div>
          <p class="meta">
            If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
}

