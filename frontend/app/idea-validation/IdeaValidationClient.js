'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Lightbulb, User, FlaskConical, MessageSquare,
  ShieldCheck, Hammer, AlertTriangle, TrendingUp,
  Search, Users, Target, BarChart3, RefreshCw,
  Map, ArrowRight, CheckCircle2, Zap, Image as ImageIcon,
  HelpCircle, Rocket, Frown, Check, UserCheck, Pencil, Puzzle,
  PieChart, Star, ClipboardCheck, ChevronRight, ChevronLeft, GraduationCap
} from 'lucide-react';
import '../../styles/idea-validation.css';

/* ── Animation variants (reused across sections) ──────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ══════════════════════════════════════════════════════════════
   SECTION 01 — HERO
   ══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const journeyStages = [
    { label: 'Understand Users', icon: Users },
    { label: 'Test Assumptions', icon: Search },
    { label: 'Validate & Refine', icon: RefreshCw },
    { label: 'Build With Confidence', icon: ShieldCheck },
  ];

  return (
    <section className="iv-hero iv-section" id="iv-hero">
      <div className="iv-container">
        <div className="iv-hero__grid">
          {/* LEFT — Content */}
          <motion.div
            className="iv-hero__content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp}>
              <div className="iv-eyebrow">
                <span className="iv-eyebrow__dot" />
                IDEA VALIDATION PROGRAM
              </div>
            </motion.div>

            <motion.h1 className="iv-hero__heading" variants={fadeUp}>
              Don't Build on<br />
              <span className="red">a Guess.</span>
            </motion.h1>

            <motion.h2 className="iv-hero__subheading" variants={fadeUp}>
              Validate Your Idea Before You Build It.
            </motion.h2>

            <motion.p className="iv-hero__desc" variants={fadeUp}>
              Our Idea Validation Program helps founders and aspiring entrepreneurs
              test their ideas, understand real user needs, and gather evidence to
              build solutions that people actually want.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Link href="/signup" className="iv-cta">
                <span>Validate Your Idea</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT — Image Container Visual with Validation Journey */}
          <motion.div
            className="iv-hero__image-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="iv-hero__image-card">
              {/* Decorative Tech Corner Accents */}
              <span className="iv-corner iv-corner--tl" />
              <span className="iv-corner iv-corner--br" />
              <div className="iv-dots-pattern" aria-hidden="true" />

              {/* Placeholder Content */}
              <div className="iv-placeholder-content">
                <div className="iv-placeholder-icon">
                  <ImageIcon size={32} />
                </div>
                <div className="iv-placeholder-title">Place Your Image Here</div>
                <div className="iv-placeholder-sub">1600 × 900</div>
              </div>

              {/* Validation Journey Bottom Overlay Strip */}
              <div className="iv-hero-journey">
                <div className="iv-hero-journey__track">
                  {journeyStages.map((stage) => (
                    <div key={stage.label} className="iv-hero-journey__stage">
                      <div className="iv-hero-journey__node">
                        <stage.icon size={18} strokeWidth={2} />
                      </div>
                      <span className="iv-hero-journey__label">{stage.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* HERO STATISTICS BAR */}
        <motion.div
          className="iv-stats-card"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="iv-stats-grid">
            <motion.div className="iv-stat-item" variants={fadeUp}>
              <div className="iv-stat-icon">
                <Lightbulb size={24} strokeWidth={2} />
              </div>
              <div className="iv-stat-info">
                <div className="iv-stat-val">500+</div>
                <div className="iv-stat-lbl">Ideas Validated</div>
              </div>
            </motion.div>

            <div className="iv-stat-divider" />

            <motion.div className="iv-stat-item" variants={fadeUp}>
              <div className="iv-stat-icon">
                <Users size={24} strokeWidth={2} />
              </div>
              <div className="iv-stat-info">
                <div className="iv-stat-val">2500+</div>
                <div className="iv-stat-lbl">Founders Supported</div>
              </div>
            </motion.div>

            <div className="iv-stat-divider" />

            <motion.div className="iv-stat-item" variants={fadeUp}>
              <div className="iv-stat-icon">
                <TrendingUp size={24} strokeWidth={2} />
              </div>
              <div className="iv-stat-info">
                <div className="iv-stat-val">10K+</div>
                <div className="iv-stat-lbl">User Interviews</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════════════
   SECTION 02 — RISKY WAY vs SMART WAY
   ══════════════════════════════════════════════════════════════ */
function CompareSection() {
  const riskyStages = [
    {
      num: 1,
      title: 'Idea',
      desc: 'You have an idea',
      icon: Lightbulb,
    },
    {
      num: 2,
      title: 'Assumption',
      desc: "You assume it's a good idea",
      icon: HelpCircle,
    },
    {
      num: 3,
      title: 'Build',
      desc: 'You build the product',
      icon: Hammer,
    },
    {
      num: 4,
      title: 'Launch',
      desc: 'You launch it to the world',
      icon: Rocket,
    },
    {
      num: 5,
      title: 'Nobody Wants It',
      desc: 'No traction. No users.',
      icon: Frown,
      isDanger: true,
    },
  ];

  const smartStages = [
    {
      num: 1,
      title: 'Idea',
      desc: 'You have an idea',
      icon: Lightbulb,
    },
    {
      num: 2,
      title: 'Problem Validation',
      desc: "You validate if it's a real problem",
      icon: UserCheck,
    },
    {
      num: 3,
      title: 'Customer Feedback',
      desc: 'You talk to real users and gather feedback',
      icon: Users,
    },
    {
      num: 4,
      title: 'Refine',
      desc: 'You refine your solution based on insights',
      icon: Pencil,
    },
    {
      num: 5,
      title: 'Build With Confidence',
      desc: 'You build something people actually want',
      icon: ShieldCheck,
      isSuccess: true,
    },
  ];

  return (
    <section className="iv-compare iv-section" id="iv-compare">
      <div className="iv-container">
        {/* Header */}
        <motion.div
          className="iv-compare__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <div className="iv-compare__header-left">
            <div className="iv-compare__eyebrow">
              <span className="iv-compare__section-num">02</span>
              <span className="iv-compare__dash" />
              <span className="iv-compare__section-tag">IDEA REALITY CHECK</span>
            </div>
            <h2 className="iv-heading iv-compare__heading">
              A Great Idea<br />
              <span className="red">Isn't Enough.</span>
            </h2>
          </div>

          <div className="iv-compare__header-divider">
            <span className="iv-compare__header-dot" />
          </div>

          <div className="iv-compare__header-right">
            <p className="iv-compare__description">
              Most ideas fail not because they're bad,<br className="iv-compare__br-desktop" />
              but because they're never tested with real users.
            </p>
          </div>
        </motion.div>

        {/* Comparison Process Rows */}
        <motion.div
          className="iv-compare__rows"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {/* THE RISKY WAY ROW */}
          <motion.div className="iv-compare-card iv-compare-card--risky" variants={fadeUp}>
            {/* Left Sidebar Label */}
            <div className="iv-compare-card__sidebar">
              <div className="iv-compare-card__badge-icon">
                <AlertTriangle size={38} strokeWidth={2.25} />
              </div>
              <div className="iv-compare-card__label">THE RISKY WAY</div>
              <div className="iv-compare-card__indicator" />
            </div>

            {/* Right Timeline */}
            <div className="iv-compare-card__timeline-wrapper">
              <div className="iv-compare-card__timeline">
                {riskyStages.map((stage, i) => (
                  <div
                    key={stage.num}
                    className={`iv-compare-node ${stage.isDanger ? 'iv-compare-node--danger' : ''}`}
                  >
                    {/* Node circle & icon */}
                    <div className="iv-compare-node__circle">
                      <stage.icon size={34} strokeWidth={2.25} />
                      <span className="iv-compare-node__badge">{stage.num}</span>
                    </div>

                    {/* Node Text */}
                    <div className="iv-compare-node__content">
                      <div className="iv-compare-node__title">{stage.title}</div>
                      <div className="iv-compare-node__sub">{stage.desc}</div>
                    </div>

                    {/* Connector segment to next node */}
                    {i < riskyStages.length - 1 && (
                      <div className="iv-compare-connector">
                        <span className="iv-compare-connector__line" />
                        <span className="iv-compare-connector__dot" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* THE SMART WAY ROW */}
          <motion.div className="iv-compare-card iv-compare-card--smart" variants={fadeUp}>
            {/* Left Sidebar Label */}
            <div className="iv-compare-card__sidebar">
              <div className="iv-compare-card__badge-icon">
                <Check size={38} strokeWidth={2.75} />
              </div>
              <div className="iv-compare-card__label">THE SMART WAY</div>
              <div className="iv-compare-card__indicator" />
            </div>

            {/* Right Timeline */}
            <div className="iv-compare-card__timeline-wrapper">
              <div className="iv-compare-card__timeline">
                {smartStages.map((stage, i) => (
                  <div
                    key={stage.num}
                    className={`iv-compare-node ${stage.isSuccess ? 'iv-compare-node--success' : ''}`}
                  >
                    {/* Node circle & icon */}
                    <div className="iv-compare-node__circle">
                      <stage.icon size={34} strokeWidth={2.25} />
                      <span className="iv-compare-node__badge">{stage.num}</span>
                    </div>

                    {/* Node Text */}
                    <div className="iv-compare-node__content">
                      <div className="iv-compare-node__title">{stage.title}</div>
                      <div className="iv-compare-node__sub">{stage.desc}</div>
                    </div>

                    {/* Connector segment to next node */}
                    {i < smartStages.length - 1 && (
                      <div className="iv-compare-connector">
                        <span className="iv-compare-connector__line" />
                        <span className="iv-compare-connector__dot" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* BOTTOM INSIGHT STRIP */}
          <motion.div className="iv-compare-insight" variants={fadeUp}>
            <div className="iv-compare-insight__dots-left" aria-hidden="true" />
            
            <div className="iv-compare-insight__left">
              <div className="iv-compare-insight__icon">
                <TrendingUp size={36} strokeWidth={2.25} />
              </div>
              <div className="iv-compare-insight__headline">
                <div>Test early.</div>
                <div>Learn fast.</div>
                <div>Build what matters.</div>
              </div>
            </div>

            <div className="iv-compare-insight__divider" />

            <div className="iv-compare-insight__right">
              <div className="iv-compare-insight__body">
                Validation saves time, money, and effort.
              </div>
              <div className="iv-compare-insight__highlight">
                And it increases your chances of success.
              </div>
            </div>

            <div className="iv-compare-insight__dots-right" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════════════
   SECTION 03 — WHAT WE HELP YOU VALIDATE
   ══════════════════════════════════════════════════════════════ */
function ValidationDiagramSection() {
  const cards = [
    {
      num: '01',
      title: 'Problem',
      desc: 'Is this a real problem worth solving?',
      icon: HelpCircle,
    },
    {
      num: '02',
      title: 'Customer',
      desc: 'Who actually experiences this problem?',
      icon: Users,
    },
    {
      num: '03',
      title: 'Solution',
      desc: 'Does your proposed solution make sense to them?',
      icon: Puzzle,
    },
    {
      num: '04',
      title: 'Demand',
      desc: 'Would people actually use or pay for your solution?',
      icon: TrendingUp,
    },
  ];

  return (
    <section className="iv-validate iv-section" id="iv-validate">
      <div className="iv-container">
        {/* Header */}
        <motion.div
          className="iv-validate__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <div className="iv-validate__header-left">
            <div className="iv-validate__eyebrow">
              <span className="iv-validate__section-num">03</span>
              <span className="iv-validate__dash" />
              <span className="iv-validate__section-tag">WHAT YOU'LL TEST</span>
            </div>
            <h2 className="iv-heading iv-validate__heading">
              What You Will<br />
              <span className="red">Validate.</span>
            </h2>
            <div className="iv-validate__heading-indicator" />
          </div>

          <div className="iv-validate__header-divider">
            <span className="iv-validate__header-dot" />
          </div>

          <div className="iv-validate__header-right">
            <p className="iv-validate__description">
              Every critical dimension of your startup concept, tested before you spend time or money building.
            </p>
          </div>
        </motion.div>

        {/* 5 Cards Row */}
        <motion.div
          className="iv-validate__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {cards.map((card, i) => (
            <motion.div key={card.num} className="iv-validate-card" variants={fadeUp}>
              <div className="iv-validate-card__badge">{card.num}</div>

              <div className="iv-validate-card__icon-wrap">
                <div className="iv-validate-card__icon">
                  <card.icon size={26} strokeWidth={2.2} />
                </div>
              </div>

              <h3 className="iv-validate-card__title">{card.title}</h3>
              <div className="iv-validate-card__indicator" />
              <p className="iv-validate-card__desc">{card.desc}</p>

              {i < cards.length - 1 && (
                <div className="iv-validate-card__connector" aria-hidden="true">
                  <span className="iv-validate-card__connector-line" />
                  <span className="iv-validate-card__connector-dot" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Insight Strip */}
        <motion.div className="iv-validate-insight" variants={fadeUp}>
          <div className="iv-validate-insight__dots-left" aria-hidden="true" />

          {/* Left Insight */}
          <div className="iv-validate-insight__block iv-validate-insight__left">
            <div className="iv-validate-insight__icon">
              <Lightbulb size={30} strokeWidth={2.25} />
            </div>
            <div className="iv-validate-insight__text">
              The right answers now can <span className="red">save</span> you months of work and <span className="red">thousands of dollars</span> later.
            </div>
          </div>

          <div className="iv-validate-insight__divider" />

          {/* Right Insight */}
          <div className="iv-validate-insight__block iv-validate-insight__right">
            <div className="iv-validate-insight__icon iv-validate-insight__icon--target">
              <Target size={30} strokeWidth={2.25} />
            </div>
            <div className="iv-validate-insight__text-stack">
              <div className="iv-validate-insight__sub">Validate early.</div>
              <div className="iv-validate-insight__main red">Build with confidence.</div>
            </div>
          </div>

          <div className="iv-validate-insight__dots-right" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════════════
   SECTION 04 — HOW THE PROGRAM WORKS (INTERACTIVE ROADMAP)
   ══════════════════════════════════════════════════════════════ */
function TimelineSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Define',
      desc: 'Clarify your problem and hypothesis.',
      icon: Target,
      image: '/assets/images/process/define.jpg',
      alt: 'Glowing red target board on dark terrain with arrow in bullseye',
    },
    {
      num: '02',
      title: 'Discover',
      desc: 'Talk to potential users and understand their needs.',
      icon: Search,
      image: '/assets/images/process/discover.jpg',
      alt: 'Founder engaging in user discovery interview with potential users',
    },
    {
      num: '03',
      title: 'Test',
      desc: 'Put your idea in front of real users and gather feedback.',
      icon: FlaskConical,
      image: '/assets/images/process/test.jpg',
      alt: 'Glowing glass chemistry beaker in a dark laboratory',
    },
    {
      num: '04',
      title: 'Learn',
      desc: 'Analyze feedback and identify what needs to change.',
      icon: PieChart,
      image: '/assets/images/process/learn.jpg',
      alt: 'Computer monitor displaying analytical data charts and metrics',
    },
    {
      num: '05',
      title: 'Validate',
      desc: 'Decide whether to build, pivot, or rethink.',
      icon: ShieldCheck,
      image: '/assets/images/process/validate.jpg',
      alt: 'Dramatic mountain summit with glowing red flag and route path',
    },
  ];

  const handlePrev = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  return (
    <section className="iv-timeline iv-section" id="iv-timeline">
      <div className="iv-container">
        {/* Header */}
        <motion.div
          className="iv-timeline__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <div className="iv-timeline__header-left">
            <div className="iv-timeline__eyebrow">
              <span className="iv-timeline__section-num">04</span>
              <span className="iv-timeline__dash" />
              <span className="iv-timeline__section-tag">OUR PROCESS</span>
            </div>
            <h2 className="iv-heading iv-timeline__heading">
              How the Program<br />
              <span className="red">Works.</span>
            </h2>
            <div className="iv-timeline__heading-indicator" />
          </div>

          <div className="iv-timeline__header-divider">
            <span className="iv-timeline__header-dot" />
          </div>

          <div className="iv-timeline__header-right">
            <p className="iv-timeline__description">
              A step-by-step process to go from idea to validated opportunity.
            </p>
          </div>
        </motion.div>
        {/* Interactive Roadmap Panel Container */}
        <motion.div
          className="iv-roadmap-panel"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          {/* Clean Horizontal Roadmap Track & Nodes Layer */}
          <div className="iv-roadmap-track-container">
            {/* Straight Horizontal Progress Line */}
            <div className="iv-roadmap-line-bg" aria-hidden="true" />
            <div
              className="iv-roadmap-line-active"
              style={{ width: `${(activeStep / (steps.length - 1)) * 80 + 10}%` }}
              aria-hidden="true"
            />

            {/* Five Compact Circular Stage Markers */}
            <div className="iv-roadmap-nodes">
              {steps.map((step, i) => {
                const isActive = i === activeStep;
                const isPassed = i < activeStep;
                const IconComponent = step.icon;

                return (
                  <div
                    key={step.num}
                    className={`iv-roadmap-node-wrapper iv-roadmap-node-wrapper--${i}`}
                  >
                    {/* Compact YOU ARE HERE Pill (above active node) */}
                    {isActive && (
                      <motion.div
                        className="iv-roadmap-here-badge"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span>YOU ARE HERE</span>
                        <span className="iv-roadmap-here-badge__pointer" />
                      </motion.div>
                    )}

                    {/* Stage Number Above Node */}
                    <div className={`iv-roadmap-node__num ${isActive ? 'active' : isPassed ? 'passed' : ''}`}>
                      {step.num}
                    </div>

                    {/* Interactive Node Button */}
                    <button
                      type="button"
                      className={`iv-roadmap-node ${isActive ? 'active' : isPassed ? 'passed' : ''}`}
                      onClick={() => setActiveStep(i)}
                      aria-label={`Stage ${step.num}: ${step.title}`}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      <IconComponent size={18} strokeWidth={2.2} />
                    </button>

                    {/* Vertical Connector Line down to Card */}
                    <div className={`iv-roadmap-vertical-line ${isActive ? 'active' : ''}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Five Stage Cards Row */}
          <div className="iv-roadmap-cards">
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              return (
                <div
                  key={step.num}
                  className={`iv-roadmap-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveStep(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveStep(i);
                    }
                  }}
                  aria-label={`View stage ${step.num}: ${step.title}`}
                >
                  {/* Upper Number Tab */}
                  <div className={`iv-roadmap-card__tab ${isActive ? 'active' : ''}`}>
                    {step.num}
                  </div>

                  {/* Card Content */}
                  <div className="iv-roadmap-card__content">
                    <h3 className="iv-roadmap-card__title">{step.title}</h3>
                    <div className={`iv-roadmap-card__indicator ${isActive ? 'active' : ''}`} />
                    <p className="iv-roadmap-card__desc">{step.desc}</p>
                  </div>

                  {/* Bottom Image Area */}
                  <div className="iv-roadmap-card__image-wrap">
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="iv-roadmap-card__image"
                      loading="lazy"
                    />
                    <div className="iv-roadmap-card__image-overlay" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Navigation & Insight Bar */}
          <div className="iv-roadmap-nav">
            {/* Left Star Icon & Message */}
            <div className="iv-roadmap-nav__left">
              <div className="iv-roadmap-nav__icon-wrap">
                <Star size={20} strokeWidth={2} />
              </div>
              <div className="iv-roadmap-nav__text">
                <div className="iv-roadmap-nav__line1">Follow the process. Reduce risk.</div>
                <div className="iv-roadmap-nav__line2 red">Build only what people actually need.</div>
              </div>
            </div>

            {/* Dotted Texture Background */}
            <div className="iv-roadmap-nav__dots-bg" aria-hidden="true" />

            {/* Right Controls: Counter + Previous/Next Buttons */}
            <div className="iv-roadmap-nav__right">
              <div className="iv-roadmap-nav__counter">
                STEP <span className="red">0{activeStep + 1}</span> OF 05
              </div>

              <div className="iv-roadmap-nav__btn-group">
                <button
                  type="button"
                  className={`iv-roadmap-nav__btn ${activeStep === 0 ? 'disabled' : ''}`}
                  onClick={handlePrev}
                  disabled={activeStep === 0}
                  aria-label="Previous Stage"
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </button>

                <button
                  type="button"
                  className={`iv-roadmap-nav__btn ${activeStep === steps.length - 1 ? 'disabled' : ''}`}
                  onClick={handleNext}
                  disabled={activeStep === steps.length - 1}
                  aria-label="Next Stage"
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════════════
   SECTION 05 — WHAT YOU GET OUT OF IT (IMAGE-BASED OUTCOMES)
   ══════════════════════════════════════════════════════════════ */
function OutcomesSection() {
  const outcomes = [
    {
      num: '01',
      title: 'Validated Problem',
      desc: "A clear understanding of the real problem you're solving.",
      icon: ClipboardCheck,
      image: '/assets/images/outcomes/validated-problem.jpg',
      alt: 'Founder reviewing customer problem research notes and checklist',
    },
    {
      num: '02',
      title: 'Customer Insights',
      desc: 'Real feedback from potential users and target segments.',
      icon: MessageSquare,
      image: '/assets/images/outcomes/customer-insights.jpg',
      alt: 'Founder speaking with potential customers in a user interview',
    },
    {
      num: '03',
      title: 'Market Signals',
      desc: 'Evidence showing whether there is genuine demand.',
      icon: TrendingUp,
      image: '/assets/images/outcomes/market-signals.jpg',
      alt: 'Founder analyzing market growth charts and data analytics on a laptop',
    },
    {
      num: '04',
      title: 'Refined Idea',
      desc: 'A stronger solution based on what you learned.',
      icon: Lightbulb,
      image: '/assets/images/outcomes/refined-idea.jpg',
      alt: 'Filament lightbulb glowing beside product wireframe sketches',
      isEmphasized: true,
    },
    {
      num: '05',
      title: 'Next-Step Roadmap',
      desc: 'A clear decision on what to build next and how.',
      icon: Map,
      image: '/assets/images/outcomes/next-step-roadmap.jpg',
      alt: 'Strategic roadmap map with red pin location markers',
      isFinal: true,
    },
  ];

  return (
    <section className="iv-outcomes iv-section" id="iv-outcomes">
      <div className="iv-container">
        {/* Header */}
        <motion.div
          className="iv-outcomes__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <div className="iv-outcomes__header-left">
            <div className="iv-outcomes__eyebrow">
              <span className="iv-outcomes__section-num">05</span>
              <span className="iv-outcomes__dash" />
              <span className="iv-outcomes__section-tag">THE OUTCOME</span>
            </div>
            <h2 className="iv-heading iv-outcomes__heading">
              What You Get<br />
              <span className="red">Out of It.</span>
            </h2>
            <div className="iv-outcomes__heading-indicator" />
          </div>

          <div className="iv-outcomes__header-divider">
            <span className="iv-outcomes__header-dot" />
          </div>

          <div className="iv-outcomes__header-right">
            <p className="iv-outcomes__description">
              Leave the program with clarity, confidence, and a clear direction for your next move.
            </p>
          </div>
        </motion.div>

        {/* Five Image Outcome Cards Grid */}
        <motion.div
          className="iv-outcomes__flow-wrapper"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          <div className="iv-outcomes__grid">
            {outcomes.map((outcome, i) => (
              <div key={outcome.num} className="iv-outcomes__stage-wrapper">
                <motion.div
                  className={`iv-outcome-card ${
                    outcome.isEmphasized ? 'iv-outcome-card--emphasized' : ''
                  } ${outcome.isFinal ? 'iv-outcome-card--final' : ''}`}
                  variants={fadeUp}
                >
                  {/* Top-Left Red Badge */}
                  <div className="iv-outcome-card__badge">{outcome.num}</div>

                  {/* 16:9 Image Placeholder Area */}
                  <div className="iv-outcome-card__image-wrapper">
                    <img
                      src={outcome.image}
                      alt={outcome.alt}
                      className="iv-outcome-card__image"
                      loading="lazy"
                    />
                    <div className="iv-outcome-card__image-overlay" />
                  </div>

                  {/* Icon Container */}
                  <div className="iv-outcome-card__icon-wrap">
                    <div className="iv-outcome-card__icon">
                      <outcome.icon size={26} strokeWidth={2.2} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="iv-outcome-card__title">{outcome.title}</h3>
                  <div className="iv-outcome-card__indicator" />

                  {/* Description */}
                  <p className="iv-outcome-card__desc">{outcome.desc}</p>
                </motion.div>

                {/* Connector Arrow (Desktop/Tablet) */}
                {i < outcomes.length - 1 && (
                  <div className="iv-outcome-connector" aria-hidden="true">
                    <div className="iv-outcome-connector__node">
                      <ChevronRight size={14} strokeWidth={3} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════════════
   SECTION 06 — THIS PROGRAM IS FOR YOU IF... (REDESIGNED PROGRAM FIT)
   ══════════════════════════════════════════════════════════════ */
function AudienceSection() {
  const cards = [
    {
      num: '01',
      title: 'Startup Idea, Not Sure Yet',
      desc: "You have a startup idea but aren't sure if it's worth pursuing.",
      icon: Lightbulb,
    },
    {
      num: '02',
      title: 'Problem Identified, Need Validation',
      desc: "You've identified a problem but haven't spoken to enough users.",
      icon: MessageSquare,
    },
    {
      num: '03',
      title: 'Building MVP, Need Clarity',
      desc: "You're building an MVP but want to test your assumptions first.",
      icon: Rocket,
    },
    {
      num: '04',
      title: 'Student Exploring Entrepreneurship',
      desc: "You're a student exploring entrepreneurship.",
      icon: GraduationCap,
    },
    {
      num: '05',
      title: 'Pivoting / Re-evaluating',
      desc: "You're thinking about pivoting your existing idea.",
      icon: RefreshCw,
      isFinal: true,
    },
  ];

  return (
    <section className="iv-audience iv-section" id="iv-audience">
      <div className="iv-container">
        <div className="iv-audience__layout">
          {/* LEFT COLUMN — Heading & Description */}
          <motion.div
            className="iv-audience__left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <div className="iv-audience__eyebrow">
              <span className="iv-audience__section-num">06</span>
              <span className="iv-audience__dash" />
            </div>

            <h2 className="iv-heading iv-audience__heading">
              This Program Is<br />
              <span className="red">For You If...</span>
            </h2>

            <div className="iv-audience__heading-indicator" />

            <p className="iv-audience__description">
              No matter where you are in your journey, this program meets you where you are.
            </p>
          </motion.div>

          {/* RIGHT COLUMN — 5 Cards & Bottom CTA Strip */}
          <div className="iv-audience__right">
            {/* Five Cards Row */}
            <motion.div
              className="iv-audience__flow-wrapper"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={staggerContainer}
            >
              <div className="iv-audience__grid">
                {cards.map((card, i) => (
                  <div key={card.num} className="iv-audience__stage-wrapper">
                    <motion.div
                      className={`iv-audience-card ${
                        card.isFinal ? 'iv-audience-card--final' : ''
                      }`}
                      variants={fadeUp}
                    >
                      {/* Top-Left Red Badge */}
                      <div className="iv-audience-card__badge">{card.num}</div>

                      {/* Icon */}
                      <div className="iv-audience-card__icon-wrap">
                        <div className="iv-audience-card__icon">
                          <card.icon size={26} strokeWidth={2.2} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="iv-audience-card__title">{card.title}</h3>

                      {/* Description */}
                      <p className="iv-audience-card__desc">{card.desc}</p>

                      {/* Bottom Red Accent Bar */}
                      <div className="iv-audience-card__accent" />
                    </motion.div>

                    {/* Horizontal Connector Line with Red Dot */}
                    {i < cards.length - 1 && (
                      <div className="iv-audience-connector" aria-hidden="true">
                        <span className="iv-audience-connector__line" />
                        <span className="iv-audience-connector__dot" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bottom CTA Strip */}
            <motion.div
              className="iv-audience-strip"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
            >
              <div className="iv-audience-strip__dots-left" aria-hidden="true" />

              <div className="iv-audience-strip__content">
                <div className="iv-audience-strip__icon">
                  <MessageSquare size={20} strokeWidth={2.2} />
                </div>
                <span className="iv-audience-strip__text">
                  Not sure if your idea is ready?
                </span>
                <span className="iv-audience-strip__divider" />
                <Link href="/about" className="iv-audience-strip__link">
                  <span>Talk to us</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="iv-audience-strip__dots-right" aria-hidden="true" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════════════
   SECTION 07 — FINAL CTA
   ══════════════════════════════════════════════════════════════ */
function FinalCTASection() {
  const flowSteps = ['Idea', 'Test', 'Learn', 'Validate', 'Confidence'];

  return (
    <section className="iv-final-cta iv-section" id="iv-final-cta">
      <div className="iv-container">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.h2 className="iv-heading" variants={fadeUp}>
            Your Idea Deserves<br />
            <span className="red">to Be Tested.</span>
          </motion.h2>

          <motion.p className="iv-description" variants={fadeUp} style={{ margin: '0 auto 32px' }}>
            Don&apos;t spend months building something nobody needs. Test your
            assumptions, learn from real users, and find your next step with
            confidence.
          </motion.p>

          <motion.div className="iv-benefits" variants={fadeUp}>
            {['Test Early', 'Build Smart', 'Grow Faster'].map((b) => (
              <span className="iv-benefit" key={b}>
                <span className="iv-benefit__dot" />
                {b}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link href="/signup" className="iv-cta">
              <span>Start Validating Your Idea</span>
              <ArrowRight />
            </Link>
          </motion.div>

          {/* Final flow visual */}
          <motion.div className="iv-final-flow" variants={fadeUp}>
            {flowSteps.map((step, i) => (
              <div key={step} style={{ display: 'contents' }}>
                <div
                  className={`iv-final-flow__step ${
                    i === flowSteps.length - 1 ? 'iv-final-flow__step--final' : ''
                  }`}
                >
                  {step}
                </div>
                {i < flowSteps.length - 1 && <div className="iv-final-flow__arrow" />}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════════════
   PAGE ROOT
   ══════════════════════════════════════════════════════════════ */
export default function IdeaValidationClient() {
  return (
    <div className="idea-validation-page">
      <HeroSection />
      <div className="iv-divider" />
      <CompareSection />
      <div className="iv-divider" />
      <ValidationDiagramSection />
      <div className="iv-divider" />
      <TimelineSection />
      <div className="iv-divider" />
      <OutcomesSection />
      <div className="iv-divider" />
      <AudienceSection />
      <div className="iv-divider" />
      <FinalCTASection />
    </div>
  );
}
