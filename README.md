# LearnAI Platform 🎓

An interactive educational platform for AI/Python curriculum with hands-on coding.

**Live URL:** https://learnai-platform.vercel.app

## Features

- 🏠 **Landing Page** - Beautiful hero, features showcase
- 📚 **Multi-Course Support** - Scalable course catalog
- 📖 **Interactive Lessons** - Learn → Practice → Quiz flow
- 💻 **Live Python** - Run code in browser (NumPy, Pandas, Matplotlib)
- ✅ **Progress Tracking** - XP, completion tracking
- 📱 **Responsive** - Works on mobile

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Animations:** Framer Motion
- **Code Execution:** Pyodide (Python in browser)
- **Hosting:** Vercel
- **Auth:** Supabase (ready for integration)

## Development

```bash
# Install
npm install

# Dev server
npm run dev

# Build
npm run build
```

## Deployment

Auto-deploys on push to `main`:

```bash
git add -A && git commit -m "changes" && git push
```

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.jsx      # Hero + features
│   ├── CourseCatalog.jsx    # Course grid
│   └── CoursePage.jsx       # Lesson viewer
├── components/
│   ├── InteractiveCode.jsx  # Pyodide runner
│   ├── InteractiveTheory.jsx # Theory blocks
│   ├── Quiz.jsx             # Quiz component
│   └── ...
├── contexts/
│   └── AuthContext.jsx      # Auth state
└── lib/
    └── supabase.js          # Supabase client
```

## License

MIT
