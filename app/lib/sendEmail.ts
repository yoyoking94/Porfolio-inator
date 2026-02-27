'use server';

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendContactEmail(formData: FormData) {

    console.log('🔥 FORM DATA:', Object.fromEntries(formData));  // ← Log champs

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    console.log('📧 ENV:', {
        hasApiKey: !!process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM_EMAIL,
        toEmail: process.env.RESEND_TO_EMAIL,
    });

    if (!name || !email || !subject || !message) {
        return { error: 'Tous les champs sont requis.' };
    }

    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: [process.env.RESEND_TO_EMAIL!],
            subject: `Portfolio: ${subject}`,
            html: `
                <!DOCTYPE html>
                    <html>
                        <head><meta charset="UTF-8"></head>
                        <body style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h2 style="color: #333;">📧 Nouveau message portfolio</h2>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <p><strong>👤 Expéditeur :</strong> ${name}</p>
                                <p><strong>📧 Email :</strong> <a href="mailto:${email}">${email}</a></p>
                                <p><strong>📋 Sujet :</strong> ${subject}</p>
                                <hr style="border: 1px solid #eee;">
                                <p><strong>💬 Message :</strong></p>
                            <div style="background: white; padding: 15px; border-left: 4px solid #007bff; white-space: pre-line;">${message}</div>
                        </div>
                        <p style="color: #666; font-size: 12px;">Envoyé via portfolio - ${new Date().toLocaleString('fr-FR')}</p>
                        </body>
                    </html>
            `,
        });
        return { success: true };
    } catch (error) {
        const resendError = error as { message?: string; code?: string };
        console.error('Erreur Resend:', resendError.message || error);
        return {
            error: resendError.code === 'INVALID_FROM'
                ? 'Erreur configuration email. Contacte l\'admin.'
                : 'Erreur envoi. Réessaie plus tard.'
        };
    }
}
