import smtplib
import ssl
from email.message import EmailMessage
from os import getenv
from dotenv import load_dotenv


class EmailSender:
    def __init__(self, port, smtp_server, credentials, ssl_enabled=False):
        load_dotenv()
        self.port = port
        self.smtp_server = smtp_server
        self.credentials = credentials
        self.ssl_enabled = ssl_enabled

        self.msg = EmailMessage()
        if self.credentials.username is None:
            self.credentials.username = getenv('EMAIL')
        if self.credentials.password is None:
            self.credentials.password = getenv('GMAIL_PASSWORD_FOR_APPLICATION')

        self.msg['From'] = self.credentials.username

    def __enter__(self):
        if not self.ssl_enabled:
            self.connection = smtplib.SMTP(self.smtp_server, self.port)
        else:
            context = ssl.create_default_context()
            self.connection = smtplib.SMTP_SSL(self.smtp_server, self.port, context=context)

        self.connection.login(self.credentials.username, self.credentials.password)

        return self

    def send_email(self, recipient, subject, message_content):
        self.msg['To'] = recipient
        self.msg.set_content(message_content)
        self.msg.add_alternative(message_content, subtype='html')
        self.msg['Subject'] = subject

        self.connection.send_message(self.msg)

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.connection.close()
