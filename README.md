# Startup India Incubation Platform

A premium, industry-grade code-based incubation platform built with Next.js, Supabase, and pure CSS. This platform enables users to enroll in courses, watch structured video lessons, complete assignments, take quizzes, and earn certificates.

## 🚀 Features

- **User Authentication**: Secure email/password authentication with Supabase Auth
- **Course Management**: Browse and enroll in courses with payment integration
- **Video Learning**: Controlled video playback with progress tracking
  - Disabled seek/forward skip
  - Automatic progress saving every 30 seconds
  - Watermark overlay for content protection
  - Right-click disabled
- **Assignments**: 150-word minimum reflection assignments after each lesson
- **Quizzes**: Interactive quizzes with 75% passing requirement
  - One attempt per quiz
  - Immediate feedback
- **Certificates**: Auto-generated certificates upon course completion
- **Progress Tracking**: Real-time tracking of video completion, assignments, and quiz scores
- **Responsive Design**: Mobile-friendly pure CSS styling

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Pure CSS (CSS Modules + Global CSS)
- **Authentication & Database**: Supabase
- **Payments**: Stripe (Test Mode)
- **Video Hosting**: Configurable (Mux/Supabase Storage)

## 📁 Project Structure

```
/
├── app/
│   ├── layout.js                 # Root layout with Navbar
│   ├── page.js                   # Homepage
│   ├── login/page.js             # Login page
│   ├── signup/page.js            # Signup page
│   ├── dashboard/page.js         # User dashboard
│   ├── course/[id]/page.js       # Course video player
│   ├── quiz/[id]/page.js         # Quiz page
│   ├── certificate/page.js       # Certificates page
│   └── api/
│       ├── progress/route.js     # Progress tracking API
│       ├── quiz/route.js         # Quiz submission API
│       ├── certificate/route.js  # Certificate generation API
│       └── enrollment/route.js   # Enrollment & payment API
├── components/
│   ├── Navbar.js                 # Navigation bar
│   ├── VideoPlayer.js            # Protected video player
│   ├── QuizForm.js               # Quiz interface
│   ├── AssignmentForm.js         # Assignment submission
│   ├── CertificateCard.js        # Certificate display
│   └── ProtectedRoute.js         # Auth wrapper
├── lib/
│   ├── supabaseClient.js         # Supabase configuration
│   └── auth.js                   # Authentication helpers
├── styles/
│   ├── globals.css               # Global styles
│   ├── navbar.css                # Navbar styles
│   ├── home.css                  # Homepage styles
│   ├── auth.css                  # Auth pages styles
│   ├── dashboard.css             # Dashboard styles
│   ├── video.css                 # Video player styles
│   ├── quiz.css                  # Quiz styles
│   └── certificate.css           # Certificate styles
└── supabase-schema.sql           # Database schema
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Setup Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the SQL to create all tables, policies, and indexes

### 4. Add Sample Data (Optional)

Add sample courses and videos to test the platform:

```sql
-- Insert a sample course
INSERT INTO courses (title, description, price) VALUES
('Startup Fundamentals', 'Learn the basics of building a successful startup', 0);

-- Get the course ID and insert sample videos
INSERT INTO videos (course_id, title, video_url, duration, order_index) VALUES
('your-course-id', 'Introduction to Startups', 'https://your-video-url.mp4', 600, 1),
('your-course-id', 'Market Research', 'https://your-video-url.mp4', 900, 2);

-- Insert sample quiz questions
INSERT INTO quizzes (video_id, question, options, correct_answer) VALUES
('your-video-id', 'What is the first step in building a startup?',
 '["Market Research", "Building Product", "Hiring Team", "Fundraising"]', 0);
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Tables

- **courses**: Course information (title, description, price, thumbnail)
- **videos**: Video lessons (course_id, title, video_url, duration, order)
- **enrollments**: User course enrollments (user_id, course_id, payment_status)
- **progress**: Video watch progress (user_id, video_id, watched_seconds, completed)
- **assignments**: User assignment submissions (user_id, video_id, reflection_text)
- **quizzes**: Quiz questions (video_id, question, options, correct_answer)
- **quiz_responses**: User quiz answers (user_id, quiz_id, selected_option, is_correct)
- **certificates**: Generated certificates (user_id, course_id, issued_date)

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring users can only access their own data.

## 🎯 User Flow

1. **Sign Up/Login**: User creates account or signs in
2. **Browse Courses**: View available courses on dashboard
3. **Enroll**: Click "Enroll Now" (payment integration for paid courses)
4. **Watch Videos**:
   - Videos must be watched in order
   - Progress auto-saved every 30 seconds
   - Cannot skip ahead
5. **Submit Assignment**: Write 150+ word reflection after each video
6. **Take Quiz**:
   - Must complete video and assignment first
   - One attempt only
   - 75% minimum to pass
7. **Earn Certificate**: Auto-generated when all requirements met
   - All videos completed
   - All assignments submitted
   - All quizzes passed

## 🔒 Security Features

- **Content Protection**:
  - Videos cannot be downloaded
  - Right-click disabled
  - Watermark overlay with user ID
  - Seek/skip disabled
  - Picture-in-picture disabled
- **Authentication**:
  - Supabase Auth with JWT tokens
  - Protected routes
  - Row-level security on all data

- **Payment Security**:
  - Stripe integration for secure payments
  - Server-side payment verification

## 🎨 Styling

Pure CSS with custom properties for theming:

- Responsive design (mobile-first)
- Modern gradient backgrounds
- Smooth animations and transitions
- Accessible color contrast
- Clean, professional UI

## 📱 Responsive Design

- Desktop: Full layout with sidebar
- Tablet: Adjusted grid layouts
- Mobile: Single column, hamburger menu

## 🧪 Testing

1. **Test Stripe Payments**: Use test card `4242 4242 4242 4242`
2. **Test User Flow**: Create account → Enroll → Watch → Assignment → Quiz → Certificate
3. **Test Progress Tracking**: Refresh page during video to verify progress saved
4. **Test Quiz Logic**: Verify one-attempt restriction and 75% passing requirement

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Compatible with any Next.js hosting platform (Netlify, Railway, etc.)

## 📝 Environment Variables Reference

| Variable                           | Description                             | Required |
| ---------------------------------- | --------------------------------------- | -------- |
| NEXT_PUBLIC_SUPABASE_URL           | Supabase project URL                    | Yes      |
| NEXT_PUBLIC_SUPABASE_ANON_KEY      | Supabase anonymous key                  | Yes      |
| SUPABASE_SERVICE_ROLE_KEY          | Supabase service role key (server-side) | Yes      |
| STRIPE_SECRET_KEY                  | Stripe secret key                       | Yes      |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe publishable key                  | Yes      |
| NEXT_PUBLIC_APP_URL                | Application URL                         | Yes      |

## 🤝 Contributing

This is a production-ready platform. For customization:

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - feel free to use for your own projects

## 🆘 Support

For issues or questions:

- Check Supabase documentation
- Review Next.js documentation
- Check Stripe API documentation

## 🎓 Course Completion Requirements

To earn a certificate, students must:

- ✅ Watch all videos to 100% completion
- ✅ Submit assignments (150+ words) for each video
- ✅ Pass all quizzes with 75% or higher score
- ✅ Complete all requirements in sequential order

## 🔄 Future Enhancements

Potential features to add:

- Live sessions integration
- Discussion forums
- Peer review system
- Advanced analytics dashboard
- Mobile app
- Downloadable course materials
- Multiple language support
- Social sharing of certificates

---

Built with ❤️ for Startup India Incubation by DevUp Society
