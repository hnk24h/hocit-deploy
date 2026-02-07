import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { marked } from 'marked';
import { getProduct, getAllProducts, formatPrice } from '@/lib/affiliate';
import { 
  RatingStars, 
  ProsCons, 
  AffiliateButton, 
  AffiliateDisclosure,
  ProductGrid 
} from '@/components/affiliate';
import ProductImageSlider from '@/components/ProductImageSlider';

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = getProduct(params.slug);

  if (!product) {
    return {
      title: 'Sản phẩm không tồn tại',
    };
  }

  return {
    title: `${product.name} - Review chi tiết | Hocit Blog`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const affiliateUrl = product.affiliateLink.startsWith('http')
    ? product.affiliateLink
    : `/go/${product.affiliateLink}`;

  // Get related products (same category, excluding current)
  const allProducts = getAllProducts();
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  // Convert markdown to HTML for detailed review
  const detailedReviewHtml = product.detailedReview 
    ? await marked(product.detailedReview)
    : '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <Link href="/" className="text-brand-600 hover:underline">Home</Link>
          {' / '}
          <Link href="/products" className="text-brand-600 hover:underline">Products</Link>
          {' / '}
          <span className="text-gray-600 dark:text-gray-400">{product.name}</span>
        </div>

        {/* Affiliate Disclosure */}
        <AffiliateDisclosure className="mb-8" />

        {/* Product Header */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {/* Image Slider */}
          <ProductImageSlider 
            images={product.images || (product.image ? [product.image] : [])}
            productName={product.name}
          />

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="inline-block text-sm text-brand-600 dark:text-brand-400 font-semibold mb-2">
              {product.category}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            {product.rating && (
              <div className="mb-4">
                <RatingStars
                  rating={product.rating}
                  size="lg"
                  showNumber
                  reviewCount={product.reviewCount}
                />
              </div>
            )}

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {product.description}
            </p>

            {product.price && (
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {formatPrice(product.price, product.currency)}
              </div>
            )}

            <div className="flex gap-4">
              <AffiliateButton
                href={affiliateUrl}
                text="Mua ngay"
                size="lg"
                trackingId={product.slug}
              />
              <AffiliateButton
                href={affiliateUrl}
                text="Xem chi tiết"
                variant="outline"
                size="lg"
                trackingId={`${product.slug}-details`}
              />
            </div>

            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Free shipping & 30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pros & Cons */}
        {(product.pros.length > 0 || product.cons.length > 0) && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Ưu điểm & Nhược điểm
            </h2>
            <ProsCons pros={product.pros} cons={product.cons} />
          </div>
        )}

        {/* Detailed Review Section */}
        {detailedReviewHtml && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Đánh giá chi tiết
            </h2>
            
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: detailedReviewHtml }}
            />

            <div className="mt-8 text-center">
              <AffiliateButton
                href={affiliateUrl}
                text="Mua ngay với giá tốt nhất"
                size="lg"
                trackingId={`${product.slug}-bottom`}
              />
            </div>
          </div>
        )}

        {/* Fallback content when no detailed review */}
        {!detailedReviewHtml && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Đánh giá chi tiết
            </h2>
            
            <div className="prose dark:prose-invert max-w-none">
              <h3>Tổng quan</h3>
              <p>{product.description}</p>

              <h3>Ai nên mua sản phẩm này?</h3>
              <p>
                {product.name} phù hợp cho những ai đang tìm kiếm một giải pháp 
                {product.category.toLowerCase()} chất lượng cao. Đặc biệt phù hợp với:
              </p>
              <ul>
                <li>Lập trình viên chuyên nghiệp</li>
                <li>Sinh viên IT</li>
                <li>Freelancers</li>
              </ul>

              <h3>Hiệu năng</h3>
              <p>
                Với rating {product.rating}/5 từ {product.reviewCount?.toLocaleString()} đánh giá,
                {product.name} được đánh giá cao về độ tin cậy và hiệu suất.
              </p>

              <h3>Kết luận</h3>
              <p>
                Nhìn chung, {product.name} là một lựa chọn xuất sắc trong phân khúc{' '}
                {product.category.toLowerCase()}. Với những ưu điểm vượt trội và 
                một số điểm cần cải thiện, sản phẩm này xứng đáng được xem xét kỹ lưỡng.
              </p>
            </div>

            <div className="mt-8 text-center">
              <AffiliateButton
                href={affiliateUrl}
                text="Mua ngay với giá tốt nhất"
                size="lg"
                trackingId={`${product.slug}-bottom`}
              />
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Sản phẩm liên quan
            </h2>
            <ProductGrid products={relatedProducts} columns={3} />
          </div>
        )}

        {/* Footer Disclosure */}
        <AffiliateDisclosure variant="footer" className="mt-12" />
      </div>
    </div>
  );
}
