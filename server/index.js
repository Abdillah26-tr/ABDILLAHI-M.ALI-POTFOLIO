import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'

const app = express()
const port = process.env.PORT || 3001
const allowedOrigin = process.env.CLIENT_URL || '*'

app.use(cors({ origin: allowedOrigin }))
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'abdillahi-portfolio-api' })
})

app.post('/api/contact', async (request, response) => {
  const { name, email, message } = request.body || {}
  const senderName = typeof name === 'string' ? name.trim() : ''
  const senderEmail = typeof email === 'string' ? email.trim() : ''
  const senderMessage = typeof message === 'string' ? message.trim() : ''

  if (!senderName || !senderEmail || !senderMessage) {
    return response.status(400).json({ error: 'Name, email, and message are required.' })
  }

  if (senderName.length > 120 || senderMessage.length > 5000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
    return response.status(400).json({ error: 'Please provide a valid email and keep your message under 5000 characters.' })
  }

  const { SMTP_HOST, SMTP_PORT = '587', SMTP_SECURE = 'false', SMTP_USER, SMTP_PASS } = process.env
  const recipient = process.env.CONTACT_EMAIL || 'abdillahmohammed2001@gmail.com'

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return response.status(503).json({ error: 'Email delivery is not configured yet.' })
  }

  const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character])

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === 'true',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    await transporter.sendMail({
      from: `Portfolio contact form <${SMTP_USER}>`,
      to: recipient,
      replyTo: senderEmail,
      subject: `Portfolio message from ${senderName.replace(/[\r\n]/g, ' ')}`,
      text: `Name: ${senderName}\nEmail: ${senderEmail}\n\n${senderMessage}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(senderName)}</p><p><strong>Email:</strong> ${escapeHtml(senderEmail)}</p><p>${escapeHtml(senderMessage).replace(/\n/g, '<br>')}</p>`,
    })

    return response.status(201).json({ message: 'Your message was sent successfully.' })
  } catch (error) {
    console.error('Unable to send portfolio contact email:', error.message)
    return response.status(502).json({ error: 'Email could not be sent. Please try again later.' })
  }
})

app.listen(port, () => {
  console.log(`Portfolio API running on port ${port}`)
})
