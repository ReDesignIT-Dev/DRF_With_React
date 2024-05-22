import smtplib
from django.conf import settings
import ssl
from email.message import EmailMessage
from collections import namedtuple

class EmailSender:
    def __init__(self, port=None, smtp_server=None, credentials=None, ssl_enabled=None):
        self.port = port
        self.smtp_server = smtp_server
        self.credentials = credentials
        self.ssl_enabled = ssl_enabled

        if credentials is None:
            Credentials = namedtuple('Credentials', 'username, password')
            self.credentials = Credentials(settings.EMAIL, settings.EMAIL_PASSWORD)
        else:
            if self.credentials.username is None:
                self.credentials.username = settings.EMAIL
            if self.credentials.password is None:
                self.credentials.password = settings.EMAIL_PASSWORD

        self.msg = EmailMessage()

        if self.port is None:
            self.port = settings.EMAIL_PORT
        if self.smtp_server is None:
            self.smtp_server = settings.EMAIL_SMTP
        if self.ssl_enabled is None:
            self.ssl_enabled = settings.EMAIL_SSL_ENABLED

        self.msg['From'] = self.credentials.username

    def __enter__(self):
        if self.ssl_enabled:
            context = ssl.create_default_context()
            self.connection = smtplib.SMTP_SSL(self.smtp_server, self.port, context=context)
        else:
            self.connection = smtplib.SMTP(self.smtp_server, self.port)

        self.connection.connect(self.smtp_server, self.port)
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
