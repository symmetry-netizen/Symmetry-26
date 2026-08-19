# Quick Deployment Guide

## 🚀 Deploy to Netlify (Recommended)

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/symmetry25-website.git
   git push -u origin main
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Deploy!

## 🌐 Deploy to GitHub Pages

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "main" branch as source
   - Save

2. **Your site will be available at:**
   `https://yourusername.github.io/repository-name`

## 📁 Local Development

### Using Python
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

### Using Node.js
```bash
npx serve .
# Visit http://localhost:3000
```

### Using PHP
```bash
php -S localhost:8000
# Visit http://localhost:8000
```

## 🔧 Customization Checklist

Before deploying, update these items:

- [ ] Replace Google Form URLs in `index.html`
- [ ] Update contact information
- [ ] Add your social media links
- [ ] Customize event details
- [ ] Add your logo/branding

## 📧 Contact Form Setup

The contact form currently shows a success message. To make it functional:

1. **Using Netlify Forms** (Automatic with Netlify)
2. **Using Formspree**:
   - Sign up at [formspree.io](https://formspree.io)
   - Replace form action with your Formspree endpoint
3. **Using EmailJS**:
   - Sign up at [emailjs.com](https://emailjs.com)
   - Add EmailJS script and configuration

## 🔒 Security & Performance

- ✅ HTTPS enabled (automatic with Netlify/GitHub Pages)
- ✅ Form validation included
- ✅ Responsive design
- ✅ Optimized for performance

## 📱 Testing Checklist

- [ ] Test on desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Test navigation dropdown
- [ ] Test contact form
- [ ] Test FAQ accordion
- [ ] Test registration links

## 🎯 Quick Start Commands

```bash
# Clone and setup
git clone https://github.com/yourusername/symmetry25-website.git
cd symmetry25-website

# Start local server
python -m http.server 8000

# Open in browser
start http://localhost:8000
```

## 📞 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Open an issue on GitHub for bugs
- Contact: symmetry25@presidencyuniversity.ac.in

---

**Your website is ready to go live! 🎉**
