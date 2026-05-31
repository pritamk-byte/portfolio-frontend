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
        sender: { name: 'Portfolio Contact Form', email: 'pritamkumarpoddar2002@gmail.com' }, 
        
        // 2. The replyTo is the person who actually filled out the form
        replyTo: { email: email, name: name }, 
        
        // 3. Where you want to receive the email
        to: [{ email: 'im.pritamk@gmail.com', name: 'Pritam' }], 
        
        subject: `[PRITAM-OS] New Transmission from ${name}`,
        htmlContent: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 24px;">
              <h2 style="margin-top: 0; color: #111827; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px;">New Message </h2>
              
              <div style="margin-top: 16px;">
                <p style="margin: 0 0 8px 0; color: #4b5563;"><strong>Sender:</strong> ${name}</p>
                <p style="margin: 0 0 16px 0; color: #4b5563;"><strong>Reply-To:</strong> <a href="mailto:${email}" style="color: #059669; text-decoration: none;">${email}</a></p>
              </div>

              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; color: #374151; font-size: 15px; line-height: 1.5;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
        `
      }),
    });

    if (!brevoResponse.ok) {
      // THIS IS THE NEW PART: We capture Brevo's exact error message
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