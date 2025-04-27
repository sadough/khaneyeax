// تنظیمات اصلی
const ALLOWED_ORIGINS = [
  'https://khaneyeax.com',    // آدرس سایت خود را جایگزین کنید
  'http://localhost:8080'     // برای تست در محیط توسعه
];

const SECRET_API_KEY = 'sk-ca1b6f045e0b4d1681a32e82b0e5b2f6'; // کلید API DeepSeek خود را اینجا قرار دهید

// مدیریت درخواست‌ها
async function handleRequest(request) {
  // بررسی CORS
  const origin = request.headers.get('origin') || '';
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new Response('Blocked by CORS policy', { status: 403 });
  }

  // فقط درخواست‌های POST پردازش شوند
  if (request.method !== 'POST') {
    return new Response('Only POST requests are allowed', { status: 405 });
  }

  try {
    // دریافت داده‌های ورودی
    const payload = await request.json();
    
    // ارسال به DeepSeek API
    const apiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sk-ca1b6f045e0b4d1681a32e82b0e5b2f6}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: payload.messages || [],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    // پردازش پاسخ
    const responseData = await apiResponse.json();

    // برگرداندن پاسخ
    return new Response(JSON.stringify(responseData), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    // مدیریت خطاها
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin
      }
    });
  }
}

// رویداد اصلی
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});