import smtplib
import os
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

EMAIL_REMITENTE = os.getenv("EMAIL_REMITENTE")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def enviar_codigo_verificacion(destinatario: str, codigo: str) -> bool:
    """
    Envía un correo con el código de verificación de 6 dígitos
    usando el servidor SMTP de Gmail.
    """
    try:
        mensaje = MIMEText(f"Tu código de verificación es: {codigo}\n\nExpira en 10 minutos.")
        mensaje["Subject"] = "Código de verificación - Sabores Compartidos"
        mensaje["From"] = EMAIL_REMITENTE
        mensaje["To"] = destinatario

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_REMITENTE, EMAIL_PASSWORD)
            server.sendmail(EMAIL_REMITENTE, destinatario, mensaje.as_string())

        return True
    except Exception as e:
        print(f"Error al enviar correo: {e}")
        return False