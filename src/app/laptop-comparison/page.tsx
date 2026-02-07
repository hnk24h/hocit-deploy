import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProducts } from '@/lib/affiliate';
import { ComparisonTable, AffiliateDisclosure, ProsCons } from '@/components/affiliate';

export const metadata: Metadata = {
  title: 'MacBook Pro vs Dell XPS vs ThinkPad - Laptop Comparison | Hocit Blog',
  description: 'So sánh chi tiết MacBook Pro, Dell XPS và ThinkPad cho developers. Đánh giá hiệu năng, giá cả, build quality.',
  openGraph: {
    title: 'MacBook Pro vs Dell XPS vs ThinkPad',
    description: 'So sánh chi tiết 3 dòng laptop phổ biến cho developers',
  },
};

export default function LaptopComparisonPage() {
  const allProducts = getAllProducts();
  const laptops = allProducts.filter(p => p.category === 'Laptops').slice(0, 3);

  // Comparison data
  const features = [
    'Processor',
    'RAM',
    'Storage',
    'Display',
    'Battery Life',
    'Weight',
    'Ports',
    'OS',
    'Build Quality',
    'Keyboard',
    'Webcam',
    'Warranty',
  ];

  const featureData: { [key: string]: { [key: string]: string | boolean } } = {
    'macbook-pro-m4': {
      'Processor': 'Apple M4',
      'RAM': '16GB Unified',
      'Storage': '512GB SSD',
      'Display': '14" Liquid Retina XDR',
      'Battery Life': '18 hours',
      'Weight': '1.55 kg',
      'Ports': '3x USB-C, HDMI, SD',
      'OS': 'macOS',
      'Build Quality': true,
      'Keyboard': 'Excellent',
      'Webcam': '1080p FaceTime',
      'Warranty': '1 year',
    },
    'dell-xps-13': {
      'Processor': 'Intel Core i7',
      'RAM': '16GB DDR5',
      'Storage': '512GB SSD',
      'Display': '13.4" FHD+',
      'Battery Life': '12 hours',
      'Weight': '1.27 kg',
      'Ports': '2x USB-C, 1x USB-A',
      'OS': 'Windows 11',
      'Build Quality': true,
      'Keyboard': 'Very Good',
      'Webcam': '720p HD',
      'Warranty': '1 year',
    },
    'lenovo-thinkpad': {
      'Processor': 'Intel Core i5',
      'RAM': '16GB DDR4',
      'Storage': '256GB SSD',
      'Display': '14" FHD IPS',
      'Battery Life': '10 hours',
      'Weight': '1.49 kg',
      'Ports': '2x USB-C, 2x USB-A, HDMI',
      'OS': 'Windows 11',
      'Build Quality': true,
      'Keyboard': 'Legendary',
      'Webcam': '720p HD',
      'Warranty': '3 years',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <Link href="/" className="text-brand-600 hover:underline">Home</Link>
          {' / '}
          <Link href="/products" className="text-brand-600 hover:underline">Products</Link>
          {' / '}
          <span className="text-gray-600 dark:text-gray-400">Laptop Comparison</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
            COMPARISON
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            MacBook Pro vs Dell XPS vs ThinkPad
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            So sánh chi tiết 3 dòng laptop phổ biến nhất cho developers. 
            Đâu là lựa chọn tốt nhất cho bạn?
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Cập nhật: February 8, 2026 | Đọc: 10 phút
          </div>
        </div>

        <AffiliateDisclosure className="mb-12" />

        {/* Quick Summary */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tóm tắt nhanh
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-l-4 border-green-500 pl-4">
              <div className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">
                🏆 WINNER - Overall
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                MacBook Pro M4
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Hiệu năng tốt nhất, pin lâu nhất, ecosystem hoàn hảo. 
                Tuy nhiên giá cao và chỉ chạy macOS.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">
                💰 Best Value
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Dell XPS 13
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Cân bằng tốt giữa giá và hiệu năng. 
                Thiết kế đẹp, nhẹ, Windows 11 linh hoạt.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-1">
                ⌨️ Best Keyboard
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Lenovo ThinkPad
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Bàn phím huyền thoại, cổng kết nối nhiều, 
                warranty 3 năm. Tốt cho typing nhiều.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            So sánh chi tiết
          </h2>
          <ComparisonTable
            products={laptops}
            features={features}
            featureData={featureData}
          />
        </div>

        {/* Detailed Analysis */}
        <div className="mb-12 space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Phân tích chi tiết từng sản phẩm
            </h2>

            {/* MacBook Pro */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="bg-gray-200 dark:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-lg">
                  🍎
                </span>
                MacBook Pro M4
              </h3>
              <ProsCons
                pros={[
                  'Hiệu năng M4 chip vượt trội',
                  'Pin 18 giờ - tốt nhất thị trường',
                  'Display Liquid Retina XDR đẹp nhất',
                  'Build quality aluminum cao cấp',
                  'macOS ổn định cho development',
                  'Tích hợp hoàn hảo với Apple ecosystem',
                ]}
                cons={[
                  'Giá cao ($1999+)',
                  'Không thể upgrade RAM/SSD',
                  'Chỉ chạy macOS',
                  'Ports hạn chế (không USB-A)',
                  'Touch Bar gây tranh cãi',
                ]}
              />
              <div className="mt-6 prose dark:prose-invert max-w-none">
                <p>
                  <strong>Ai nên mua:</strong> Developers làm việc với iOS/Mac apps, 
                  hoặc cần hiệu năng cao và pin lâu. Phù hợp với budget cao.
                </p>
              </div>
            </div>

            {/* Dell XPS */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="bg-blue-200 dark:bg-blue-900 w-10 h-10 rounded-full flex items-center justify-center text-lg">
                  💻
                </span>
                Dell XPS 13
              </h3>
              <ProsCons
                pros={[
                  'Thiết kế đẹp, compact',
                  'Màn hình InfinityEdge viền mỏng',
                  'Windows 11 linh hoạt',
                  'Giá hợp lý hơn MacBook',
                  'Nhẹ chỉ 1.27kg',
                  'Intel latest gen processor',
                ]}
                cons={[
                  'Pin 12h không bằng MacBook',
                  'Webcam 720p kém',
                  'Ports ít (chỉ USB-C)',
                  'Keyboard không bằng ThinkPad',
                  'Có thể nóng khi full load',
                ]}
              />
              <div className="mt-6 prose dark:prose-invert max-w-none">
                <p>
                  <strong>Ai nên mua:</strong> Developers cần Windows, muốn thiết kế đẹp 
                  nhưng budget hạn chế hơn MacBook. Good all-rounder.
                </p>
              </div>
            </div>

            {/* ThinkPad */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="bg-red-200 dark:bg-red-900 w-10 h-10 rounded-full flex items-center justify-center text-lg">
                  ⚫
                </span>
                Lenovo ThinkPad
              </h3>
              <ProsCons
                pros={[
                  'Bàn phím tốt nhất (huyền thoại)',
                  'Cổng kết nối đa dạng',
                  'Warranty 3 năm',
                  'Độ bền cao, military-grade',
                  'TrackPoint (red dot) tiện lợi',
                  'Giá cả phải chăng',
                ]}
                cons={[
                  'Thiết kế truyền thống, không flashy',
                  'Màn hình FHD bình thường',
                  'Nặng hơn (1.49kg)',
                  'Pin 10h trung bình',
                  'Không có discrete GPU',
                ]}
              />
              <div className="mt-6 prose dark:prose-invert max-w-none">
                <p>
                  <strong>Ai nên mua:</strong> Developers typing nhiều, cần độ bền cao, 
                  warranty tốt. Phù hợp doanh nghiệp và budget-conscious.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decision Helper */}
        <div className="mb-12 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Nên chọn laptop nào?
          </h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="font-bold text-gray-900 dark:text-white mb-2">
                Chọn MacBook Pro nếu:
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>✅ Bạn develop iOS/Mac apps</li>
                <li>✅ Budget không quá quan trọng ($2000+)</li>
                <li>✅ Cần pin lâu nhất có thể</li>
                <li>✅ Thích macOS và Apple ecosystem</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="font-bold text-gray-900 dark:text-white mb-2">
                Chọn Dell XPS nếu:
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>✅ Cần Windows cho flexibility</li>
                <li>✅ Muốn thiết kế đẹp, compact</li>
                <li>✅ Budget mid-range ($1000-1500)</li>
                <li>✅ Cân bằng giữa mọi yếu tố</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="font-bold text-gray-900 dark:text-white mb-2">
                Chọn ThinkPad nếu:
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>✅ Typing experience là ưu tiên số 1</li>
                <li>✅ Cần nhiều ports và expandability</li>
                <li>✅ Muốn warranty dài</li>
                <li>✅ Budget-conscious nhưng cần quality</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Laptop nào có pin tốt nhất?',
                a: 'MacBook Pro M4 với 18 giờ sử dụng liên tục, nhờ vào chip M4 tiết kiệm điện.'
              },
              {
                q: 'Laptop nào nhẹ nhất?',
                a: 'Dell XPS 13 ở 1.27kg là nhẹ nhất, sau đó là MacBook (1.55kg) và ThinkPad (1.49kg).'
              },
              {
                q: 'Nếu budget $1200, nên chọn gì?',
                a: 'Dell XPS 13 hoặc ThinkPad. Cả hai đều có versions trong budget này và performance tốt.'
              },
              {
                q: 'Laptop nào upgrade được?',
                a: 'ThinkPad cho phép upgrade RAM và SSD dễ dàng. MacBook và XPS thường solder RAM.'
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
            Cả 3 laptops đều xuất sắc trong segment của mình. MacBook Pro thắng về hiệu năng và pin, 
            Dell XPS về design và value, ThinkPad về keyboard và durability. 
            Hãy chọn dựa trên nhu cầu và budget của bạn!
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-block bg-white text-brand-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Xem tất cả sản phẩm
            </Link>
            <Link
              href="/best-laptops"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Best Laptops Guide
            </Link>
          </div>
        </div>

        <AffiliateDisclosure variant="footer" className="mt-12" />
      </div>
    </div>
  );
}
