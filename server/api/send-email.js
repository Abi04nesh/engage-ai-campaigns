
// This file should be on your server, NOT in your frontend code
// The API endpoint should be protected with proper authentication

const express = require('express');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();

// In-memory database (replace with a real database in production)
const db = {
  users: [],
  campaigns: [],
  subscribers: [],
  templates: [],
  events: [],
  activities: []
};

// Configure AWS - IMPORTANT: In production, use environment variables
// These values should NEVER be hardcoded in your application code
// This is just for demonstration purposes
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY; // Get from environment
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY; // Get from environment
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret'; // Use a strong secret in production

// Configure AWS SDK
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION
});

// Create SES service object
const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// Configure express middleware
router.use(cors());
router.use(bodyParser.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    req.user = user;
    next();
  });
};

// Log activity
const logActivity = (userId, action, entityType, entityId = null, details = {}) => {
  const activity = {
    id: uuidv4(),
    userId,
    action,
    entityType,
    entityId,
    details,
    timestamp: new Date().toISOString()
  };
  
  db.activities.push(activity);
  return activity;
};

// Auth routes
router.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    
    // Check if user already exists
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    
    // Create JWT token
    const userForToken = { id: newUser.id, email: newUser.email };
    const token = jwt.sign(userForToken, JWT_SECRET, { expiresIn: '24h' });
    
    // Log activity
    logActivity(newUser.id, 'signup', 'auth');
    
    // Return user data (without password) and token
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating user account',
      error: error.message
    });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = db.users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Create JWT token
    const userForToken = { id: user.id, email: user.email };
    const token = jwt.sign(userForToken, JWT_SECRET, { expiresIn: '24h' });
    
    // Log activity
    logActivity(user.id, 'login', 'auth');
    
    // Return user data (without password) and token
    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

// Email sending route
router.post('/email/send', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
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
    
    // Log activity
    logActivity(userId, 'send_email', 'email', result.MessageId, {
      recipients: toAddresses,
      subject
    });
    
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

// Campaign routes
router.get('/campaigns', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const userCampaigns = db.campaigns.filter(c => c.userId === userId);
  
  res.json({
    success: true,
    campaigns: userCampaigns
  });
});

router.get('/campaigns/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const campaignId = req.params.id;
  
  const campaign = db.campaigns.find(c => c.id === campaignId && c.userId === userId);
  
  if (!campaign) {
    return res.status(404).json({
      success: false,
      message: 'Campaign not found'
    });
  }
  
  res.json({
    success: true,
    campaign
  });
});

router.post('/campaigns', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, subject, content, sendAt, templateId } = req.body;
  
  if (!name || !subject || !content) {
    return res.status(400).json({
      success: false,
      message: 'Name, subject, and content are required'
    });
  }
  
  const newCampaign = {
    id: uuidv4(),
    name,
    subject,
    content,
    status: 'draft',
    sendAt: sendAt || null,
    sentAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId,
    templateId: templateId || null
  };
  
  db.campaigns.push(newCampaign);
  
  // Log activity
  logActivity(userId, 'create_campaign', 'campaign', newCampaign.id);
  
  res.status(201).json({
    success: true,
    message: 'Campaign created successfully',
    campaign: newCampaign
  });
});

router.put('/campaigns/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const campaignId = req.params.id;
  const updateData = req.body;
  
  // Find campaign index
  const campaignIndex = db.campaigns.findIndex(c => c.id === campaignId && c.userId === userId);
  
  if (campaignIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Campaign not found'
    });
  }
  
  // Don't allow updating sent campaigns
  if (['sending', 'sent'].includes(db.campaigns[campaignIndex].status) && updateData.content) {
    return res.status(400).json({
      success: false,
      message: 'Cannot modify content of sent or sending campaigns'
    });
  }
  
  // Update campaign
  const updatedCampaign = {
    ...db.campaigns[campaignIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  db.campaigns[campaignIndex] = updatedCampaign;
  
  // Log activity
  logActivity(userId, 'update_campaign', 'campaign', campaignId);
  
  res.json({
    success: true,
    message: 'Campaign updated successfully',
    campaign: updatedCampaign
  });
});

