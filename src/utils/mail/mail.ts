import nodemailer from "nodemailer";
import {
  EMAIL_SMTP_SECURE,
  EMAIL_SMTP_PASS,
  EMAIL_SMTP_USER,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_SERVICE_NAME,
} from "../env";
import ejs from "ejs";
import path from "path";

const transporter = nodemailer.createTransport({
  service: EMAIL_SMTP_SERVICE_NAME,
  host: EMAIL_SMTP_HOST,
  port: EMAIL_SMTP_PORT,
  secure: EMAIL_SMTP_SECURE,
  auth: {
    user: EMAIL_SMTP_USER,
    pass: EMAIL_SMTP_PASS,
  },
  requireTLS: true,
});

export interface ISendMail {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const sendmail = async ({ ...mailParams }: ISendMail) => {
  const result = await transporter.sendMail({
    ...mailParams,
  });

  return result;
};

const renderMailHtml = async (template: string, data: any): Promise<string> => {
  const content = await ejs.renderFile(
    path.join(__dirname, `templates/${template}`),
    data
  );

  return content as string;
};

export { sendmail, renderMailHtml };
