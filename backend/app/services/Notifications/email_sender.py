import smtplib
from email.mime.text import MIMEText
from app.core.config import settings


def send_email(to_address: str, subject: str, body: str) -> bool:
    """
    Sends a plain-text email via Gmail's SMTP server, using an app
    password. Returns True/False rather than raising, since a failed
    email send shouldn't crash the whole notification job -- the in-app
    notification still gets created either way.
    """
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = settings.gmail_address
    msg["To"] = to_address

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  # upgrades the connection to encrypted -- required by Gmail
            server.login(settings.gmail_address, settings.gmail_app_password)
            server.sendmail(settings.gmail_address, [to_address], msg.as_string())
        return True
    except Exception as e:
        print(f"Email send failed for {to_address}: {e}")
        return False