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
    <div className="max-w-2xl mx-auto">
      {status === 'success' ? (
        // Success State
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 shadow-2xl text-white text-center animate-scale-in">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-2">Chào mừng bạn đến với gia đình!</h3>
          <p className="text-emerald-50 text-lg">
            {message}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-emerald-50">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Email xác nhận đã được gửi</span>
          </div>
        </div>
      ) : (
        // Form State
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-6 text-white text-center">
            <div className="text-5xl mb-3">📬</div>
            <h3 className="text-2xl font-bold mb-2">Đăng ký nhận deals hot</h3>
            <p className="text-emerald-50">
              Tham gia 8,500+ người thông minh đang tiết kiệm mỗi ngày
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  disabled={status === 'loading'}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl placeholder-gray-400 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 transition-all text-lg"
                />
              </div>
              
              <button
                type="submit"
                disabled={status === 'loading'}
                className="group w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span>🎁 Đăng ký miễn phí ngay</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {message && status === 'error' && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
              </div>
            )}

            {/* What You'll Get */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">🎯 Bạn sẽ nhận được:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Deals HOT giảm đến 70% mỗi tuần</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Mã giảm giá độc quyền không tìm thấy ở nơi khác</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Review sản phẩm chi tiết từ chuyên gia</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Tips mua sắm thông minh tiết kiệm tiền</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