router.delete('/campaigns/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const campaignId = req.params.id;
  
  // Find campaign index
  const campaignIndex = db.campaigns.findIndex(c => c.id === campaignId && c.userId === userId);
  
  if (campaignIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Campaign not found'
    });
  }
  
  // Don't allow deleting sent campaigns (archive instead in a real app)
  if (['sending', 'sent'].includes(db.campaigns[campaignIndex].status)) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete sent or sending campaigns'
    });
  }
  
  // Remove campaign
  db.campaigns.splice(campaignIndex, 1);
  
  // Log activity
  logActivity(userId, 'delete_campaign', 'campaign', campaignId);
  
  res.json({
    success: true,
    message: 'Campaign deleted successfully'
  });
});

router.post('/campaigns/:id/send', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const campaignId = req.params.id;
  
  // Find campaign
  const campaignIndex = db.campaigns.findIndex(c => c.id === campaignId && c.userId === userId);
  
  if (campaignIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Campaign not found'
    });
  }
  
  const campaign = db.campaigns[campaignIndex];
  
  // Check if campaign can be sent
  if (['sending', 'sent'].includes(campaign.status)) {
    return res.status(400).json({
      success: false,
      message: 'Campaign has already been sent or is currently sending'
    });
  }
  
  try {
    // Update campaign status
    db.campaigns[campaignIndex] = {
      ...campaign,
      status: 'sending',
      updatedAt: new Date().toISOString()
    };
    
    // Get subscribers
    const subscribers = db.subscribers.filter(s => s.userId === userId && s.status === 'active');
    
    if (subscribers.length === 0) {
      db.campaigns[campaignIndex] = {
        ...db.campaigns[campaignIndex],
        status: 'failed',
        updatedAt: new Date().toISOString()
      };
      
      return res.json({
        success: false,
        message: 'No active subscribers to send to'
      });
    }
    
    // Set recipientCount
    db.campaigns[campaignIndex].recipientCount = subscribers.length;
    
    // In a real app, this would be a background job
    // We're simulating it synchronously here for simplicity
    for (const subscriber of subscribers) {
      // Send email to each subscriber
      const params = {
        Source: process.env.DEFAULT_FROM_EMAIL || 'noreply@yourdomain.com',
        Destination: {
          ToAddresses: [subscriber.email],
        },
        Message: {
          Subject: {
            Data: campaign.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: campaign.content,
              Charset: 'UTF-8',
            },
          },
        },
      };
      
      try {
        const result = await ses.sendEmail(params).promise();
        
        // Log email event
        db.events.push({
          id: uuidv4(),
          messageId: result.MessageId,
          event: 'sent',
          timestamp: new Date().toISOString(),
          recipient: subscriber.email,
          campaignId: campaign.id
        });
      } catch (emailError) {
        console.error(`Error sending to ${subscriber.email}:`, emailError);
        // Log failed event
        db.events.push({
          id: uuidv4(),
          event: 'failed',
          timestamp: new Date().toISOString(),
          recipient: subscriber.email,
          campaignId: campaign.id,
          error: emailError.message
        });
      }
    }
    
    // Update campaign status
    db.campaigns[campaignIndex] = {
      ...db.campaigns[campaignIndex],
      status: 'sent',
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Log activity
    logActivity(userId, 'send_campaign', 'campaign', campaignId, {
      recipientCount: subscribers.length
    });
    
    return res.json({
      success: true,
      message: 'Campaign sent successfully',
      campaign: db.campaigns[campaignIndex]
    });
  } catch (error) {
    // Update campaign status to failed
    db.campaigns[campaignIndex] = {
      ...campaign,
      status: 'failed',
      updatedAt: new Date().toISOString()
    };
    
    console.error('Error sending campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send campaign',
      error: error.message
    });
  }
});

// Subscriber routes
router.get('/subscribers', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const userSubscribers = db.subscribers.filter(s => s.userId === userId);
  
  res.json({
    success: true,
    subscribers: userSubscribers
  });
});

router.get('/subscribers/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const subscriberId = req.params.id;
  
  const subscriber = db.subscribers.find(s => s.id === subscriberId && s.userId === userId);
  
  if (!subscriber) {
    return res.status(404).json({
      success: false,
      message: 'Subscriber not found'
    });
  }
  
  res.json({
    success: true,
    subscriber
  });
});

