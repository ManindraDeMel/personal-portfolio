import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import './App.css';
import Navbar from './components/Navbar';

const Home = lazy(() => import('./pages/Home'));
const ResearchIndex = lazy(() => import('./pages/ResearchIndex'));
const WorkIndex = lazy(() => import('./pages/WorkIndex'));
const SitesIndex = lazy(() => import('./pages/SitesIndex'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

const ROUTE_FALLBACK = (
  <div style={{ minHeight: '60vh' }} aria-hidden="true" />
);

function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace(/^#/, '');
      const tryScroll = () => {
        if (id === 'top') {
          window.scrollTo({ top: 0 });
          return true;
        }
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });
          return true;
        }
        return false;
      };
      if (!tryScroll()) {
        const t1 = window.setTimeout(tryScroll, 80);
        const t2 = window.setTimeout(tryScroll, 240);
        const t3 = window.setTimeout(tryScroll, 600);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
      }
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname, location.hash]);
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Helmet>
          <title>Manindra de Mel — Software Engineer & ML Researcher</title>
        </Helmet>
        <ScrollManager />
        <div className="App">
          <a href="#main-content" className="skip-to-content">Skip to content</a>
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            <Suspense fallback={ROUTE_FALLBACK}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/research" element={<ResearchIndex />} />
                <Route path="/research/:slug" element={<ProjectDetail context="research" />} />
                <Route path="/work" element={<WorkIndex />} />
                <Route path="/work/:slug" element={<ProjectDetail context="work" />} />
                <Route path="/sites" element={<SitesIndex />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
