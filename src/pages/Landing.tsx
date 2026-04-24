import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, LayoutDashboard, Package, Wallet, Calendar, Users, BarChart3 } from 'lucide-react';

// Import images as ES modules so Vite can bundle and fingerprint them correctly
import imgBoutique from '../assets/craft-boutique.jpg';
import imgWoodshop from '../assets/craft-woodshop.jpg';
import imgFilmmaker from '../assets/craft-filmmaker.jpg';
import imgJewelry from '../assets/craft-jewelry.jpg';

import './Landing.css';

const images = [
  {
    src: imgBoutique,
    tag: 'Fashion & Retail',
    title: 'Clothing & Boutique Studios',
    subtitle: 'From inventory to orders — beautifully handled.',
  },
  {
    src: imgWoodshop,
    tag: 'Interior & Custom',
    title: 'Woodworking & Furniture',
    subtitle: 'Manage complex workshop operations with ease.',
  },
  {
    src: imgFilmmaker,
    tag: 'Media Production',
    title: 'Filmmaker & Creative Studios',
    subtitle: 'Schedule projects and manage your production team.',
  },
  {
    src: imgJewelry,
    tag: 'Fine Craft',
    title: 'Jewellery & Artisan Makers',
    subtitle: 'Track your craft business from bench to delivery.',
  },
];

// Disciplines showcase data — using the 4 unique images
const disciplines = [
  { 
    src: imgWoodshop,   
    title: 'Woodworking', 
    subtitle: 'Furniture & Custom builds',
    desc: 'Organize raw lumber stock, track complex CNC and assembly operations, and streamline custom furniture builds from blueprint to delivery.'
  },
  { 
    src: imgBoutique,   
    title: 'Fashion', 
    subtitle: 'Atelier & Retail',
    desc: 'Manage custom tailoring schedules and ready-to-wear inventory. Keep your atelier running smoothly by tracking fabrics and fittings.'
  },
  { 
    src: imgJewelry,    
    title: 'Jewellery', 
    subtitle: 'Fine Craft & Atelier',
    desc: 'Handle intricate material tracking for precious metals and stones. Schedule bench work and organize bespoke client commissions.'
  },
  { 
    src: imgFilmmaker,  
    title: 'Media', 
    subtitle: 'Film & Production',
    desc: 'Coordinate equipment rentals, cast scheduling, and post-production timelines. Ensure every shoot is meticulously planned.'
  }
];

