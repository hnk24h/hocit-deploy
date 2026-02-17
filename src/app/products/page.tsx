import { Metadata } from 'next';
import { getAllProducts } from '@/lib/affiliate';
import { ProductGrid } from '@/components/affiliate';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';
import { HiCube } from 'react-icons/hi2';

export const metadata: Metadata = {
  title: 'Sản phẩm được đề xuất | Hocit Blog',
  description: 'Khám phá các sản phẩm và công cụ tốt nhất cho lập trình viên và developer',
  openGraph: {
    title: 'Sản phẩm được đề xuất',
    description: 'Khám phá các sản phẩm và công cụ tốt nhất cho lập trình viên',
  },
};

export default function ProductsPage() {
  const products = getAllProducts();
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="page-container">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">
            Sản phẩm được đề xuất
          </h1>
          <p className="page-description">
            Khám phá các sản phẩm và công cụ tốt nhất được chọn lọc kỹ càng 
            cho lập trình viên và developers
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Link
            href="/products"
            className="px-4 py-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors"
          >
            Tất cả ({products.length})
          </Link>
          {categories.map(category => {
            const count = products.filter(p => p.category === category).length;
            return (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-300 dark:border-gray-600 hover:border-brand-600 hover:text-brand-600 dark:hover:border-brand-400 dark:hover:text-brand-400 transition-colors"
              >
                {category} ({count})
              </Link>
            );
          })}
        </div>

        {/* Products grid */}
        {products.length === 0 ? (
          <EmptyState
            icon={<HiCube className="w-20 h-20" />}
            title="Chưa có sản phẩm"
            description="Hiện tại chưa có sản phẩm nào. Hãy quay lại sau nhé!"
            action={{
              label: "Về trang chủ",
              href: "/"
            }}
          />
        ) : (
          <ProductGrid 
            products={products}
            columns={3}
          />
        )}

        {/* CTA Section */}
        <div className="mt-16 cta-section">
          <h2 className="text-3xl font-bold mb-4">
            Không tìm thấy sản phẩm phù hợp?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Hãy cho chúng tôi biết loại sản phẩm hoặc công cụ bạn đang tìm kiếm
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-brand-600 px-8 py-3 rounded-button font-semibold hover:bg-gray-100 transition-all shadow-elevation-2 hover:shadow-elevation-3"
          >
            Liên hệ với chúng tôi
          </Link>
        </div>
      </div>
    </div>
  );
}
