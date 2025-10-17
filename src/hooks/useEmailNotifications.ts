import { supabase } from '@/integrations/supabase/client';

interface EmailTemplate {
  subject: string;
  html: string;
}

export const useEmailNotifications = () => {
  const sendEmail = async (
    to: string,
    type: 'interaction' | 'message' | 'review' | 'payment' | 'budget_depleted',
    data: any
  ) => {
    const template = getEmailTemplate(type, data);

    try {
      const { data: result, error } = await supabase.functions.invoke('send-email-notification', {
        body: {
          to,
          subject: template.subject,
          html: template.html,
          type,
        },
      });

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const getEmailTemplate = (type: string, data: any): EmailTemplate => {
    switch (type) {
      case 'interaction':
        return {
          subject: 'New Interaction on Your Ad',
          html: `
            <h2>Your ad received a new interaction!</h2>
            <p>Ad: <strong>${data.adTitle}</strong></p>
            <p>Type: ${data.interactionType}</p>
            <p>Time: ${new Date(data.timestamp).toLocaleString()}</p>
            <a href="${data.link}">View Details</a>
          `,
        };

      case 'budget_depleted':
        return {
          subject: 'Ad Budget Depleted - Ad Deactivated',
          html: `
            <h2>Your ad budget has been depleted</h2>
            <p>Ad: <strong>${data.adTitle}</strong></p>
            <p>Your ad has been automatically deactivated.</p>
            <p>Total spent: ${data.totalSpent} coins</p>
            <a href="${data.link}">Add More Budget</a>
          `,
        };

      case 'message':
        return {
          subject: 'New Message Received',
          html: `
            <h2>You have a new message</h2>
            <p>From: <strong>${data.senderName}</strong></p>
            <p>${data.preview}</p>
            <a href="${data.link}">Read Message</a>
          `,
        };

      case 'review':
        return {
          subject: 'New Review on Your Profile',
          html: `
            <h2>You received a new review!</h2>
            <p>Rating: ${'⭐'.repeat(data.rating)}</p>
            <p>${data.reviewText}</p>
            <a href="${data.link}">View Review</a>
          `,
        };

      default:
        return {
          subject: 'Notification from Viral',
          html: '<p>You have a new notification.</p>',
        };
    }
  };

  return { sendEmail };
};