const features = [
  { icon: <LayoutDashboard strokeWidth={1} size={28} />, title: 'Project Management', desc: 'Kanban boards, timelines, and task tracking tailored for creative workflows.' },
  { icon: <Package strokeWidth={1} size={28} />, title: 'Supply & Inventory',  desc: 'Track raw materials, tools, and consumables with low-stock alerts.' },
  { icon: <Wallet strokeWidth={1} size={28} />, title: 'Financial Overview',  desc: 'Monitor revenue, expenses, savings goals and project profitability.' },
  { icon: <Calendar strokeWidth={1} size={28} />, title: 'Interactive Scheduling', desc: 'Calendar events, deadlines, and team scheduling all in one dashboard.' },
  { icon: <Users strokeWidth={1} size={28} />, title: 'Client CRM',          desc: 'Manage your client database, orders, history, and communications.' },
  { icon: <BarChart3 strokeWidth={1} size={28} />, title: 'Live Analytics',       desc: 'Real-time performance charts and KPI tracking across all your projects.' },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled]           = useState(false);
  const [activeSlide, setActiveSlide]     = useState(0);
  const [activeGallery, setActiveGallery] = useState(0);
  const [isPaused, setIsPaused]           = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const galleryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero Auto-slide
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % images.length);
    }, 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Gallery Auto-slide
  useEffect(() => {
    if (isPaused) {
      if (galleryTimerRef.current) clearInterval(galleryTimerRef.current);
    } else {
      galleryTimerRef.current = setInterval(() => {
        setActiveGallery(prev => (prev + 1) % disciplines.length);
      }, 3500);
    }
    return () => { if (galleryTimerRef.current) clearInterval(galleryTimerRef.current); };
  }, [isPaused]);

  const current = images[activeSlide];

  return (
    <div className="landing-page">

      {/* ── NAV ── */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="nav-logo">Wood<span>crafters</span></a>
        <ul className="nav-links">
          <li><a href="#gallery">Collections</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#about">About</a></li>
          <li>
            <a href="/login" className="nav-cta"
               onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              Sign In
            </a>
          </li>
        </ul>
      </nav>

      {/* ── HERO CAROUSEL ── */}
      <section className="landing-hero">
        {images.map((img, i) => (
          <div key={i} className={`hero-slide ${i === activeSlide ? 'active' : ''}`}>
            <img src={img.src} alt={img.title} className="hero-slide-img" />
          </div>
        ))}
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-eyebrow">{current.tag}</div>
          <h1 className="hero-title">
            Run Your Craft.<br />
            <em>Grow Your</em><br />
            Workshop.
          </h1>
          <p className="hero-subtitle">{current.subtitle}</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Get Started Free <ArrowRight size={16} />
            </button>
            <a href="#features" className="btn-outline">Explore More</a>
          </div>
        </div>

        <div className="hero-controls">
          <div className="hero-dots">
            {images.map((_, i) => (
              <button key={i} className={`hero-dot ${i === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="landing-stats">
        {[
          { num: '2,400+', label: 'Active Workshops' },
          { num: '98%',    label: 'Client Retention'  },
          { num: '$14M+',  label: 'Revenue Managed'   },
          { num: '4.9★',  label: 'Average Rating'     },
        ].map((s, i) => (
          <div key={i} className="stat-item">
            <div className="stat-number">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── INTERACTIVE ACCORDION GALLERY ── */}
      <section className="landing-gallery" id="gallery">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Built for Every Maker</div>
            <h2 className="section-title">
              For every<br />
              <em>creative discipline</em>
            </h2>
          </div>
          <p className="section-desc">
            Explore how Woodcrafters adapts to your unique workflow, 
            from bespoke tailoring to cinematic production.
          </p>
        </div>

        <div 
          className="accordion-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {disciplines.map((item, i) => (
            <div 
              key={i} 
              className={`accordion-item ${i === activeGallery ? 'active' : ''}`}
              onMouseEnter={() => setActiveGallery(i)}
            >
              <img src={item.src} alt={item.title} className="accordion-img" />
              <div className="accordion-overlay" />
              
              <div className="accordion-content">
                <span className="accordion-tag">{item.subtitle}</span>
                <h3 className="accordion-title">{item.title}</h3>
                <div className="accordion-details">
                  <p className="accordion-desc">{item.desc}</p>
                  <button className="btn-outline btn-small">Learn More</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="landing-features" id="features">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Everything You Need</div>
            <h2 className="section-title">
              Powerful tools for<br />
              <em>independent makers</em>
            </h2>
          </div>
          <p className="section-desc">
            From raw material tracking to client invoicing — built for the way artisans actually work.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-cta">
        <h2 className="cta-title">
          Ready to scale<br />
          <em>your workshop?</em>
        </h2>
        <p className="cta-subtitle">
          Join thousands of makers who've streamlined operations and grown their businesses with Woodcrafters.
        </p>
        <div className="cta-actions">
          <button className="btn-primary" onClick={() => navigate('/login')}>
            Start for Free <ArrowRight size={16} />
          </button>
          <a href="#gallery" className="btn-outline">See a Demo</a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <span className="footer-copy">© 2026 Woodcrafters. Built for makers.</span>
        <ul className="footer-links">
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Help</a></li>
        </ul>
      </footer>

    </div>
  );
};

export default Landing;
