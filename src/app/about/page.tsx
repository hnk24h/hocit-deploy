import { StructuredData } from '@/components/StructuredData'

export const metadata = {
  title: 'Giới thiệu',
  description: 'Về Ikagi - Blog học lập trình và chia sẻ kiến thức công nghệ',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StructuredData type="Person" data={{}} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-700 to-slate-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-6 animate-scale-in">
            <div className="w-32 h-32 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 text-6xl font-bold">
              I
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">
            Chào mừng đến với Ikagi
          </h1>
          <p className="text-xl text-slate-200 animate-slide-up">
            Nơi chia sẻ kiến thức lập trình và kinh nghiệm thực tế
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            📖 Về Ikagi
          </h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              <strong>Ikagi</strong> là blog cá nhân được tạo ra với mục đích chia sẻ kiến thức lập trình, 
              kinh nghiệm làm việc, và những tips & tricks hữu ích cho developer.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Từ những kiến thức cơ bản về SQL, JavaScript cho đến các chủ đề nâng cao về 
              system design, architecture, và best practices - tất cả đều được trình bày 
              một cách dễ hiểu và thực tế.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">
              🎯 Mục Tiêu
            </h3>
            
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li>Chia sẻ kiến thức lập trình chất lượng bằng tiếng Việt</li>
              <li>Cung cấp tutorials thực tế, dễ áp dụng</li>
              <li>Xây dựng cộng đồng developer Việt Nam</li>
              <li>Học hỏi và phát triển cùng nhau</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">
              💼 Chủ Đề Chính
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-brand-50 dark:bg-brand-900/20 rounded-lg p-6 border border-brand-100 dark:border-brand-800">
              <div className="text-3xl mb-3">💻</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">Web Development</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Next.js, React, TypeScript, Node.js và các công nghệ web hiện đại
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-100 dark:border-green-800">
              <div className="text-3xl mb-3">🗄️</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">Database</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                SQL, PostgreSQL, MongoDB, optimization và best practices
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-100 dark:border-purple-800">
              <div className="text-3xl mb-3">🏗️</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">System Design</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Architecture, scalability, performance và design patterns
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-100 dark:border-orange-800">
              <div className="text-3xl mb-3">📚</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">Best Practices</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Clean code, testing, deployment và tips từ kinh nghiệm thực tế
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
            🛠️ Tech Stack
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Next.js', icon: '⚡' },
              { name: 'TypeScript', icon: '📘' },
              { name: 'React', icon: '⚛️' },
              { name: 'Node.js', icon: '🟢' },
              { name: 'PostgreSQL', icon: '🐘' },
              { name: 'MongoDB', icon: '🍃' },
              { name: 'Docker', icon: '🐳' },
              { name: 'AWS', icon: '☁️' },
            ].map((tech) => (
              <div
                key={tech.name}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            🚀 Cùng Học Và Phát Triển
          </h2>
          <p className="text-slate-200 text-lg mb-8">
            Hãy kết nối và chia sẻ kiến thức cùng nhau!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/hnk24h/hocit"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
            >
              <span>⭐</span>
              GitHub
            </a>
            <a
              href="mailto:contact@ikagi.site"
              className="bg-white/10 backdrop-blur text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors inline-flex items-center gap-2 border border-white/30"
            >
              <span>📧</span>
              Email
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
