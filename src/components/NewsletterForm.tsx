'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Cảm ơn bạn đã đăng ký! Vui lòng check email để xác nhận.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-8 text-white animate-scale-in">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-2">📬 Đăng Ký Nhận Bài Viết Mới</h3>
        <p className="text-slate-200 mb-6">
          Nhận thông báo khi có bài viết mới về lập trình, tips & tricks mỗi tuần.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn..."
            required
            disabled={status === 'loading'}
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Đang gửi...' : 'Đăng ký'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm ${
              status === 'success' ? 'text-green-100' : 'text-red-100'
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-4 text-xs text-slate-200">
          Không spam. Hủy đăng ký bất cứ lúc nào. 🔒
        </p>
      </div>
    </div>
  );
}
