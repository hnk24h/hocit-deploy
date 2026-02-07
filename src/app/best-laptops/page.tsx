import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProducts } from '@/lib/affiliate';
import { ProductCard, AffiliateDisclosure } from '@/components/affiliate';

export const metadata: Metadata = {
  title: 'Best Laptops for Developers 2026 | Hocit Blog',
  description: 'Tổng hợp các laptop tốt nhất cho lập trình viên năm 2026. So sánh chi tiết về hiệu năng, giá cả và tính năng.',
  openGraph: {
    title: 'Best Laptops for Developers 2026',
    description: 'Tổng hợp các laptop tốt nhất cho lập trình viên',
  },
};

export default function BestLaptopsPage() {
  const allProducts = getAllProducts();
  const laptops = allProducts.filter(p => p.category === 'Laptops');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <Link href="/" className="text-brand-600 hover:underline">Home</Link>
          {' / '}
          <span className="text-gray-600 dark:text-gray-400">Best Laptops for Developers</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-brand-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
            BUYING GUIDE 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Best Laptops for Developers in 2026
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Tổng hợp các laptop tốt nhất cho lập trình viên, được đánh giá dựa trên 
            hiệu năng, độ bền, giá cả và trải nghiệm thực tế
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Cập nhật: February 8, 2026 | Đọc: 15 phút
          </div>
        </div>

        <AffiliateDisclosure className="mb-12" />

        {/* Quick Picks */}
        <div className="mb-16 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>🏆</span>
            <span>Quick Picks</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="text-brand-600 dark:text-brand-400 font-bold mb-2">Best Overall</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">MacBook Pro M4</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Hiệu năng vượt trội, pin lâu, build quality xuất sắc
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="text-green-600 dark:text-green-400 font-bold mb-2">Best Value</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">Dell XPS 13</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Cân bằng tốt giữa giá và hiệu năng
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="text-purple-600 dark:text-purple-400 font-bold mb-2">Budget Pick</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">Lenovo ThinkPad</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Tốt nhất cho sinh viên và bắt đầu học
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Nội dung</h3>
          <ol className="space-y-2 text-sm">
            <li>
              <a href="#criteria" className="text-brand-600 hover:underline">
                1. Tiêu chí đánh giá laptop cho developer
              </a>
            </li>
            <li>
              <a href="#top-picks" className="text-brand-600 hover:underline">
                2. Top laptops được đề xuất
              </a>
            </li>
            <li>
              <a href="#buying-guide" className="text-brand-600 hover:underline">
                3. Hướng dẫn mua laptop
              </a>
            </li>
            <li>
              <a href="#faq" className="text-brand-600 hover:underline">
                4. FAQ
              </a>
            </li>
          </ol>
        </div>

        {/* Criteria Section */}
        <div id="criteria" className="mb-16 prose dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Tiêu chí đánh giá laptop cho Developer
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>⚡</span> Hiệu năng
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>CPU: Tối thiểu Intel i7 hoặc equivalent</li>
                <li>RAM: 16GB trở lên (32GB tốt hơn)</li>
                <li>SSD: 512GB minimum</li>
                <li>Compile time nhanh</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>🖥️</span> Màn hình
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Kích thước: 13-15 inch</li>
                <li>Resolution: Full HD trở lên</li>
                <li>Matte finish (giảm phản chiếu)</li>
                <li>Độ sáng cao</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>🔋</span> Pin
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Tối thiểu 8 giờ sử dụng liên tục</li>
                <li>Fast charging</li>
                <li>USB-C charging</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>⚙️</span> Khác
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Bàn phím tốt (typing nhiều)</li>
                <li>Cổng kết nối đa dạng</li>
                <li>Build quality chắc chắn</li>
                <li>Hệ điều hành linh hoạt</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Top Picks */}
        <div id="top-picks" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Top Laptops được đề xuất
          </h2>
          <div className="space-y-6">
            {laptops.map((laptop, index) => (
              <div key={laptop.slug}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-brand-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {laptop.name}
                  </h3>
                </div>
                <ProductCard product={laptop} layout="list" />
              </div>
            ))}
          </div>
        </div>

        {/* Buying Guide */}
        <div id="buying-guide" className="mb-16 bg-white dark:bg-gray-800 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Hướng dẫn mua Laptop cho Developer
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <h3>1. Xác định budget</h3>
            <ul>
              <li><strong>Budget ($500-$800):</strong> Lenovo, Dell Inspiron - Phù hợp sinh viên</li>
              <li><strong>Mid-range ($800-$1500):</strong> Dell XPS, ThinkPad X1 - Cân bằng tốt</li>
              <li><strong>Premium ($1500+):</strong> MacBook Pro, Dell XPS 15 - Professional use</li>
            </ul>

            <h3>2. Chọn hệ điều hành</h3>
            <ul>
              <li><strong>macOS:</strong> Tốt cho iOS/Mac development, Unix-based, ổn định</li>
              <li><strong>Windows:</strong> Đa năng, hỗ trợ mọi công cụ, gaming</li>
              <li><strong>Linux:</strong> Tùy biến cao, lightweight, cho system programming</li>
            </ul>

            <h3>3. Specs quan trọng</h3>
            <p>
              Đừng tiết kiệm với RAM và SSD. 16GB RAM là minimum, 32GB nếu làm việc với 
              Docker, VMs, hoặc data science. SSD 512GB trở lên để chứa nhiều projects và tools.
            </p>

            <h3>4. Kiểm tra trước khi mua</h3>
            <ul>
              <li>Thử bàn phím (typing experience)</li>
              <li>Kiểm tra màn hình (góc nhìn, độ sáng)</li>
              <li>Test cổng kết nối</li>
              <li>Đọc reviews từ developers</li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Câu hỏi thường gặp (FAQ)
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'MacBook hay Windows laptop tốt hơn cho developer?',
                a: 'Phụ thuộc vào công việc. MacBook tốt cho iOS/Mac dev và có ecosystem ổn định. Windows linh hoạt hơn, hỗ trợ đa dạng tools và giá rẻ hơn.'
              },
              {
                q: 'Cần bao nhiêu RAM cho programming?',
                a: 'Minimum 16GB. Nếu dùng Docker, VMs, hay IDE nặng (IntelliJ, Android Studio) thì nên 32GB.'
              },
              {
                q: 'SSD hay HDD?',
                a: 'Luôn chọn SSD. Tốc độ nhanh hơn gấp 10 lần, quan trọng cho compile time và loading projects.'
              },
              {
                q: 'Laptop gaming có tốt cho programming không?',
                a: 'Có thể dùng được nhưng thường nặng, pin yếu, và quá mức cần thiết. Trừ khi bạn cũng gaming.'
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Q: {faq.q}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A: {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-gradient-to-r from-brand-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Kết luận
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Việc chọn laptop phù hợp sẽ ảnh hưởng lớn đến năng suất làm việc của bạn. 
            Hãy dành thời gian nghiên cứu kỹ và đầu tư vào một chiếc laptop chất lượng 
            có thể dùng lâu dài. Nếu còn thắc mắc, hãy để lại comment bên dưới!
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-brand-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>

        <AffiliateDisclosure variant="footer" className="mt-12" />
      </div>
    </div>
  );
}
