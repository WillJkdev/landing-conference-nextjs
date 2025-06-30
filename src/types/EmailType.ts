export type EmailType =
  | "email.sent"
  | "email.delivered"
  | "email.delivery_delayed"
  | "email.complained"
  | "email.bounced"
  | "email.opened"
  | "email.clicked"
  | "email.failed";

export interface WebhookEvent {
  type: EmailType;
  created_at: string;
  data: EmailEventData;
}

export interface EmailEventData {
  created_at: string;
  email_id: string;
  from: string;
  to: string[];
  subject: string;

  // solo está presente en algunos eventos
  bounce?: {
    message: string;
    subType?: string;
    type: string; // Ej: "Permanent"
  };

  tags?: Record<string, string>;
}
