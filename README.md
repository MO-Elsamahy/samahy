# Mohamed Amir Elsamahy - Personal Portfolio

Professional portfolio website featuring a retro terminal aesthetic design.

## 🌟 Features

- 💚 **Pure Green Monochrome Theme** - Nostalgic terminal aesthetic
- 🖥️ **Retro Terminal Design** - CRT monitor effects and animations
- 📱 **Fully Responsive** - Works on all devices
- 🌐 **Multi-language Support** - RTL support for Arabic content
- 📧 **Contact Form** - With message management dashboard
- 📝 **Blog System** - Rich text editor with full content management
- 💼 **Portfolio Showcase** - Display projects with images and links
- 🔐 **Admin Dashboard** - Secure content management system
- 🌧️ **Matrix Rain Effect** - Animated binary code background
- ⚡ **Fast Performance** - Built with Next.js 14

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Rich Text Editor**: TipTap
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal-website
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

Run the following SQL in your Supabase SQL Editor:

### 1. Portfolio Items Table:
```sql
CREATE TABLE portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  project_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 2. Blog Posts Table:
```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 3. Contact Messages Table:
```sql
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 4. Enable Row Level Security (RLS):
```sql
-- Enable RLS on all tables
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read published portfolio" ON portfolio_items FOR SELECT USING (published = true);
CREATE POLICY "Public can read published blogs" ON blog_posts FOR SELECT USING (published = true);

-- Admin full access
CREATE POLICY "Authenticated users full access to portfolio" ON portfolio_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access to blogs" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read messages" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');

-- Anyone can send messages
CREATE POLICY "Anyone can send contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
```

## 🔑 Admin Access

1. Create an admin user in Supabase Dashboard → Authentication → Users
2. Go to `/dashboard/login`
3. Sign in with your credentials

## 📱 Pages

- **Home** (`/`) - Landing page with featured content
- **About** (`/about`) - Personal information and background
- **Portfolio** (`/portfolio`) - Projects showcase
- **Blog** (`/read`) - Blog posts listing
- **Contact** (`/contact`) - Contact form
- **Dashboard** (`/dashboard`) - Admin panel (protected)

## 🎨 Design Theme

The website features a **Retro Terminal** aesthetic inspired by early computer systems:
- Pure green monochrome color scheme
- CRT monitor effects (scanlines, flicker)
- Monospace font (Courier Prime)
- Terminal-style UI components
- Matrix rain binary code background
- Boot sequence loading screen

## 🚀 Deployment

### Deploy to Netlify:

1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

### Build Command:
```bash
npm run build
```

### Output Directory:
```
.next
```

## 📧 Contact

- **Email**: mohamed.amir2022@feps.edu.eg
- **LinkedIn**: [mohamedaelsamahy](https://www.linkedin.com/in/mohamedaelsamahy/)
- **Facebook**: [M.ELSAMAHYY](https://www.facebook.com/M.ELSAMAHYY)

## 📄 License

© 2025 Mohamed Amir Elsamahy. All rights reserved.

---

Built with 💚 using Next.js & Supabase
