import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate the incoming payload
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Construct the Brevo API request
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY as string,
      },
      body: JSON.stringify({
        // 1. The sender MUST be the email address you used to sign up for Brevo
        sender: { name: 'Pritam-OS Systems', email: 'pritamkumarpoddar2002@gmail.com' }, 
        
        // 2. The replyTo is the person who actually filled out the form
        replyTo: { email: email, name: name }, 
        
        // 3. Where you want to receive the email
        to: [{ email: 'im.pritamk@gmail.com', name: 'Pritam' }], 
        
        subject: `[PRITAM-OS] New Transmission from ${name}`,
        
        // --- NEW PROFESSIONAL EMAIL TEMPLATE ---
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f5f7">
              <tr>
                <td align="center" style="padding: 40px 16px;">
                  
                  <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); max-width: 600px; width: 100%;">
                    
                    <tr>
                      <td bgcolor="#050505" style="padding: 24px 32px; border-bottom: 4px solid #10b981;">
                        <h1 style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0; letter-spacing: 1px;">
                          PRITAM-OS <span style="color: #10b981;">//</span> INBOUND TRANSMISSION
                        </h1>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 32px 32px 0 32px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding-bottom: 12px;">
                              <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Sender Details</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #f8fafc; border-radius: 6px; padding: 16px; border: 1px solid #e2e8f0;">
                              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                  <td width="60" style="font-size: 14px; color: #64748b; font-weight: 500;">Name:</td>
                                  <td style="font-size: 15px; color: #0f172a; font-weight: 600;">${name}</td>
                                </tr>
                                <tr>
                                  <td width="60" style="padding-top: 8px; font-size: 14px; color: #64748b; font-weight: 500;">Email:</td>
                                  <td style="padding-top: 8px; font-size: 15px;">
                                    <a href="mailto:${email}" style="color: #0058d0; text-decoration: none; font-weight: 600;">${email}</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 24px 32px 32px 32px;">
                        <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Message Payload</p>
                        <div style="font-size: 15px; line-height: 1.6; color: #334155;">
                          ${message.replace(/\n/g, '<br>')}
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td bgcolor="#f8fafc" style="padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-size: 12px; color: #94a3b8;">This is an automated system notification from Pritam-OS.</p>
                        <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">&copy; ${new Date().getFullYear()} Pritam Poddar</p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      }),
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json();
      console.error('CRITICAL BREVO ERROR REJECTED PAYLOAD:', JSON.stringify(errorData, null, 2));
      throw new Error('Failed to transmit via Brevo');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact Form Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}