router.post('/subscribers', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { email, name, status = 'active', source = 'manual', metadata } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }
  
  // Check if subscriber already exists
  if (db.subscribers.find(s => s.email === email && s.userId === userId)) {
    return res.status(400).json({
      success: false,
      message: 'Subscriber with this email already exists'
    });
  }
  
  const newSubscriber = {
    id: uuidv4(),
    email,
    name: name || '',
    status,
    source,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId,
    metadata: metadata || {}
  };
  
  db.subscribers.push(newSubscriber);
  
  // Log activity
  logActivity(userId, 'create_subscriber', 'subscriber', newSubscriber.id);
  
  res.status(201).json({
    success: true,
    message: 'Subscriber created successfully',
    subscriber: newSubscriber
  });
});

router.post('/subscribers/import', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { data } = req.body;
  
  if (!data) {
    return res.status(400).json({
      success: false,
      message: 'CSV data is required'
    });
  }
  
  try {
    // Parse CSV
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const subscribers = [];
    const errors = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      if (values.length >= 2) { // At least email and name
        const email = values[0].trim();
        const name = values[1].trim() || '';
        
        // Check if subscriber already exists
        if (db.subscribers.find(s => s.email === email && s.userId === userId)) {
          errors.push(`Line ${i+1}: Subscriber with email ${email} already exists`);
          continue;
        }
        
        const newSubscriber = {
          id: uuidv4(),
          email,
          name,
          status: 'active',
          source: 'CSV Import',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId
        };
        
        db.subscribers.push(newSubscriber);
        subscribers.push(newSubscriber);
      } else {
        errors.push(`Line ${i+1}: Invalid format`);
      }
    }
    
    // Log activity
    logActivity(userId, 'import_subscribers', 'subscriber', null, {
      count: subscribers.length,
      errors: errors.length
    });
    
    res.json({
      success: true,
      message: `Imported ${subscribers.length} subscribers with ${errors.length} errors`,
      subscribers,
      errors
    });
  } catch (error) {
    console.error('Import error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to import subscribers',
      error: error.message
    });
  }
});

// Template routes
router.get('/templates', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const userTemplates = db.templates.filter(t => t.userId === userId);
  
  res.json({
    success: true,
    templates: userTemplates
  });
});

router.get('/templates/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const templateId = req.params.id;
  
  const template = db.templates.find(t => t.id === templateId && t.userId === userId);
  
  if (!template) {
    return res.status(404).json({
      success: false,
      message: 'Template not found'
    });
  }
  
  res.json({
    success: true,
    template
  });
});

router.post('/templates', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, content } = req.body;
  
  if (!name || !content) {
    return res.status(400).json({
      success: false,
      message: 'Name and content are required'
    });
  }
  
  const newTemplate = {
    id: uuidv4(),
    name,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId
  };
  
  db.templates.push(newTemplate);
  
  // Log activity
  logActivity(userId, 'create_template', 'template', newTemplate.id);
  
  res.status(201).json({
    success: true,
    message: 'Template created successfully',
    template: newTemplate
  });
});

// Analytics routes
router.get('/analytics/stats', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  // Get user's campaigns
  const userCampaigns = db.campaigns.filter(c => c.userId === userId).map(c => c.id);
  
  // Filter events for user's campaigns
  const userEvents = db.events.filter(e => userCampaigns.includes(e.campaignId));
  
  // Calculate stats
  const stats = {
    sent: userEvents.filter(e => e.event === 'sent').length,
    delivered: userEvents.filter(e => e.event === 'delivered').length,
    opened: userEvents.filter(e => e.event === 'opened').length,
    clicked: userEvents.filter(e => e.event === 'clicked').length,
    bounced: userEvents.filter(e => e.event === 'bounced').length,
    complained: userEvents.filter(e => e.event === 'complained').length
  };
  
  res.json({
    success: true,
    stats
  });
});

