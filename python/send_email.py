import smtplib
from email.message import EmailMessage

msg = EmailMessage()
msg['Subject'] = 'Test Mail from Python'
msg['From'] = 'noreply@turuncuaractakip.com'
msg['To'] = 'isik-deniz@envepo.com'
msg.set_content('Python email test via Mailgun.')

with smtplib.SMTP('smtp.mailgun.org', 587) as smtp:
    smtp.set_debuglevel(1)
    smtp.ehlo()
    smtp.starttls()
    smtp.ehlo()
    smtp.login('takipturuncupro@mg.envepo.com', '') # I am deleting the second argument since it is the password.
    smtp.send_message(msg)

