import nodemailer from "nodemailer";
import path from "path";
import { readFile } from "../../functions/file-manager";

const pinTemplatePath = path.join(__dirname, "../templates/pin.html");
const activateAccountTemplatePath = path.join(
  __dirname,
  "../templates/activate_account.html"
);

const sendEmail = async (
  email: string,
  subject: string,
  text: string,
  isForPin: boolean
) => {
  try {
    const template = await readFile(
      isForPin ? pinTemplatePath : activateAccountTemplatePath
    );
    const html = template.replace("{{text}}", text);
    await emailConfigurations(email, subject, html);
  } catch (error) {
    return error;
  }
};

const emailConfigurations = async (
  email: string,
  subject: string,
  html: string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.SECURE),
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: html,
  });
};

export default sendEmail;
