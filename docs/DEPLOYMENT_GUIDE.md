# Hướng dẫn Deploy HocIT Blog

## Tổng quan

Hướng dẫn deploy blog lên production với Vercel hoặc Netlify (miễn phí).

## Repository

- GitHub: https://github.com/hnk24h/hocit
- Branch: `main`

---

## Option 1: Deploy với Vercel (Khuyến nghị)

### Tại sao chọn Vercel?
- ✅ Được tạo bởi team Next.js
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments
- ✅ 100% miễn phí cho personal projects

### Bước 1: Tạo tài khoản Vercel

1. Vào https://vercel.com/signup
2. Đăng nhập bằng GitHub account
3. Authorize Vercel để truy cập GitHub

### Bước 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Chọn repository `hnk24h/hocit`
3. Click **"Import"**

### Bước 3: Configure Project

Vercel sẽ tự động detect Next.js project. Kiểm tra:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`

### Bước 4: Set Environment Variables

Click **"Environment Variables"** và thêm:

```bash
# Required
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# Giscus Comments (Optional)
NEXT_PUBLIC_GISCUS_REPO=hnk24h/hocit
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
```

**Lưu ý**: Sau khi deploy lần đầu, bạn sẽ có URL. Quay lại update `NEXT_PUBLIC_SITE_URL` với URL thật.

### Bước 5: Deploy

1. Click **"Deploy"**
2. Đợi 2-3 phút
3. ✅ Done! Website đã live

### Bước 6: Custom Domain (Optional)

1. Vào Project Settings → **Domains**
2. Add domain của bạn (ví dụ: `hocit.com`)
3. Cấu hình DNS theo hướng dẫn
4. Đợi DNS propagate (5-30 phút)

### Bước 7: Update NEXT_PUBLIC_SITE_URL

1. Vào Project Settings → **Environment Variables**
2. Edit `NEXT_PUBLIC_SITE_URL` thành domain thật
3. Click **"Redeploy"**

---

## Option 2: Deploy với Netlify

### Bước 1: Tạo tài khoản

1. Vào https://netlify.com/
2. Sign up với GitHub

### Bước 2: New Site from Git

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **GitHub**
3. Authorize Netlify
4. Select `hnk24h/hocit`

### Bước 3: Build Settings

```bash
Build command: npm run build
Publish directory: out
```

**Important**: Vì Next.js export static, output directory là `out`

### Bước 4: Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
NEXT_PUBLIC_GISCUS_REPO=hnk24h/hocit
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
```

### Bước 5: Deploy

1. Click **"Deploy site"**
2. Đợi build complete
3. ✅ Website live!

---

## Sau khi Deploy

### 1. Test website

- [ ] Homepage hiển thị đúng
- [ ] Article pages load OK
- [ ] Category pages hoạt động
- [ ] TOC scroll smooth
- [ ] Code syntax highlighting
- [ ] Comments (Giscus) hiển thị
- [ ] SEO meta tags
- [ ] Sitemap: `/sitemap.xml`
- [ ] Robots: `/robots.txt`

### 2. Update Giscus configuration

Nếu bạn đổi domain, cần update environment variables:

```bash
NEXT_PUBLIC_SITE_URL=https://your-actual-domain.com
```

Sau đó **Redeploy** project.

### 3. Submit to Search Engines

**Google Search Console:**
1. Vào https://search.google.com/search-console
2. Add property với domain của bạn
3. Submit sitemap: `https://your-domain.com/sitemap.xml`

**Bing Webmaster Tools:**
1. Vào https://www.bing.com/webmasters
2. Add site
3. Submit sitemap

### 4. Monitor Performance

**Vercel Analytics** (free):
- Vào project → Analytics tab
- Xem page views, performance

**Google Analytics** (optional):
- Add tracking code vào `src/app/layout.tsx`

---

## Continuous Deployment

### Auto Deploy

Mỗi khi bạn push code lên GitHub:

```bash
git add .
git commit -m "Update content"
git push
```

Vercel/Netlify sẽ tự động:
1. Detect new commit
2. Build project
3. Deploy lên production
4. Tạo preview URL cho mỗi PR

### Preview Deployments

- Mỗi Pull Request sẽ có preview URL riêng
- Test changes trước khi merge
- Chia sẻ với team để review

---

## Troubleshooting

### Build failed

**Lỗi**: `Module not found`
- **Fix**: Chạy `npm install` locally, commit `package-lock.json`

**Lỗi**: `TypeScript errors`
- **Fix**: Chạy `npm run build` locally để check errors

### Environment variables không hoạt động

- Đảm bảo variables bắt đầu bằng `NEXT_PUBLIC_`
- Redeploy project sau khi thêm variables
- Check logs trong Vercel/Netlify dashboard

### Comments không hiển thị

- Check Giscus environment variables
- Ensure GitHub Discussions enabled
- Verify Giscus app installed on repo

### 404 on article pages

- Ensure `output: 'export'` trong `next.config.js`
- Check trailing slash config

---

## Performance Optimization

### Already included:
- ✅ Static generation (SSG)
- ✅ Image optimization disabled (for export)
- ✅ Code splitting
- ✅ CSS minification
- ✅ Lazy loading (Giscus, Prism)

### Optional improvements:
- Add CDN for images
- Enable compression
- Add service worker (PWA)

---

## Monitoring & Maintenance

### Weekly tasks:
- [ ] Check analytics
- [ ] Review comments
- [ ] Update content

### Monthly tasks:
- [ ] Update dependencies: `npm update`
- [ ] Check security: `npm audit`
- [ ] Backup content

---

## Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | 100GB bandwidth/month | $0 |
| Netlify | 100GB bandwidth/month | $0 |
| GitHub | Unlimited public repos | $0 |
| Giscus | Unlimited comments | $0 |
| **Total** | | **$0/month** |

Only cost: Domain name (~$10-15/year) if you want custom domain.

---

## Next Steps

1. ✅ Deploy to Vercel/Netlify
2. ✅ Configure environment variables
3. ✅ Test website
4. ✅ Update Giscus with production domain
5. ✅ Submit sitemap to search engines
6. ✅ Write more articles!
7. ✅ Share with community

---

## Support

- **Documentation**: See `/docs` folder
- **Issues**: https://github.com/hnk24h/hocit/issues
- **Questions**: Use GitHub Discussions

---

## Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Giscus Setup](./GISCUS_SETUP.md)

---

**🎉 Chúc mừng! Website của bạn đã sẵn sàng production!**
