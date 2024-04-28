import { Resend } from 'resend';

export const email = new Resend(process.env.RESEND_TOKEN);
