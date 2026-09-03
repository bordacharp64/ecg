import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null = null;

function transporter(): Transporter | null {
  const host = process.env.SMTP_HOST?.trim();
  // Sans SMTP configure (developpement), on n'envoie rien : le message est
  // ecrit dans la console du serveur, lien de connexion inclus.
  if (!host) return null;

  if (!cached) {
    cached = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD ?? "",
          }
        : undefined,
    });
  }

  return cached;
}

type Mail = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendMail({ to, subject, text, html }: Mail): Promise<void> {
  const transport = transporter();
  const from = process.env.MAIL_FROM ?? "Bibliothèque ECG <no-reply@localhost>";

  if (!transport) {
    console.info(
      [
        "",
        "──────────── E-MAIL NON ENVOYÉ (SMTP non configuré) ────────────",
        `À       : ${to}`,
        `Objet   : ${subject}`,
        "",
        text,
        "────────────────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );
    return;
  }

  await transport.sendMail({ from, to, subject, text, html });
}

const BRAND_NAVY = "#044251";
const BRAND_TEAL = "#086d84";

/** Gabarit HTML sobre, compatible avec les clients de messagerie usuels. */
function layout(body: string): string {
  return `<!doctype html>
<html lang="fr">
<body style="margin:0;padding:24px;background:#f3f8fa;font-family:Lato,Helvetica,Arial,sans-serif;color:${BRAND_NAVY}">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #d7e6ea">
    <tr>
      <td style="background:${BRAND_NAVY};padding:20px 28px;color:#ffffff;font-size:15px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">
        Bibliothèque ECG &middot; IHU Liryc
      </td>
    </tr>
    <tr><td style="padding:28px">${body}</td></tr>
    <tr>
      <td style="padding:18px 28px;background:#f3f8fa;font-size:12px;line-height:1.5;color:#5b7c85">
        IHU Liryc &mdash; Institut de rythmologie et modélisation cardiaque<br>
        Vous recevez ce message parce qu'une inscription ou une connexion a été
        demandée avec cette adresse. Si ce n'est pas vous, ignorez cet e-mail.
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:24px 0">
    <a href="${href}" style="display:inline-block;background:${BRAND_TEAL};color:#ffffff;font-weight:700;text-decoration:none;padding:13px 26px">${label}</a>
  </p>`;
}

export async function sendLoginLink(options: {
  to: string;
  firstName: string;
  url: string;
  isNewAccount: boolean;
}): Promise<void> {
  const { to, firstName, url, isNewAccount } = options;

  const intro = isNewAccount
    ? `<p>Bonjour ${firstName},</p>
       <p>Votre inscription à la bibliothèque ECG de l'IHU Liryc est enregistrée.
       Il reste une étape : confirmer votre adresse e-mail pour accéder aux ouvrages.</p>`
    : `<p>Bonjour ${firstName},</p>
       <p>Voici votre lien de connexion à la bibliothèque ECG de l'IHU Liryc.</p>`;

  const label = isNewAccount
    ? "Confirmer mon adresse et accéder aux ouvrages"
    : "Accéder à la bibliothèque";

  const html = layout(
    `${intro}${button(url, label)}
     <p style="font-size:13px;color:#5b7c85">Ce lien est valable 30 minutes et ne
     peut être utilisé qu'une seule fois. Si le bouton ne fonctionne pas, copiez
     cette adresse dans votre navigateur :<br>
     <span style="word-break:break-all">${url}</span></p>`,
  );

  const text = [
    `Bonjour ${firstName},`,
    "",
    isNewAccount
      ? "Votre inscription à la bibliothèque ECG de l'IHU Liryc est enregistrée. Confirmez votre adresse e-mail pour accéder aux ouvrages :"
      : "Voici votre lien de connexion à la bibliothèque ECG de l'IHU Liryc :",
    "",
    url,
    "",
    "Ce lien est valable 30 minutes et à usage unique.",
  ].join("\n");

  await sendMail({
    to,
    subject: isNewAccount
      ? "Confirmez votre inscription à la bibliothèque ECG"
      : "Votre lien de connexion à la bibliothèque ECG",
    text,
    html,
  });
}
