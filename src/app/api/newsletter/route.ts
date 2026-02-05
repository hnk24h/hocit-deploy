import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // TODO: Integrate with email service provider
    // Option 1: Mailchimp
    // Option 2: ConvertKit
    // Option 3: EmailOctopus
    // Option 4: SendGrid Marketing

    const emailService = process.env.EMAIL_SERVICE_PROVIDER || 'none';

    switch (emailService) {
      case 'mailchimp':
        return await subscribeMailchimp(email);
      
      case 'convertkit':
        return await subscribeConvertKit(email);
      
      case 'emailoctopus':
        return await subscribeEmailOctopus(email);
      
      default:
        // For now, just log the email (development mode)
        console.log('Newsletter subscription:', email);
        return NextResponse.json({
          success: true,
          message: 'Đăng ký thành công!',
        });
    }
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}

// Mailchimp integration
async function subscribeMailchimp(email: string) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = apiKey?.split('-')[1];

  if (!apiKey || !audienceId) {
    throw new Error('Mailchimp not configured');
  }

  const response = await fetch(
    `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'pending', // Double opt-in
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.title || 'Mailchimp error');
  }

  return NextResponse.json({
    success: true,
    message: 'Đăng ký thành công! Vui lòng check email để xác nhận.',
  });
}

// ConvertKit integration
async function subscribeConvertKit(email: string) {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;

  if (!apiKey || !formId) {
    throw new Error('ConvertKit not configured');
  }

  const response = await fetch(
    `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        email,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('ConvertKit error');
  }

  return NextResponse.json({
    success: true,
    message: 'Đăng ký thành công!',
  });
}

// EmailOctopus integration
async function subscribeEmailOctopus(email: string) {
  const apiKey = process.env.EMAILOCTOPUS_API_KEY;
  const listId = process.env.EMAILOCTOPUS_LIST_ID;

  if (!apiKey || !listId) {
    throw new Error('EmailOctopus not configured');
  }

  const response = await fetch(
    `https://emailoctopus.com/api/1.6/lists/${listId}/contacts`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        email_address: email,
        status: 'PENDING', // Double opt-in
      }),
    }
  );

  if (!response.ok) {
    throw new Error('EmailOctopus error');
  }

  return NextResponse.json({
    success: true,
    message: 'Đăng ký thành công! Vui lòng check email để xác nhận.',
  });
}
