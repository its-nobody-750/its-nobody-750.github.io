# Quick Setup Guide

## 🚀 Fast Track Deployment

### 1️⃣ GitHub Pages Setup (5 minutes)

```bash
# Create repository: your-username.github.io
# Upload all portfolio files
# Settings → Pages → Source: main branch → Save
# Your site: https://your-username.github.io
```

### 2️⃣ Namecheap Domain Connection (10 minutes)

**Update CNAME file:**
- Replace `yourdomain.com` with your actual domain

**In Namecheap Advanced DNS:**

Add these A Records (Host: @):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Add CNAME Record:
```
Type: CNAME
Host: www
Value: your-username.github.io
```

**In GitHub Settings → Pages:**
- Enter your custom domain
- Enable HTTPS (after DNS verification)

### 3️⃣ Customization Checklist

- [ ] Replace `yourdomain.com` in CNAME file
- [ ] Update GitHub username in README
- [ ] Test all links work correctly
- [ ] Verify mobile responsiveness
- [ ] Check loading speed

### 📝 Important Notes

1. **DNS Propagation**: Takes 1-48 hours
2. **HTTPS**: Enable after domain verification
3. **Repository Name**: Must be `username.github.io` for user site
4. **CNAME File**: Must be in repository root

### 🎨 Quick Customization

**Colors** (styles.css line 1-10):
```css
--highlight-color: #e94560;  /* Change accent color */
--background: #0a0e27;        /* Change background */
```

**Content** (index.html):
- Hero section: Line 30-50
- Projects: Line 200-280
- Contact: Line 450-480

### ✅ Testing Checklist

- [ ] Site loads on GitHub Pages
- [ ] All navigation links work
- [ ] Mobile menu functions
- [ ] Contact links are correct
- [ ] Custom domain resolves
- [ ] HTTPS is enabled

### 🔗 Helpful Resources

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Namecheap DNS Guide](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/)
- [Check DNS Propagation](https://www.whatsmydns.net/)

### 🆘 Common Issues

**Site not loading:**
- Wait 5 minutes after enabling GitHub Pages
- Check repository is public
- Verify branch is set to 'main'

**Custom domain not working:**
- Check CNAME file exists in root
- Verify DNS records in Namecheap
- Wait for DNS propagation (up to 48 hours)
- Try clearing browser cache

**Mobile menu not working:**
- Make sure script.js is loaded
- Check browser console for errors

---

**Need help?** Email: rmicaiahraj@gmail.com