router.get('/analytics/events', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { campaignId, eventType, startDate, endDate, limit = 100 } = req.query;
  
  // Get user's campaigns
  const userCampaigns = db.campaigns.filter(c => c.userId === userId).map(c => c.id);
  
  // Filter events
  let userEvents = db.events.filter(e => userCampaigns.includes(e.campaignId));
  
  // Apply filters
  if (campaignId) {
    userEvents = userEvents.filter(e => e.campaignId === campaignId);
  }
  
  if (eventType) {
    userEvents = userEvents.filter(e => e.event === eventType);
  }
  
  if (startDate) {
    userEvents = userEvents.filter(e => new Date(e.timestamp) >= new Date(startDate));
  }
  
  if (endDate) {
    userEvents = userEvents.filter(e => new Date(e.timestamp) <= new Date(endDate));
  }
  
  // Sort by timestamp (newest first) and limit
  userEvents = userEvents
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, parseInt(limit));
  
  res.json({
    success: true,
    events: userEvents
  });
});

// Activity routes
router.get('/activity', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { limit = 10 } = req.query;
  
  // Get user's activities
  const userActivities = db.activities
    .filter(a => a.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, parseInt(limit));
  
  res.json({
    success: true,
    activities: userActivities
  });
});

// SES webhook endpoints for tracking
router.post('/webhooks/ses/notification', (req, res) => {
  try {
    const { Type, Message } = req.body;
    
    if (Type === 'SubscriptionConfirmation') {
      // Handle SES subscription confirmation
      console.log('Received SES subscription confirmation');
      res.status(200).send();
      return;
    }
    
    if (Type === 'Notification') {
      const notification = JSON.parse(Message);
      
      // Handle different event types
      if (notification.eventType === 'Bounce') {
        // Process bounce
        const bounceInfo = notification.bounce;
        const recipients = bounceInfo.bouncedRecipients.map(r => r.emailAddress);
        
        recipients.forEach(recipient => {
          // Find subscriber
          const subscriberIndex = db.subscribers.findIndex(s => s.email === recipient);
          
          if (subscriberIndex !== -1) {
            // Update subscriber status
            db.subscribers[subscriberIndex] = {
              ...db.subscribers[subscriberIndex],
              status: 'bounced',
              updatedAt: new Date().toISOString()
            };
            
            // Log event
            db.events.push({
              id: uuidv4(),
              messageId: notification.mail.messageId,
              event: 'bounced',
              timestamp: new Date().toISOString(),
              recipient,
              metadata: {
                bounceType: bounceInfo.bounceType,
                bounceSubType: bounceInfo.bounceSubType,
                diagnosticCode: bounceInfo.bouncedRecipients[0].diagnosticCode
              }
            });
          }
        });
      } else if (notification.eventType === 'Complaint') {
        // Process complaint
        const complaintInfo = notification.complaint;
        const recipients = complaintInfo.complainedRecipients.map(r => r.emailAddress);
        
        recipients.forEach(recipient => {
          // Find subscriber
          const subscriberIndex = db.subscribers.findIndex(s => s.email === recipient);
          
          if (subscriberIndex !== -1) {
            // Update subscriber status
            db.subscribers[subscriberIndex] = {
              ...db.subscribers[subscriberIndex],
              status: 'unsubscribed',
              updatedAt: new Date().toISOString()
            };
            
            // Log event
            db.events.push({
              id: uuidv4(),
              messageId: notification.mail.messageId,
              event: 'complained',
              timestamp: new Date().toISOString(),
              recipient,
              metadata: {
                complaintFeedbackType: complaintInfo.complaintFeedbackType
              }
            });
          }
        });
      } else if (notification.eventType === 'Delivery') {
        // Process delivery
        const deliveryInfo = notification.delivery;
        
        // Log delivery event
        db.events.push({
          id: uuidv4(),
          messageId: notification.mail.messageId,
          event: 'delivered',
          timestamp: new Date().toISOString(),
          recipient: notification.mail.destination[0],
          metadata: {
            processingTimeMillis: deliveryInfo.processingTimeMillis,
            smtpResponse: deliveryInfo.smtpResponse
          }
        });
      }
    }
    
    res.status(200).send();
  } catch (error) {
    console.error('Error processing SES webhook:', error);
    res.status(500).send();
  }
});

module.exports = router;
