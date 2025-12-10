const axios = require('axios');
const nodemailer = require('nodemailer');

const sendWhatsAppReply = async (phoneNumber, message) => {
    try {
        const token = process.env.WHATSAPP_API_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_ID;

        if (!token || !phoneId) {
            console.warn('WhatsApp API credentials missing. Skipping WhatsApp reply.');
            return;
        }

        const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;

        await axios.post(
            url,
            {
                messaging_product: 'whatsapp',
                to: phoneNumber,
                type: 'text',
                text: { body: message },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('WhatsApp auto-reply sent to:', phoneNumber);
    } catch (error) {
        console.error('Error sending WhatsApp reply:', error.response ? error.response.data : error.message);
    }
};

const sendEmailReply = async (email, message) => {
    try {
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
            console.warn('SMTP credentials missing. Skipping email reply.');
            return;
        }

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort == 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        await transporter.sendMail({
            from: `"Sanwaliya Photo Studio" <${smtpUser}>`, // Use authenticated user as sender
            to: email,
            subject: 'Thank you for contacting Sanwaliya Photo Studio',
            text: message,
        });

        console.log('Email auto-reply sent to:', email);
    } catch (error) {
        console.error('Error sending email reply:', error.message);
    }
};

module.exports = {
    sendWhatsAppReply,
    sendEmailReply,
};
