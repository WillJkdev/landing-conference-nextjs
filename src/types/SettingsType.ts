export type UpdateEventSettingsState = {
  success: boolean;
  message: string;
};

export type UpdateUrlSettingsState = {
  success: boolean;
  message: string;
};

export type UpdateEmailSettingsState = {
  success: boolean;
  message: string;
};

export type UpdateSecuritySettingsState = {
  success: boolean;
  message: string;
};

export type EventSettingsForm = {
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  maxAttendees: number;
  ticketPrice: number;
  currency: string;
  durationDays: number;
};

export type UrlSettingsForm = {
  confirmationUrl: string;
  presentationUrl: string;
  websiteUrl: string;
};

export type EmailSettingsForm = {
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  enableReminders: boolean;
  reminderDays: number;
};

export type SecuritySettingsForm = {
  requireEmailVerification: boolean;
  enableTwoFactor: boolean;
  sessionTimeout: number;
};
