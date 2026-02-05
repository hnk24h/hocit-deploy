export const metadata = {
  title: 'Giới thiệu',
  description: 'Về Ikagi - Blog học lập trình',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Giới thiệu</h1>
          <p className="text-xl text-blue-100">
            Về Ikagi - Nơi học lập trình hiệu quả
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Chào mừng bạn đến với HocIT
            </h2>
            <p className="text-gray-700 leading-relaxed">
              HocIT là blog chuyên chia sẻ kiến thức lập trình từ cơ bản đến nâng cao.
              Chúng tôi tập trung vào việc cung cấp các bài viết chất lượng, dễ hiểu và
              thực tế về các chủ đề như SQL, JavaScript, và nhiều công nghệ khác.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mục tiêu
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Cung cấp nội dung chất lượng cao về lập trình</li>
              <li>Giúp người học tiếp cận kiến thức một cách dễ dàng</li>
              <li>Xây dựng cộng đồng học lập trình Việt Nam</li>
              <li>Chia sẻ kinh nghiệm thực tế từ các dự án</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Liên hệ
            </h2>
            <p className="text-gray-700">
              Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, đừng ngại liên hệ với chúng tôi.
              Chúng tôi luôn sẵn sàng lắng nghe và cải thiện.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
