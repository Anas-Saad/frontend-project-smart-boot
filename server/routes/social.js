import express from 'express';
import { body, validationResult } from 'express-validator';
import axios from 'axios';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Facebook webhook verification
router.get('/facebook/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN || 'qline_verify_token';
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Facebook webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Facebook webhook handler
router.post('/facebook/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const body = JSON.parse(req.body);
  
  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0];
      console.log('Facebook webhook event:', webhookEvent);
      
      // Process the message/event
      if (webhookEvent.message) {
        handleFacebookMessage(webhookEvent);
      } else if (webhookEvent.postback) {
        handleFacebookPostback(webhookEvent);
      }
    });
    
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Instagram webhook handler
router.post('/instagram/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const body = JSON.parse(req.body);
  
  if (body.object === 'instagram') {
    body.entry.forEach((entry) => {
      const changes = entry.changes || [];
      changes.forEach((change) => {
        console.log('Instagram webhook event:', change);
        
        if (change.field === 'comments') {
          handleInstagramComment(change.value);
        } else if (change.field === 'messages') {
          handleInstagramMessage(change.value);
        }
      });
    });
    
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Send Facebook message
router.post('/facebook/send-message', authMiddleware, [
  body('pageId').notEmpty().withMessage('Page ID is required'),
  body('recipientId').notEmpty().withMessage('Recipient ID is required'),
  body('message').notEmpty().withMessage('Message is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        errorAr: 'فشل في التحقق من البيانات',
        details: errors.array()
      });
    }

    const { pageId, recipientId, message, accessToken } = req.body;

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${pageId}/messages`,
      {
        recipient: { id: recipientId },
        message: { text: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      message: 'Message sent successfully',
      messageAr: 'تم إرسال الرسالة بنجاح',
      messageId: response.data.message_id
    });

  } catch (error) {
    console.error('Send Facebook message error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      errorAr: 'فشل في إرسال الرسالة'
    });
  }
});

// Get Facebook page insights
router.get('/facebook/insights/:pageId', authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { accessToken } = req.query;

    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}/insights`,
      {
        params: {
          metric: 'page_fans,page_impressions,page_engaged_users',
          access_token: accessToken
        }
      }
    );

    res.json({
      insights: response.data.data,
      pageId
    });

  } catch (error) {
    console.error('Get Facebook insights error:', error);
    res.status(500).json({
      error: 'Failed to get insights',
      errorAr: 'فشل في جلب الإحصائيات'
    });
  }
});

// Handle Facebook message
async function handleFacebookMessage(webhookEvent) {
  const senderId = webhookEvent.sender.id;
  const pageId = webhookEvent.recipient.id;
  const message = webhookEvent.message.text;

  console.log(`Received message from ${senderId} to page ${pageId}: ${message}`);

  // Here you would:
  // 1. Find the bot associated with this page
  // 2. Process the message with AI
  // 3. Generate and send response
  // 4. Update analytics

  // For now, just log the event
}

// Handle Facebook postback
async function handleFacebookPostback(webhookEvent) {
  const senderId = webhookEvent.sender.id;
  const pageId = webhookEvent.recipient.id;
  const payload = webhookEvent.postback.payload;

  console.log(`Received postback from ${senderId} to page ${pageId}: ${payload}`);

  // Handle postback actions (button clicks, etc.)
}

// Handle Instagram comment
async function handleInstagramComment(commentData) {
  console.log('Instagram comment:', commentData);

  // Process Instagram comment
  // 1. Check if comment needs moderation
  // 2. Generate AI response if appropriate
  // 3. Update analytics
}

// Handle Instagram message
async function handleInstagramMessage(messageData) {
  console.log('Instagram message:', messageData);

  // Process Instagram direct message
  // Similar to Facebook message handling
}

export default router;