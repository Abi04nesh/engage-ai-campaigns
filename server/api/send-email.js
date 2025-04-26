
// This file should be on your server, NOT in your frontend code
// The API endpoint should be protected with proper authentication

const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

// Configure AWS - IMPORTANT: In production, use environment variables
// These values should NEVER be hardcoded in your application code
// This is just for demonstration purposes
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY; // Get from environment
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY; // Get from environment
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

// Configure AWS SDK
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION
});

// Create SES service object
const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// Email sending route
router.post('/send-email', async (req, res) => {
  try {
    // Authentication check should be here
    // Only authenticated users should be allowed to send emails
    
    const { to, subject, html, from } = req.body;
    
    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, or html body',
      });
    }
    
    // Prepare recipients
    const toAddresses = Array.isArray(to) ? to : [to];
    
    // Default sender address (verified in SES)
    const sourceEmail = from || process.env.DEFAULT_FROM_EMAIL || 'noreply@yourdomain.com';
    
    // Set up email parameters
    const params = {
      Source: sourceEmail,
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: html,
            Charset: 'UTF-8',
          },
        },
      },
    };
    
    // Send the email
    const result = await ses.sendEmail(params).promise();
    
    return res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.MessageId,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
});

module.exports = router;
