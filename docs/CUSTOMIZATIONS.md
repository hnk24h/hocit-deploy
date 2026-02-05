# Site Customizations & Setup Guide

## 🎨 Design Improvements

### Color Scheme
- **Brand Colors**: Custom brand palette với blue tones (brand-50 → brand-900)
- **Font**: Inter font family từ Google Fonts
- **Typography**: Improved line-height và font-weights cho readability tốt hơn

### Animations
- `fade-in`: Smooth fade-in effect
- `slide-up`: Slide up from bottom
- `scale-in`: Scale in animation
- Custom scrollbar styling
- Hover effects với transitions mượt mà

### UI Components
- **Header**: Backdrop blur effect, gradient logo, link underline animations
- **ArticleCard**: Card hover effects, "Đọc thêm" indicator, shadows và borders
- **Buttons**: Gradient backgrounds, hover states
- **Code**: Better syntax highlighting với custom prism theme

### Custom Utilities
```css
.text-gradient     /* Gradient text effect */
.card-hover        /* Card hover with lift */
.link-underline    /* Animated underline */
```

## 📊 Google Analytics

### Setup

1. Create Google Analytics account tại [analytics.google.com](https://analytics.google.com/)
2. Create property và copy Measurement ID (format: G-XXXXXXXXXX)
3. Add vào `.env.local`:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. Deploy trên Vercel:
   - Vercel Dashboard → Settings → Environment Variables
   - Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` với value là Measurement ID
   - Redeploy

### Component: `GoogleAnalytics.tsx`
- Client-side script loading
- Automatic page tracking
- Privacy-friendly (chỉ load khi có Measurement ID)

## 📧 Email Newsletter

### Hỗ Trợ 3 Email Service Providers

#### Option 1: Mailchimp (Recommended for beginners)
- Free: 500 subscribers
- Sign up: [mailchimp.com](https://mailchimp.com/)
- Environment variables:
```bash
EMAIL_SERVICE_PROVIDER=mailchimp
MAILCHIMP_API_KEY=your_api_key
MAILCHIMP_AUDIENCE_ID=your_audience_id
```

#### Option 2: ConvertKit (Best for creators)
- Free: 1000 subscribers
- Sign up: [convertkit.com](https://convertkit.com/)
- Environment variables:
```bash
EMAIL_SERVICE_PROVIDER=convertkit
CONVERTKIT_API_KEY=your_api_key
CONVERTKIT_FORM_ID=your_form_id
```

#### Option 3: EmailOctopus (Cheapest)
- Free: 2500 subscribers
- Sign up: [emailoctopus.com](https://emailoctopus.com/)
- Environment variables:
```bash
EMAIL_SERVICE_PROVIDER=emailoctopus
EMAILOCTOPUS_API_KEY=your_api_key
EMAILOCTOPUS_LIST_ID=your_list_id
```

### Features
- Double opt-in support
- Email validation
- Error handling
- Loading states
- Success/error messages
- Responsive design
- Privacy notice

### API Route: `/api/newsletter`
- POST endpoint
- JSON body: `{ email: "user@example.com" }`
- Supports multiple providers
- Development mode (logs to console nếu không config provider)

## 🔍 SEO Optimization

### Structured Data (JSON-LD)
- **Website**: Schema.org WebSite với SearchAction
- **Article**: BlogPosting với full metadata
- **Breadcrumb**: Navigation breadcrumbs
- **Person**: Author/Creator information

### Metadata Improvements
- Canonical URLs
- OpenGraph tags (Facebook, LinkedIn)
- Twitter Card tags
- Keywords optimization
- Authors và creator info
- Alternates cho multiple languages (future)

### Sitemap & Robots
- Dynamic sitemap.xml generation
- All articles included
- Proper priority và changefreq
- Robots.txt với sitemap reference

### Article SEO
- Unique title tags
- Meta descriptions
- OpenGraph images (prepare og-image.png)
- Structured data per article
- Breadcrumb navigation

## 👤 Brand Profile Page

### About Page Features
- Hero section với logo animation
- Brand story và mission
- Tech stack showcase
- Topic categories với icons
- CTA section với social links
- Structured data cho SEO
- Responsive grid layout

### Sections
1. **Hero**: Animated logo, brand name, tagline
2. **About**: Story, goals, và topics
3. **Tech Stack**: Visual display of technologies
4. **CTA**: Social links (GitHub, Email)

### Customization
Edit `src/app/about/page.tsx`:
- Update logo/icon
- Modify brand story
- Add social media links
- Update tech stack icons
- Change color schemes

## 📦 Environment Variables

Complete `.env.local` template:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://ikagi.site

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Giscus Comments
NEXT_PUBLIC_GISCUS_REPO=username/repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxx
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxx

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Newsletter (Choose one)
EMAIL_SERVICE_PROVIDER=mailchimp

# Mailchimp
MAILCHIMP_API_KEY=your_api_key
MAILCHIMP_AUDIENCE_ID=your_audience_id

# ConvertKit
CONVERTKIT_API_KEY=your_api_key
CONVERTKIT_FORM_ID=your_form_id

# EmailOctopus
EMAILOCTOPUS_API_KEY=your_api_key
EMAILOCTOPUS_LIST_ID=your_list_id
```

## 🚀 Deployment Checklist

### Vercel Environment Variables
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add ALL environment variables from `.env.local`
3. Choose scope: Production, Preview, Development
4. Save và redeploy

### Vercel Settings
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `out`
- **Install Command**: `npm install`

### Post-Deploy Tasks
- [ ] Verify Google Analytics tracking
- [ ] Test newsletter signup
- [ ] Check Giscus comments
- [ ] Validate sitemap.xml (`/sitemap.xml`)
- [ ] Check robots.txt (`/robots.txt`)
- [ ] Test all pages responsive
- [ ] Verify custom domain
- [ ] Test structured data với [Google Rich Results Test](https://search.google.com/test/rich-results)

## 🧪 Testing

### Local Testing
```bash
# Build
npm run build

# Test structured data
curl http://localhost:3000/articles/your-slug | grep "application/ld+json"

# Test newsletter
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Production Testing
```bash
# Check sitemap
curl https://ikagi.site/sitemap.xml

# Check robots
curl https://ikagi.site/robots.txt

# Check Google Analytics
# Open DevTools → Network → Filter: gtag
```

## 📝 Maintenance Tasks

### Regular Updates
- [ ] Update article metadata
- [ ] Check broken links
- [ ] Monitor analytics
- [ ] Review newsletter performance
- [ ] Update tech stack on about page
- [ ] Optimize images
- [ ] Update dependencies

### Monthly SEO Tasks
- [ ] Submit sitemap to Google Search Console
- [ ] Check indexing status
- [ ] Review search performance
- [ ] Update meta descriptions
- [ ] Add new keywords
- [ ] Internal linking

## 🎯 Performance Tips

### Optimization
- Use Cloudinary cho images (CDN + auto-optimization)
- Lazy load images với Next.js Image
- Minimize JavaScript bundles
- Use static generation (đã có)
- Enable caching headers trên Vercel
- Compress assets

### Monitoring
- Google PageSpeed Insights
- Lighthouse CI
- Vercel Analytics
- Google Analytics Core Web Vitals

## 🔗 Helpful Links

- [Google Analytics Setup](https://analytics.google.com/)
- [Mailchimp API Docs](https://mailchimp.com/developer/)
- [ConvertKit API](https://developers.convertkit.com/)
- [EmailOctopus API](https://emailoctopus.com/api-documentation)
- [Schema.org](https://schema.org/)
- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

## 💡 Next Steps

1. **Setup Google Analytics** và monitor traffic
2. **Configure newsletter** với provider of choice
3. **Submit sitemap** to Google Search Console
4. **Create more content** và optimize SEO
5. **Build backlinks** từ các sites khác
6. **Engage community** qua comments và newsletter
7. **Optimize performance** dựa trên analytics data

---

**Questions?** Check [README.md](../README.md) hoặc open an issue trên GitHub.
