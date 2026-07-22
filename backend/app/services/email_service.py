import asyncio
import logging
from email.message import EmailMessage

import aiosmtplib

from app.config import settings

logger = logging.getLogger("email_service")


def _build_reset_email_html(reset_link: str) -> str:
    return f"""
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #4f46e5; margin-bottom: 8px;">Reset your password</h2>
      <p style="color: #374151; line-height: 1.6;">
        We received a request to reset your TaskFlow AI password. Click the button below to choose a new one.
      </p>
      <a href="{reset_link}"
         style="display:inline-block; background:#4f46e5; color:#ffffff; padding:12px 24px;
                border-radius:8px; text-decoration:none; font-weight:600; margin:16px 0;">
        Reset Password
      </a>
      <p style="color:#9ca3af; font-size:13px; line-height:1.5;">
        This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    """


async def send_password_reset_email(to_email: str, reset_token: str) -> None:
    reset_link = f"{settings.frontend_url}/reset-password?token={reset_token}"

    message = EmailMessage()
    message["From"] = settings.email_from
    message["To"] = to_email
    message["Subject"] = "Reset your TaskFlow AI password"
    message.set_content("Please view this email in an HTML-compatible client.")
    message.add_alternative(_build_reset_email_html(reset_link), subtype="html")

    try:
        await asyncio.wait_for(
            aiosmtplib.send(
                message,
                hostname=settings.smtp_host,
                port=settings.smtp_port,
                username=settings.smtp_username,
                password=settings.smtp_password,
                start_tls=True,
            ),
            timeout=15,
        )
    except asyncio.TimeoutError:
        logger.error("Timed out sending password reset email to %s", to_email)
    except Exception:
        logger.exception("Failed to send password reset email to %s", to_email)