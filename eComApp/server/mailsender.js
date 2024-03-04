const Mailjet = require('node-mailjet');
const mailjet = new Mailjet({
    apiKey: '5115abf08056fbf3d4a5be6d281580f4',
    apiSecret: '3a8df09fdaaf6e83cc2b3b197a46b9fe'
});
// Function to send email using Mailjet
const sendEmail = async (recipientEmail, subject, text) => {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: 'ecommercewebsite13@gmail.com',
                    Name: 'EComApp',
                },
                To: [
                    {
                        Email: recipientEmail,
                    },
                ],
                Subject: subject,
                TextPart: text,
            },
        ],
    });

    try {
        const response = await request;
        console.log('Email sent successfully:', response.body);
        return response.body;
    } catch (error) {
        console.error('Error sending email:', error.statusCode, error.message);
    }
};


module.exports = sendEmail;