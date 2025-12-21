# Micaiah Raj R - Portfolio Website

A modern, responsive portfolio website showcasing AI & ML engineering projects, experience, and skills.

## 🚀 Features

- **Responsive Design**: Fully responsive across all devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Fast Loading**: Optimized for performance
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Interactive Elements**: Smooth scrolling, hover effects, and animations
- **GitHub Pages Ready**: Easy deployment to GitHub Pages

## 📁 Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── script.js           # JavaScript for interactions
├── README.md           # This file
└── CNAME              # Custom domain configuration (optional)
```

## 🛠️ Technologies Used

- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript
- Google Fonts (Playfair Display & Work Sans)

## 📦 Deployment to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `your-username.github.io` (replace `your-username` with your GitHub username)
   - Example: `micaiah-raj.github.io`
3. Make sure the repository is **Public**
4. Don't initialize with README (we already have one)

### Step 2: Upload Your Files

**Option A: Using Git (Recommended)**

```bash
# Navigate to your project folder
cd portfolio

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Portfolio website"

# Add your GitHub repository as remote
git remote add origin https://github.com/your-username/your-username.github.io.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Option B: Using GitHub Web Interface**

1. Go to your repository on GitHub
2. Click "Add file" → "Upload files"
3. Drag and drop all your portfolio files
4. Click "Commit changes"

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** (in the left sidebar)
4. Under "Source", select **main** branch
5. Click **Save**
6. Your site will be published at: `https://your-username.github.io`

## 🌐 Connecting to Namecheap Domain

### Step 1: Configure GitHub Repository

1. In your repository, create a file named `CNAME` (no extension)
2. Add your custom domain to this file:
   ```
   yourdomain.com
   ```
   Or with www:
   ```
   www.yourdomain.com
   ```
3. Commit and push this file to GitHub

### Step 2: Configure Namecheap DNS

1. Log in to your [Namecheap account](https://www.namecheap.com)
2. Go to **Domain List** and click **Manage** next to your domain
3. Go to **Advanced DNS** tab
4. Add the following DNS records:

**For Root Domain (yourdomain.com):**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 185.199.108.153 | Automatic |
| A Record | @ | 185.199.109.153 | Automatic |
| A Record | @ | 185.199.110.153 | Automatic |
| A Record | @ | 185.199.111.153 | Automatic |

**For WWW Subdomain (www.yourdomain.com):**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME Record | www | your-username.github.io | Automatic |

### Step 3: Verify Custom Domain

1. Go back to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under "Custom domain", enter your domain: `yourdomain.com`
4. Click **Save**
5. Wait for DNS check to complete (can take up to 24-48 hours)
6. Once verified, check **Enforce HTTPS** for secure connection

### Troubleshooting DNS

If your site doesn't load after 24 hours:

1. Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net/)
2. Verify CNAME file is in your repository root
3. Ensure DNS records are correctly configured in Namecheap
4. Clear your browser cache or try incognito mode

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #1a1a2e;
    --secondary-color: #16213e;
    --accent-color: #0f3460;
    --highlight-color: #e94560;
    /* ... */
}
```

### Updating Content

1. **Personal Information**: Edit the HTML in `index.html`
2. **Add Projects**: Duplicate a `.project-card` div and update the content
3. **Add Experience**: Duplicate an `.experience-card` div and update the content
4. **Update Skills**: Modify the skill categories in the skills section

### Adding Analytics (Optional)

Add Google Analytics by inserting the tracking code before `</head>` in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

## 📱 Testing Responsiveness

Test your site on different devices:
- Desktop: 1920px, 1440px, 1024px
- Tablet: 768px
- Mobile: 375px, 414px

Use browser DevTools (F12) to test responsive design.

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This portfolio template is free to use and modify for personal use.

## 📞 Support

If you need help with deployment or customization, feel free to reach out:
- Email: rmicaiahraj@gmail.com
- LinkedIn: [linkedin.com/in/micaiah-raj-r](https://linkedin.com/in/micaiah-raj-r)

## 🎯 Next Steps

1. [ ] Deploy to GitHub Pages
2. [ ] Connect custom domain from Namecheap
3. [ ] Add Google Analytics (optional)
4. [ ] Add more projects as you complete them
5. [ ] Update resume and experience regularly
6. [ ] Share your portfolio link on LinkedIn and resume

---

**Built with ❤️ by Micaiah Raj R**
