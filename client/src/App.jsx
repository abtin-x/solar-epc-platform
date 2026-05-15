import { BrowserRouter, HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import IntlTelInput from "intl-tel-input/reactWithUtils";
import "intl-tel-input/styles";
import spaceVideo from "./assets/sun.mp4";
import AdminLoginPage from "./pages/AdminLogin";
import AdminDashboardPage from "./pages/AdminDashboard";

const SECTION_IDS = {
  home: "home",
  services: "services",
  projects: "projects",
  partnerships: "partnerships",
  contact: "contact",
  inquiry: "inquiry",
};

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return false;
  section.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

function useSectionNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (sectionId) => {
    if (location.pathname === "/") {
      scrollToSection(sectionId);
      return;
    }

    navigate("/", { state: { scrollTo: sectionId } });
  };
}

function SectionNavButton({ sectionId, className, onClick, children }) {
  const goToSection = useSectionNavigation();

  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        goToSection(sectionId);
      }}
      className={className}
    >
      {children}
    </button>
  );
}

function LanguageSwitcher({ language, setLanguage }) {
  const buttonClass = (code) =>
    `lang-switch-btn ${language === code ? "lang-switch-btn-active" : ""}`;

  return (
    <div className="lang-switch-shell">
      <button type="button" onClick={() => setLanguage("en")} className={buttonClass("en")}>
        EN
      </button>
      <button type="button" onClick={() => setLanguage("fa")} className={buttonClass("fa")}>
        فارسی
      </button>
    </div>
  );
}

function AdminLanguageSwitcher({ language, setLanguage }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[#e7dcc7] bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`min-w-[64px] rounded-full px-4 py-2 text-sm font-semibold transition ${
          language === "en"
            ? "bg-slate-950 text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)]"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage("fa")}
        className={`min-w-[64px] rounded-full px-4 py-2 text-sm font-semibold transition ${
          language === "fa"
            ? "bg-slate-950 text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)]"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        FA
      </button>
    </div>
  );
}

function NanoVisionLogo() {
  return (
    <span className="nanovision-logo text-[1.78rem] md:text-[2.02rem]" dir="ltr" lang="en">
      <span className="nv-word" dir="ltr">
        <span className="nv-main">NANO</span>
        <span className="nv-vision">
          VISI
          <span className="nv-orbital-o" aria-hidden="true">
            <span className="nv-orb-core" />
            <span className="nv-orb-ring nv-orb-ring-1" />
            <span className="nv-orb-ring nv-orb-ring-2" />
            <span className="nv-orb-spark nv-orb-spark-1" />
            <span className="nv-orb-spark nv-orb-spark-2" />
          </span>
          N
        </span>
      </span>
      <span className="nv-glow" />
      <span className="nv-strike nv-strike-1" />
      <span className="nv-strike nv-strike-2" />
    </span>
  );
}

function CinematicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        src={spaceVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,6,10,0.95)_0%,rgba(6,8,12,0.72)_42%,rgba(4,6,10,0.93)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.1)_40%,rgba(0,0,0,0.72)_100%)]" />
      <div className="absolute left-[7%] top-[16%] h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />
      <div className="absolute left-[32%] top-[18%] h-96 w-96 rounded-full bg-amber-500/8 blur-3xl" />
      <div className="absolute right-[12%] bottom-[14%] h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(2,4,8,0.78)_0%,rgba(2,4,8,0)_100%)]" />
    </div>
  );
}

function Navbar({ language, setLanguage }) {
  const { t } = useTranslation();
  const isFa = language === "fa";
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { sectionId: SECTION_IDS.home, label: t("navHome") },
    { sectionId: SECTION_IDS.services, label: t("navServices") },
    { sectionId: SECTION_IDS.projects, label: t("navProjects") },
    { sectionId: SECTION_IDS.partnerships, label: t("navPartnerships") },
    { sectionId: SECTION_IDS.contact, label: t("navContact") },
  ];

  return (
    <header className="site-header">
      <div className={`site-header-inner ${isFa ? "rtl-shell" : ""}`}>
        <SectionNavButton
          sectionId={SECTION_IDS.home}
          className={`site-logo-link group ${isFa ? "lg:order-3" : "lg:order-1"}`}
          onClick={() => setMobileOpen(false)}
        >
          <NanoVisionLogo />
        </SectionNavButton>

        <nav
          className={`site-nav hidden lg:flex ${
            isFa ? "lg:order-2 flex-row-reverse" : "lg:order-2"
          }`}
        >
          {navItems.map((item) => (
            <SectionNavButton key={item.sectionId} sectionId={item.sectionId} className="site-nav-link">
              {item.label}
            </SectionNavButton>
          ))}
        </nav>

        <div
          className={`hidden items-center gap-3 lg:flex ${
            isFa ? "lg:order-1 flex-row-reverse" : "lg:order-3"
          }`}
        >
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <SectionNavButton sectionId={SECTION_IDS.inquiry} className="site-cta-btn">
            {t("navConsultation")}
          </SectionNavButton>
        </div>

        <button
          type="button"
          className="mobile-menu-btn lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className={`mobile-menu-line ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`mobile-menu-line ${mobileOpen ? "opacity-0" : ""}`} />
          <span
            className={`mobile-menu-line ${
              mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {mobileOpen && (
        <div className={`mobile-nav-panel lg:hidden ${isFa ? "text-right" : ""}`}>
          <div className="mobile-nav-links">
            {navItems.map((item) => (
              <SectionNavButton
                key={item.sectionId}
                sectionId={item.sectionId}
                className="mobile-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </SectionNavButton>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
            <SectionNavButton
              sectionId={SECTION_IDS.inquiry}
              className="site-cta-btn text-center"
              onClick={() => setMobileOpen(false)}
            >
              {t("navConsultation")}
            </SectionNavButton>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  return (
    <section
      id="home"
      className="relative z-10 mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col items-center justify-center px-6 pb-14 pt-16 text-center md:min-h-[84vh] md:pb-16 md:pt-22"
    >
      <div className="max-w-5xl">
        <p className="hero-eyebrow">Solar EPC • Project Development • Strategic Partnerships</p>

        <h1
          className={`text-white drop-shadow-[0_10px_45px_rgba(0,0,0,0.48)] ${
            isFa
              ? "font-fa-tech text-[2.55rem] font-black leading-[1.36] tracking-[-0.04em] md:text-[3.85rem] xl:text-[4.55rem]"
              : "font-heading text-[2.5rem] font-black leading-[1.08] tracking-[-0.05em] md:text-[4.1rem] xl:text-[4.95rem]"
          }`}
        >
          <span className="block text-white/95">{t("heroTitle1")}</span>
          <span className="mt-3 block hero-gold-text">{t("heroTitle2")}</span>
        </h1>

        <p className="mx-auto mt-7 max-w-3xl text-[1rem] leading-8 text-slate-300/95 md:mt-8 md:text-[1.16rem] md:leading-9">
          {t("heroSubtitle")}
        </p>

        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <SectionNavButton
            sectionId={SECTION_IDS.inquiry}
            className="btn-gold min-w-[190px] rounded-2xl px-8 py-4 text-center text-[0.98rem] font-semibold"
          >
            {t("heroPrimary")}
          </SectionNavButton>

          <SectionNavButton
            sectionId={SECTION_IDS.projects}
            className="hero-secondary-btn min-w-[190px] rounded-2xl px-8 py-4 text-center text-[0.98rem] font-semibold text-white"
          >
            {t("heroSecondary")}
          </SectionNavButton>
        </div>
      </div>
    </section>
  );
}

function ProjectTypeCards({ setSelectedInquiryType }) {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  const cards = [
    {
      key: "residential",
      title: t("cardResidential"),
      text: isFa
        ? "سولارهای خورشیدی برای خانه‌ها، ویلاها و پروژه‌های کوچک خصوصی."
        : "Solar solutions for homes, villas, and smaller private properties.",
    },
    {
      key: "commercial",
      title: t("cardCommercial"),
      text: isFa
        ? "سولارهای خورشیدی برای کارخانه‌ها، انبارها، مجتمع‌ها و کسب‌وکارها."
        : "Solar systems for factories, warehouses, business sites, and industrial assets.",
    },
    {
      key: "land",
      title: t("cardLand"),
      text: isFa
        ? "توسعه پروژه‌های خورشیدی روی زمین‌های خصوصی و فرصت‌های زمین‌محور."
        : "Development opportunities for solar-ready land and land-based projects.",
    },
    {
      key: "utility",
      title: t("cardUtility"),
      text: isFa
        ? "پروژه‌های مقیاس بزرگ، نهادی، عمومی و دولتی."
        : "Large-scale, institutional, public-sector, and government-oriented projects.",
    },
  ];

  const handleSelect = (type) => {
    setSelectedInquiryType(type);
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-6 md:pt-10">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => handleSelect(card.key)}
            className={`group rounded-[28px] border border-white/10 bg-white/6 p-7 text-white shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-yellow-300/20 hover:bg-white/10 ${
              isFa ? "text-right" : "text-left"
            }`}
          >
            <div className="mb-5 h-12 w-12 rounded-2xl bg-yellow-300/12 transition group-hover:bg-yellow-300/20" />
            <h3 className="text-xl font-semibold tracking-tight text-white">{card.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{card.text}</p>
            <div className="mt-5 text-sm font-medium text-yellow-300 transition group-hover:text-white">
              {isFa ? "انتخاب این مسیر ←" : "Choose this path →"}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, subtitle }) {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  return (
    <div className={`max-w-3xl ${isFa ? "text-right" : ""}`}>
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-600">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">{title}</h2>
      <p className="mt-4 text-lg leading-8 text-slate-600">{subtitle}</p>
    </div>
  );
}

function ServicesSection() {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  const services = isFa
    ? [
        {
          title: "طراحی و مهندسی",
          text: "طراحی فنی، ارزیابی سایت، تحلیل امکان‌سنجی و برنامه‌ریزی دقیق پروژه‌های خورشیدی.",
        },
        {
          title: "EPC و اجرا",
          text: "مدیریت کامل پروژه، تأمین تجهیزات، نصب، راه‌اندازی و تحویل پروژه با استاندارد حرفه‌ای.",
        },
        {
          title: "توسعه پروژه",
          text: "توسعه پروژه‌های خورشیدی برای زمین‌های خصوصی، تجاری و پروژه‌های مقیاس بزرگ.",
        },
        {
          title: "مشارکت راهبردی",
          text: "همکاری با مالکان زمین، شرکت‌ها و نهادهای بزرگ برای توسعه و اجرای پروژه‌های انرژی خورشیدی.",
        },
      ]
    : [
        {
          title: "Engineering & Design",
          text: "Technical design, site assessment, feasibility analysis, and detailed solar project planning.",
        },
        {
          title: "EPC & Installation",
          text: "Full project execution including procurement, installation, commissioning, and delivery.",
        },
        {
          title: "Project Development",
          text: "Development of solar opportunities for private land, commercial assets, and utility-scale projects.",
        },
        {
          title: "Strategic Partnerships",
          text: "Collaboration with land owners, businesses, and institutions to structure and deliver solar projects.",
        },
      ];

  return (
    <section id="services" className="section-light px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={isFa ? "توانمندی‌ها" : "Capabilities"}
          title={isFa ? "خدمات اصلی" : "Core Services"}
          subtitle={
            isFa
              ? "از طراحی و توسعه تا اجرا و مشارکت‌های راهبردی"
              : "From engineering and development to execution and strategic collaboration"
          }
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className={`card-opensolar rounded-3xl p-8 transition hover:-translate-y-1 hover:border-amber-300/40 ${
                isFa ? "text-right" : ""
              }`}
            >
              <div className="mb-5 h-12 w-12 rounded-2xl bg-amber-400/12" />
              <h3 className="text-2xl font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{service.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioPreviewSection() {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  const projects = isFa
    ? [
        {
          title: "پروژه‌های مسکونی",
          text: "سولارهای خورشیدی برای خانه‌ها، ویلاها و ساختمان‌های کوچک.",
        },
        {
          title: "پروژه‌های تجاری",
          text: "سیستم‌های خورشیدی برای کارخانه‌ها، مجتمع‌ها، انبارها و کسب‌وکارها.",
        },
        {
          title: "پروژه‌های زمین‌محور",
          text: "توسعه فرصت‌های خورشیدی روی زمین‌های خصوصی و سرمایه‌پذیر.",
        },
        {
          title: "پروژه‌های دولتی و نیروگاهی",
          text: "اجرای پروژه‌های بزرگ با استاندارد مناسب برای همکاری‌های نهادی و عمومی.",
        },
      ]
    : [
        {
          title: "Residential Projects",
          text: "Solar solutions for homes, villas, and small-scale private properties.",
        },
        {
          title: "Commercial Projects",
          text: "Solar systems for factories, warehouses, industrial sites, and business facilities.",
        },
        {
          title: "Land-Based Projects",
          text: "Development opportunities for solar-ready land and larger private sites.",
        },
        {
          title: "Government & Utility-Scale",
          text: "Large-scale execution readiness for institutional and public-sector collaborations.",
        },
      ];

  return (
    <section id="projects" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={isFa ? "پروژه‌ها" : "Portfolio"}
          title={isFa ? "نمونه پروژه‌ها" : "Selected Project Categories"}
          subtitle={
            isFa
              ? "تجربه در پروژه‌های متنوع از بخش خانگی تا مقیاس‌های بزرگ"
              : "Experience across multiple project types, from residential systems to large-scale developments"
          }
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.title}
              className={`card-opensolar-soft rounded-3xl p-8 transition hover:-translate-y-1 hover:border-amber-300/40 ${
                isFa ? "text-right" : ""
              }`}
            >
              <div className="mb-6 h-44 rounded-3xl bg-[linear-gradient(135deg,#fff8e5_0%,#f8f1df_50%,#efe4c7_100%)]" />
              <h3 className="text-2xl font-semibold text-slate-900">{project.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{project.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CredibilitySection() {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  const stats = isFa
    ? [
        { label: "بخش‌های تحت پوشش", value: "مسکونی، تجاری، دولتی" },
        { label: "نوع پروژه‌ها", value: "از خانه تا نیروگاه" },
        { label: "مدل همکاری", value: "اجرا، توسعه، مشارکت" },
      ]
    : [
        { label: "Sectors Served", value: "Residential, Commercial, Government" },
        { label: "Project Range", value: "From homes to power plants" },
        { label: "Delivery Model", value: "EPC, Development, Partnerships" },
      ];

  return (
    <section id="partnerships" className="bg-[#f8f4ea] px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeader
            eyebrow={isFa ? "اعتبار و تجربه" : "Credibility"}
            title={isFa ? "چرا ما" : "Why Choose Us"}
            subtitle={
              isFa
                ? "تجربه در پروژه‌های خصوصی و دولتی، از مقیاس خانگی تا نیروگاه‌های بزرگ"
                : "Experience across private and government projects, from residential systems to utility-scale developments"
            }
          />

          <div className={`${isFa ? "text-right" : ""} mt-8`}>
            <SectionNavButton sectionId={SECTION_IDS.projects} className="btn-gold rounded-2xl px-6 py-4 font-semibold">
              {isFa ? "مشاهده پروژه‌ها" : "Explore Our Projects"}
            </SectionNavButton>
          </div>
        </div>

        <div className="grid gap-6">
          {stats.map((item) => (
            <div
              key={item.label}
              className={`card-opensolar-soft rounded-3xl p-8 ${isFa ? "text-right" : ""}`}
            >
              <p className="text-sm uppercase tracking-[0.2em] text-amber-600">{item.label}</p>
              <p className="mt-4 text-2xl font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InquirySelector({ selectedInquiryType, setSelectedInquiryType }) {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  const options = isFa
    ? [
        { key: "residential", label: "خورشیدی مسکونی" },
        { key: "commercial", label: "تجاری و صنعتی" },
        { key: "land", label: "پروژه‌های زمین‌محور" },
        { key: "utility", label: "نیروگاهی و دولتی" },
      ]
    : [
        { key: "residential", label: "Residential Solar" },
        { key: "commercial", label: "Commercial & Industrial" },
        { key: "land", label: "Land-Based Projects" },
        { key: "utility", label: "Utility-Scale & Government" },
      ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {options.map((option) => {
        const active = selectedInquiryType === option.key;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => setSelectedInquiryType(option.key)}
            className={`relative overflow-hidden rounded-2xl border px-5 py-4 font-medium transition-all duration-300 ${
              active
                ? "border-amber-300/55 bg-[linear-gradient(135deg,#fff7dd_0%,#f9e6a1_100%)] text-slate-950 shadow-[0_14px_34px_rgba(214,162,32,0.16)] -translate-y-1"
                : "border-[#e5dac4] bg-white text-slate-700 hover:border-amber-300/35 hover:bg-[#fffaf0]"
            } ${isFa ? "text-right" : "text-left"}`}
          >
            <div className="relative flex items-center justify-between gap-3">
              <span>{option.label}</span>
              <span
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  active
                    ? "bg-amber-500 shadow-[0_0_10px_rgba(214,162,32,0.8)]"
                    : "bg-slate-300"
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function InquiryForm({ selectedInquiryType }) {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const navigate = useNavigate();
  const phoneWrapRef = useRef(null);
  const phoneInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [consentError, setConsentError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    inquiryType: selectedInquiryType,
    fullName: "",
    phone: "",
    email: "",
    preferredContactMethod: "phone",
    country: "",
    cityAddress: "",
    propertyType: "",
    ownershipStatus: "",
    roofType: "",
    roofShading: "",
    roofAge: "",
    monthlyBill: "",
    electricityProvider: "",
    companyName: "",
    facilityType: "",
    availableArea: "",
    energyUsage: "",
    landLocation: "",
    landSize: "",
    gridAccess: "",
    intendedUse: "",
    organizationName: "",
    projectLocation: "",
    capacityTarget: "",
    tenderStage: "",
    interestReasons: [],
    timeline: "",
    message: "",
    consent: false,
    attachments: [],
  });

  const activeTheme = useMemo(() => {
    const map = {
      residential: {
        icon: "⌂",
        badge: isFa ? "پروژه مسکونی" : "Residential",
        title: isFa ? "فرم مشاوره مسکونی" : "Residential Consultation Form",
        subtitle: isFa
          ? "اطلاعات ملک و مصرف برق را وارد کنید تا برآورد اولیه دقیق‌تری ارائه شود."
          : "Share your property and electricity details for a more tailored first estimate.",
        accent: "from-[#fff7db] via-[#f7d86d] to-[#d6a220]",
        glow: "shadow-[0_0_50px_rgba(214,162,32,0.10)]",
      },
      commercial: {
        icon: "▣",
        badge: isFa ? "تجاری و صنعتی" : "Commercial",
        title: isFa ? "فرم مشاوره تجاری و صنعتی" : "Commercial & Industrial Form",
        subtitle: isFa
          ? "اطلاعات مجموعه، فضا و مصرف انرژی را وارد کنید تا مسیر مناسب پیشنهاد شود."
          : "Add facility, space, and energy usage details so the right commercial path can be scoped.",
        accent: "from-[#fff3c2] via-[#f4c542] to-[#b98510]",
        glow: "shadow-[0_0_50px_rgba(214,162,32,0.12)]",
      },
      land: {
        icon: "◫",
        badge: isFa ? "زمین‌محور" : "Land-Based",
        title: isFa ? "فرم بررسی زمین خورشیدی" : "Land-Based Project Form",
        subtitle: isFa
          ? "موقعیت، متراژ و دسترسی به شبکه را وارد کنید تا پتانسیل زمین بررسی شود."
          : "Add land location, size, and grid access to assess solar development potential.",
        accent: "from-[#fff6d6] via-[#f0cb58] to-[#ca9b22]",
        glow: "shadow-[0_0_50px_rgba(214,162,32,0.10)]",
      },
      utility: {
        icon: "⚡",
        badge: isFa ? "نیروگاهی و دولتی" : "Utility-Scale",
        title: isFa ? "فرم پروژه نیروگاهی و دولتی" : "Utility-Scale & Government Form",
        subtitle: isFa
          ? "ظرفیت، موقعیت و مرحله پروژه را وارد کنید تا بررسی تخصصی انجام شود."
          : "Share capacity, location, and project stage for a strategic project review.",
        accent: "from-[#fff7db] via-[#f4c542] to-[#d19b10]",
        glow: "shadow-[0_0_56px_rgba(214,162,32,0.14)]",
      },
    };
    return map[selectedInquiryType] || map.residential;
  }, [selectedInquiryType, isFa]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      inquiryType: selectedInquiryType,
      attachments: [],
    }));
    setStep(1);
    setShowPopup(false);
    setPopupTitle("");
    setPopupMessage("");
    setConsentError(false);
    setIsSubmitting(false);
  }, [selectedInquiryType]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => {
      const existing = prev.attachments || [];
      const merged = [...existing];

      files.forEach((newFile) => {
        const alreadyExists = merged.some(
          (file) =>
            file.name === newFile.name &&
            file.size === newFile.size &&
            file.lastModified === newFile.lastModified
        );
        if (!alreadyExists) merged.push(newFile);
      });

      return {
        ...prev,
        attachments: merged,
      };
    });

    e.target.value = "";
  };

  const removeAttachment = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, index) => index !== indexToRemove),
    }));
  };

  const toggleReason = (reason) => {
    setFormData((prev) => {
      const exists = prev.interestReasons.includes(reason);
      return {
        ...prev,
        interestReasons: exists
          ? prev.interestReasons.filter((r) => r !== reason)
          : [...prev.interestReasons, reason],
      };
    });
  };

  const openPopup = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setShowPopup(true);
  };

  const toEnglishDigits = (value) =>
    (value || "").replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776));

  const toFarsiDigits = (value) =>
    (value || "").replace(/\d/g, (digit) => String.fromCharCode(1776 + Number(digit)));

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const normalizePhoneValue = (phone) => toEnglishDigits((phone || "").replace(/[\s\-().]/g, ""));
  const isValidPhone = (phone) => /^\+?[1-9]\d{7,14}$/.test(normalizePhoneValue(phone));
  const getSelectedDialCode = () => phoneInputRef.current?.getInstance()?.getSelectedCountryData?.()?.dialCode;
  const getLockedPrefix = () => {
    const dialCode = getSelectedDialCode();
    if (!dialCode) return "";
    return isFa ? toFarsiDigits(`+${dialCode}`) : `+${dialCode}`;
  };

  const syncVisiblePhoneInput = (nextPhoneValue) => {
    const input = phoneInputRef.current?.getInput();
    const instance = phoneInputRef.current?.getInstance();

    if (instance) {
      instance.setNumber(nextPhoneValue);
    } else if (input) {
      input.value = nextPhoneValue;
    }

    requestAnimationFrame(() => {
      const liveInput = phoneInputRef.current?.getInput();
      if (!liveInput) return;

      if (liveInput.value !== nextPhoneValue) {
        liveInput.value = nextPhoneValue;
      }

      liveInput.setSelectionRange(nextPhoneValue.length, nextPhoneValue.length);
    });
  };

  const keepCaretAfterPrefix = () => {
    requestAnimationFrame(() => {
      const input = phoneInputRef.current?.getInput();
      if (!input) return;

      const prefix = getLockedPrefix();
      if (!prefix || !input.value.startsWith(prefix)) return;

      const nextCaret = Math.max(input.selectionStart ?? prefix.length, prefix.length);
      input.setSelectionRange(nextCaret, nextCaret);
    });
  };

  const handlePhoneCountryChange = () => {
    const input = phoneInputRef.current?.getInput();
    const currentValue = input?.value ?? formData.phone;

    if (normalizePhoneValue(currentValue)) return;

    const instance = phoneInputRef.current?.getInstance();
    const dialCode = instance?.getSelectedCountryData?.()?.dialCode;

    if (!dialCode) return;

    const nextPhoneValue = isFa ? toFarsiDigits(`+${dialCode}`) : `+${dialCode}`;
    setFormData((prev) => ({
      ...prev,
      phone: nextPhoneValue,
    }));
    syncVisiblePhoneInput(nextPhoneValue);
  };

  const handlePhoneNumberChange = (value) => {
    const nextValue = isFa ? toFarsiDigits(value) : toEnglishDigits(value);
    handleChange("phone", nextValue);
  };

  const handlePhoneKeyDown = (event) => {
    const prefix = getLockedPrefix();
    if (!prefix) return;

    const input = event.currentTarget;
    const selectionStart = input.selectionStart ?? 0;
    const selectionEnd = input.selectionEnd ?? 0;
    const selectionTouchesPrefix = selectionStart < prefix.length || selectionEnd < prefix.length;

    if ((event.key === "Backspace" || event.key === "Delete") && selectionTouchesPrefix) {
      event.preventDefault();
      input.setSelectionRange(prefix.length, prefix.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      input.setSelectionRange(prefix.length, prefix.length);
      return;
    }

    if (event.key === "ArrowLeft" && selectionStart <= prefix.length && selectionEnd <= prefix.length) {
      event.preventDefault();
      input.setSelectionRange(prefix.length, prefix.length);
    }
  };

  useEffect(() => {
    if (!formData.phone) return;

    const localizedValue = isFa ? toFarsiDigits(formData.phone) : toEnglishDigits(formData.phone);
    if (localizedValue === formData.phone) return;

    setFormData((prev) => ({
      ...prev,
      phone: localizedValue,
    }));
  }, [isFa, formData.phone]);

  const validateStep1 = () =>
    formData.fullName.trim() &&
    formData.phone.trim() &&
    isValidPhone(formData.phone) &&
    isValidEmail(formData.email) &&
    formData.country.trim() &&
    formData.cityAddress.trim();

  const validateStep2 = () => {
    if (selectedInquiryType === "residential") {
      return formData.propertyType && formData.ownershipStatus;
    }
    if (selectedInquiryType === "commercial") {
      return formData.companyName.trim() && formData.facilityType;
    }
    if (selectedInquiryType === "land") {
      return formData.landLocation.trim() && formData.landSize.trim();
    }
    if (selectedInquiryType === "utility") {
      return formData.organizationName.trim() && formData.projectLocation.trim();
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) {
      openPopup(
        isFa ? "اطلاع" : "Notice",
        isFa
          ? "لطفاً نام، شماره تماس معتبر، ایمیل معتبر، کشور و آدرس را کامل کنید."
          : "Please complete your name, valid phone number, valid email, country, and address."
      );
      return;
    }

    if (step === 2 && !validateStep2()) {
      openPopup(
        isFa ? "اطلاع" : "Notice",
        isFa
          ? "لطفاً اطلاعات ضروری پروژه را کامل کنید."
          : "Please complete the required project details."
      );
      return;
    }

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consent) {
      setConsentError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "attachments") return;
        if (Array.isArray(value)) payload.append(key, JSON.stringify(value));
        else if (key === "phone") payload.append(key, toEnglishDigits(value ?? ""));
        else payload.append(key, value ?? "");
      });

      formData.attachments.forEach((file) => {
        payload.append("attachments", file);
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/leads`,
        {
          method: "POST",
          body: payload,
        }
      );

      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        const fieldMessages = Array.isArray(result?.errors)
          ? result.errors
              .map((item) => item?.message)
              .filter(Boolean)
              .join("\n")
          : "";

        throw new Error(fieldMessages || result?.message || "Failed to submit form");
      }

      navigate("/thank-you");
    } catch (error) {
      console.error("Submission error:", error);
      openPopup(
        isFa ? "خطا" : "Error",
        isFa
          ? "ارسال فرم با مشکل مواجه شد. لطفاً دوباره تلاش کنید."
          : "There was a problem submitting your form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "input-premium";
  const selectClass = "input-premium";

  const reasonOptions = isFa
    ? ["کاهش هزینه انرژی", "نگرانی‌های زیست‌محیطی", "استقلال انرژی", "افزایش ارزش ملک", "سایر"]
    : [
        "Reduce energy costs",
        "Environmental concerns",
        "Energy independence",
        "Increase property value",
        "Other",
      ];

  const timelineOptions = isFa
    ? ["فوری", "۱ تا ۳ ماه", "۳ تا ۶ ماه", "بیش از ۶ ماه", "نامشخص"]
    : ["Immediately", "1 to 3 months", "3 to 6 months", "More than 6 months", "Not sure"];

  const renderStep2 = () => {
    if (selectedInquiryType === "residential") {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-700">
              {isFa ? "نوع ملک *" : "Property type *"}
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) => handleChange("propertyType", e.target.value)}
              className={selectClass}
            >
              <option value="">{isFa ? "انتخاب کنید" : "Select"}</option>
              <option value="single">{isFa ? "خانه" : "House"}</option>
              <option value="multi">{isFa ? "آپارتمان" : "Apartment"}</option>
              <option value="commercial">
                {isFa ? "ساختمان تجاری" : "Commercial building"}
              </option>
              <option value="other">{isFa ? "سایر" : "Other"}</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-700">
              {isFa ? "وضعیت مالکیت *" : "Ownership status *"}
            </label>
            <select
              value={formData.ownershipStatus}
              onChange={(e) => handleChange("ownershipStatus", e.target.value)}
              className={selectClass}
            >
              <option value="">{isFa ? "انتخاب کنید" : "Select"}</option>
              <option value="own">{isFa ? "مالک" : "Own"}</option>
              <option value="rent">{isFa ? "اجاره" : "Rent"}</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-700">
              {isFa ? "نوع سقف" : "Roof type"}
            </label>
            <select
              value={formData.roofType}
              onChange={(e) => handleChange("roofType", e.target.value)}
              className={selectClass}
            >
              <option value="">{isFa ? "انتخاب کنید" : "Select"}</option>
              <option value="asphalt">{isFa ? "آسفالت" : "Asphalt"}</option>
              <option value="metal">{isFa ? "فلزی" : "Metal"}</option>
              <option value="tile">{isFa ? "سفال" : "Tile"}</option>
              <option value="flat">{isFa ? "مسطح" : "Flat"}</option>
              <option value="other">{isFa ? "سایر" : "Other"}</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-700">
              {isFa ? "میزان سایه روی سقف" : "Shading on roof"}
            </label>
            <select
              value={formData.roofShading}
              onChange={(e) => handleChange("roofShading", e.target.value)}
              className={selectClass}
            >
              <option value="">{isFa ? "انتخاب کنید" : "Select"}</option>
              <option value="none">{isFa ? "بدون سایه" : "No shade"}</option>
              <option value="partial">{isFa ? "سایه جزئی" : "Partial shade"}</option>
              <option value="heavy">{isFa ? "سایه زیاد" : "Heavy shade"}</option>
            </select>
          </div>

          <input
            value={formData.roofAge}
            onChange={(e) => handleChange("roofAge", e.target.value)}
            placeholder={isFa ? "سن تقریبی سقف" : "Approximate roof age"}
            className={inputClass}
          />
          <input
            value={formData.monthlyBill}
            onChange={(e) => handleChange("monthlyBill", e.target.value)}
            placeholder={isFa ? "میانگین قبض ماهانه برق" : "Average monthly electricity bill"}
            className={inputClass}
          />
          <input
            value={formData.electricityProvider}
            onChange={(e) => handleChange("electricityProvider", e.target.value)}
            placeholder={isFa ? "شرکت برق فعلی" : "Current electricity provider"}
            className={`${inputClass} md:col-span-2`}
          />
        </div>
      );
    }

    if (selectedInquiryType === "commercial") {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <input
            value={formData.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder={isFa ? "نام شرکت *" : "Company name *"}
            className={inputClass}
          />
          <select
            value={formData.facilityType}
            onChange={(e) => handleChange("facilityType", e.target.value)}
            className={selectClass}
          >
            <option value="">{isFa ? "نوع مجموعه *" : "Facility type *"}</option>
            <option value="factory">{isFa ? "کارخانه" : "Factory"}</option>
            <option value="warehouse">{isFa ? "انبار" : "Warehouse"}</option>
            <option value="office">{isFa ? "اداری" : "Office"}</option>
            <option value="farm">{isFa ? "مزرعه" : "Farm"}</option>
            <option value="other">{isFa ? "سایر" : "Other"}</option>
          </select>
          <input
            value={formData.projectLocation}
            onChange={(e) => handleChange("projectLocation", e.target.value)}
            placeholder={isFa ? "موقعیت پروژه" : "Project location"}
            className={inputClass}
          />
          <input
            value={formData.availableArea}
            onChange={(e) => handleChange("availableArea", e.target.value)}
            placeholder={isFa ? "مساحت قابل استفاده" : "Available roof / land area"}
            className={inputClass}
          />
          <input
            value={formData.energyUsage}
            onChange={(e) => handleChange("energyUsage", e.target.value)}
            placeholder={isFa ? "مصرف یا قبض ماهانه" : "Monthly usage / bill"}
            className={`${inputClass} md:col-span-2`}
          />
        </div>
      );
    }

    if (selectedInquiryType === "land") {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <input
            value={formData.landLocation}
            onChange={(e) => handleChange("landLocation", e.target.value)}
            placeholder={isFa ? "موقعیت زمین *" : "Land location *"}
            className={inputClass}
          />
          <input
            value={formData.landSize}
            onChange={(e) => handleChange("landSize", e.target.value)}
            placeholder={isFa ? "متراژ زمین *" : "Land size *"}
            className={inputClass}
          />
          <input
            value={formData.gridAccess}
            onChange={(e) => handleChange("gridAccess", e.target.value)}
            placeholder={isFa ? "دسترسی به شبکه برق" : "Grid access / proximity"}
            className={inputClass}
          />
          <select
            value={formData.intendedUse}
            onChange={(e) => handleChange("intendedUse", e.target.value)}
            className={selectClass}
          >
            <option value="">{isFa ? "کاربری مورد نظر" : "Intended project use"}</option>
            <option value="self-use">{isFa ? "مصرف شخصی" : "Self-use"}</option>
            <option value="development">{isFa ? "توسعه پروژه" : "Project development"}</option>
            <option value="sale">{isFa ? "فروش انرژی" : "Energy sale"}</option>
          </select>
        </div>
      );
    }

    return (
      <div className="grid gap-5 md:grid-cols-2">
        <input
          value={formData.organizationName}
          onChange={(e) => handleChange("organizationName", e.target.value)}
          placeholder={isFa ? "نام سازمان *" : "Organization name *"}
          className={inputClass}
        />
        <input
          value={formData.projectLocation}
          onChange={(e) => handleChange("projectLocation", e.target.value)}
          placeholder={isFa ? "موقعیت پروژه *" : "Project location *"}
          className={inputClass}
        />
        <input
          value={formData.capacityTarget}
          onChange={(e) => handleChange("capacityTarget", e.target.value)}
          placeholder={isFa ? "ظرفیت هدف (kW / MW)" : "Capacity target (kW / MW)"}
          className={inputClass}
        />
        <input
          value={formData.landSize}
          onChange={(e) => handleChange("landSize", e.target.value)}
          placeholder={isFa ? "متراژ زمین" : "Land size"}
          className={inputClass}
        />
        <input
          value={formData.tenderStage}
          onChange={(e) => handleChange("tenderStage", e.target.value)}
          placeholder={isFa ? "مرحله مناقصه / خرید" : "Tender / procurement stage"}
          className={`${inputClass} md:col-span-2`}
        />
      </div>
    );
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`form-premium form-switch-enter mt-8 mx-auto max-w-4xl rounded-[34px] p-8 md:p-10 ${activeTheme.glow} ${
          isFa ? "text-right" : ""
        }`}
      >
        <div className="mb-6 flex flex-col gap-5 border-b border-[#eee3cc] pb-6 md:flex-row md:items-center md:justify-between">
          <div className={`flex items-start gap-4 ${isFa ? "md:flex-row-reverse" : ""}`}>
            <div className={`premium-icon-wrap bg-gradient-to-br ${activeTheme.accent}`}>
              <span className="text-xl font-bold text-slate-900">{activeTheme.icon}</span>
            </div>

            <div>
              <div className="inline-flex rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                {activeTheme.badge}
              </div>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">{activeTheme.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                {activeTheme.subtitle}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#eadfca] bg-[#fffaf1] px-4 py-3 text-sm text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <span className="font-semibold text-slate-800">{step}</span>/3
          </div>
        </div>

        <div className="mb-8 flex items-center gap-3 text-sm text-slate-500">
          <div className="h-2 flex-1 rounded-full bg-[#eee4d4]">
            <div
              className="h-2 rounded-full bg-[linear-gradient(90deg,#f8de7a_0%,#f4c542_50%,#d6a220_100%)] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="mt-8 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <input
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder={isFa ? "نام کامل *" : "Full Name *"}
                className={inputClass}
              />
              <input
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={isFa ? "ایمیل *" : "Email *"}
                className={inputClass}
              />

              <div className="md:col-span-2">
                <div
                  ref={phoneWrapRef}
                  className={`phone-wrap relative rounded-2xl ${isFa ? "phone-wrap-rtl" : ""}`}
                >
                  <IntlTelInput
                    ref={phoneInputRef}
                    initialCountry="ir"
                    value={formData.phone}
                    onChangeCountry={handlePhoneCountryChange}
                    onChangeNumber={handlePhoneNumberChange}
                    inputProps={{
                      name: "phone",
                      required: true,
                      placeholder: isFa ? "شماره تماس *" : "Phone Number *",
                      className: "phone-input-premium",
                      onKeyDown: handlePhoneKeyDown,
                      onClick: keepCaretAfterPrefix,
                      onFocus: keepCaretAfterPrefix,
                    }}
                  />
                </div>
              </div>

              <input
                required
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder={isFa ? "کشور *" : "Country *"}
                className={inputClass}
              />
              <input
                required
                value={formData.cityAddress}
                onChange={(e) => handleChange("cityAddress", e.target.value)}
                placeholder={isFa ? "آدرس کامل *" : "Full Address *"}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
                {isFa ? "روش تماس ترجیحی" : "Preferred Contact Method"}
              </label>

              <div
                className={`flex gap-3 ${
                  isFa ? "justify-end flex-row-reverse" : "flex-col sm:flex-row"
                }`}
              >
                <label
                  className={`choice-chip flex cursor-pointer items-center gap-3 rounded-2xl px-5 py-4 text-slate-800 ${
                    isFa ? "" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredContactMethod"
                    value="phone"
                    checked={formData.preferredContactMethod === "phone"}
                    onChange={(e) => handleChange("preferredContactMethod", e.target.value)}
                    className="h-4 w-4 accent-amber-500"
                  />
                  <span>{isFa ? "تماس تلفنی" : "Phone Call"}</span>
                </label>

                <label
                  className={`choice-chip flex cursor-pointer items-center gap-3 rounded-2xl px-5 py-4 text-slate-800 ${
                    isFa ? "" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredContactMethod"
                    value="email"
                    checked={formData.preferredContactMethod === "email"}
                    onChange={(e) => handleChange("preferredContactMethod", e.target.value)}
                    className="h-4 w-4 accent-amber-500"
                  />
                  <span>{isFa ? "ایمیل" : "Email"}</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 2 && <div className="mt-8">{renderStep2()}</div>}

        {step === 3 && (
          <div className="mt-8 space-y-6">
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
                {isFa ? "دلیل علاقه به انرژی خورشیدی" : "Reason for interest in solar"}
              </label>
              <div className="grid gap-3">
                {reasonOptions.map((reason) => (
                  <label
                    key={reason}
                    className="choice-chip flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-800"
                  >
                    <input
                      type="checkbox"
                      checked={formData.interestReasons.includes(reason)}
                      onChange={() => toggleReason(reason)}
                      className="h-4 w-4 accent-amber-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <select
              value={formData.timeline}
              onChange={(e) => handleChange("timeline", e.target.value)}
              className={selectClass}
            >
              <option value="">{isFa ? "زمان‌بندی اجرا" : "Timeline for installation"}</option>
              {timelineOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div className="upload-premium rounded-3xl p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                {isFa ? "برای برآورد دقیق‌تر" : "For a better estimate"}
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {isFa
                  ? "برای دریافت برآورد دقیق‌تر، می‌توانید قبض برق، عکس‌های محل یا مدارک مرتبط را بارگذاری کنید."
                  : "Upload your electricity bill, site photos, or supporting documents to help us provide a more accurate estimate."}
              </p>

              <div className="mt-5">
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  {isFa ? "بارگذاری فایل" : "Upload Files"}
                </label>

                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                  className="block w-full rounded-2xl border border-[#dfd4be] bg-white px-5 py-4 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-[linear-gradient(135deg,#f8de7a_0%,#f4c542_55%,#d6a220_100%)] file:px-4 file:py-2 file:font-semibold file:text-slate-950"
                />

                <p className="mt-2 text-xs text-slate-500">
                  {isFa
                    ? "می‌توانید چند فایل اضافه کنید و هرکدام را قبل از ارسال حذف کنید."
                    : "You can add multiple files and remove any of them before submitting."}
                </p>

                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {formData.attachments.map((file, index) => (
                      <div
                        key={`${file.name}-${file.size}-${index}`}
                        className="flex items-center justify-between rounded-2xl border border-[#e5dac5] bg-white px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="ml-4 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                        >
                          {isFa ? "حذف" : "Remove"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <textarea
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder={isFa ? "توضیحات یا سوالات تکمیلی" : "Additional comments or questions"}
              className="input-premium min-h-36"
            />

            <label
              className={`flex items-start gap-3 rounded-2xl border px-4 py-4 text-sm transition ${
                consentError
                  ? "border-red-300 bg-red-50/80 text-red-600"
                  : "border-[#e5dac5] bg-white/70 text-slate-700"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => {
                  handleChange("consent", e.target.checked);
                  if (e.target.checked) setConsentError(false);
                }}
                className="mt-1 h-4 w-4 accent-amber-500"
              />
              <span>
                {isFa
                  ? "با ثبت این فرم، با ذخیره و پردازش اطلاعات خود برای دریافت پاسخ و مشاوره موافقت می‌کنم."
                  : "I agree to the storage and processing of my personal information for consultation and follow-up."}
              </span>
            </label>

            {consentError && (
              <p className="mt-3 text-sm font-medium text-red-600">
                {isFa ? "برای ارسال فرم باید با این مورد موافقت کنید." : "You must agree before submitting."}
              </p>
            )}
          </div>
        )}

        <div className={`mt-8 flex items-center justify-between ${isFa ? "flex-row-reverse" : ""}`}>
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="btn-soft-premium rounded-2xl px-8 py-4 text-base font-semibold"
            >
              {isFa ? "قبلی" : "Previous"}
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-gold rounded-2xl px-6 py-3 font-semibold"
            >
              {isFa ? "بعدی" : "Next"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-2xl px-6 py-3 font-semibold transition duration-300 ${
                isSubmitting ? "cursor-not-allowed bg-slate-200 text-slate-500" : "btn-gold"
              }`}
            >
              {isSubmitting
                ? isFa
                  ? "در حال ارسال..."
                  : "Submitting..."
                : isFa
                ? "ارسال"
                : "Submit"}
            </button>
          )}
        </div>
      </form>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
          <div className="popup-premium w-full max-w-lg rounded-[28px] p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900">{popupTitle}</h3>
            <p className="mt-4 text-base leading-8 text-slate-600">{popupMessage}</p>
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="btn-gold mt-6 rounded-2xl px-6 py-3 font-semibold"
            >
              {isFa ? "بستن" : "Close"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function InquirySection({ selectedInquiryType, setSelectedInquiryType }) {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  return (
    <section id="inquiry" className="bg-[#fcfaf5] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={isFa ? "شروع فرایند" : "Start Your Inquiry"}
          title={isFa ? "مسیر پروژه خود را انتخاب کنید" : "Choose Your Project Path"}
          subtitle={
            isFa
              ? "بر اساس نوع پروژه، فرم مناسب را انتخاب کنید تا تیم ما سریع‌تر و دقیق‌تر شما را راهنمایی کند."
              : "Select the inquiry path that fits your project so our team can respond with the right consultation flow."
          }
        />

        <div className="mt-10">
          <InquirySelector
            selectedInquiryType={selectedInquiryType}
            setSelectedInquiryType={setSelectedInquiryType}
          />
          <InquiryForm key={selectedInquiryType} selectedInquiryType={selectedInquiryType} />
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  return (
    <section id="contact" className="bg-white px-6 py-24">
      <div
        className={`cta-premium mx-auto max-w-5xl rounded-[34px] px-8 py-14 md:px-14 ${
          isFa ? "text-right" : "text-center"
        }`}
      >
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-600">
          {isFa ? "شروع گفتگو" : "Start the Conversation"}
        </p>

        <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
          {isFa ? "بیایید درباره پروژه خورشیدی شما صحبت کنیم" : "Let’s discuss your solar project"}
        </h2>

        <p className={`mt-5 max-w-2xl text-lg leading-8 text-slate-600 ${isFa ? "mr-0" : "mx-auto"}`}>
          {isFa
            ? "چه برای خانه، زمین، پروژه تجاری یا طرح‌های مقیاس بزرگ، تیم ما آماده بررسی و همراهی شماست."
            : "Whether you are planning a home system, land-based development, commercial installation, or utility-scale project, our team is ready to discuss it."}
        </p>

        <SectionNavButton
          sectionId={SECTION_IDS.inquiry}
          className="btn-gold mt-8 inline-block rounded-2xl px-8 py-4 text-base font-semibold"
        >
          {isFa ? "درخواست مشاوره" : "Request Consultation"}
        </SectionNavButton>
      </div>
    </section>
  );
}

function ThankYouPage() {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const navigate = useNavigate();

  return (
    <div
      className={`section-light flex min-h-screen items-center justify-center px-6 ${
        isFa ? "text-right" : "text-center"
      }`}
    >
      <div className="form-premium w-full max-w-2xl rounded-[32px] p-10">
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
          {isFa ? "متشکریم" : "Thank You"}
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          {isFa
            ? "درخواست شما با موفقیت ثبت شد. کارشناسان ما به‌زودی با شما تماس خواهند گرفت."
            : "Your request has been submitted successfully. Our professionals will contact you soon."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="btn-gold mt-8 rounded-2xl px-8 py-4 font-semibold"
        >
          {isFa ? "بازگشت به صفحه اصلی" : "Back to Home"}
        </button>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
    </div>
  );
}

function AdminDashboard({ language, setLanguage }) {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [updatingLeadId, setUpdatingLeadId] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  const text = {
    admin: isFa ? "مدیریت" : "Admin",
    title: isFa ? "داشبورد درخواست‌ها" : "Lead Dashboard",
    subtitle: isFa
      ? "مشاهده و مدیریت درخواست‌های ورودی پروژه‌های خورشیدی."
      : "View and manage incoming solar inquiries.",

    searchLeads: isFa ? "جستجوی درخواست‌ها" : "Search leads",
    searchPlaceholder: isFa
      ? "جستجو با نام، ایمیل، شماره یا موقعیت"
      : "Search by name, email, phone, or location",

    filterType: isFa ? "فیلتر بر اساس نوع درخواست" : "Filter by inquiry type",
    sortDate: isFa ? "مرتب‌سازی بر اساس تاریخ" : "Sort by date",

    newest: isFa ? "جدیدترین اول" : "Newest first",
    oldest: isFa ? "قدیمی‌ترین اول" : "Oldest first",

    all: isFa ? "همه" : "All",
    residential: isFa ? "مسکونی" : "Residential",
    commercial: isFa ? "تجاری" : "Commercial",
    land: isFa ? "زمین" : "Land",
    utility: isFa ? "نیروگاهی" : "Utility",

    totalLeads: isFa ? "کل درخواست‌ها" : "Total Leads",
    showing: isFa ? "نمایش داده‌شده" : "Showing",
    highPriority: isFa ? "درخواست‌های فوری" : "High Priority",
    mediumPriority: isFa ? "درخواست‌های مهم" : "Medium Priority",
    newLeads: isFa ? "درخواست‌های جدید" : "New Leads",

    refresh: isFa ? "بروزرسانی" : "Refresh Leads",
    loading: isFa ? "در حال بارگذاری درخواست‌ها..." : "Loading leads...",

    noLeads: isFa ? "درخواستی پیدا نشد" : "No leads found",
    noLeadsSub: isFa
      ? "جستجو، فیلتر نوع درخواست یا ترتیب تاریخ را تغییر دهید."
      : "Try changing the search text, inquiry type, or sort option.",

    urgentFollowUp: isFa ? "نیاز به پیگیری فوری" : "Urgent follow-up",

    score: isFa ? "امتیاز" : "Score",
    leadStatus: isFa ? "وضعیت درخواست" : "Lead status",
    updatingStatus: isFa ? "در حال بروزرسانی وضعیت..." : "Updating status...",

    details: isFa ? "جزئیات درخواست" : "Lead Details",

    contact: isFa ? "اطلاعات تماس" : "Contact",
    project: isFa ? "اطلاعات پروژه" : "Project",
    uploadsNotes: isFa ? "فایل‌ها و توضیحات" : "Uploads & Notes",

    message: isFa ? "پیام" : "Message",
    interestReasons: isFa ? "دلایل علاقه" : "Interest reasons",
    attachments: isFa ? "فایل‌های پیوست" : "Attachments",
    noUploads: isFa ? "فایلی وجود ندارد" : "No uploads",

    name: isFa ? "نام" : "Name",
    email: isFa ? "ایمیل" : "Email",
    phone: isFa ? "تلفن" : "Phone",
    country: isFa ? "کشور" : "Country",
    address: isFa ? "آدرس" : "Address",
    preferredContact: isFa ? "روش تماس ترجیحی" : "Preferred contact",

    type: isFa ? "نوع" : "Type",
    location: isFa ? "موقعیت" : "Location",
    landSize: isFa ? "متراژ زمین" : "Land size",
    monthlyBill: isFa ? "قبض ماهانه" : "Monthly bill",
    energyUsage: isFa ? "مصرف انرژی" : "Energy usage",
    timeline: isFa ? "زمان‌بندی" : "Timeline",

    created: isFa ? "ایجاد شده" : "Created",
    updated: isFa ? "بروزرسانی شده" : "Updated",
    status: isFa ? "وضعیت" : "Status",
    close: isFa ? "بستن" : "Close",

    unnamedLead: isFa ? "درخواست بدون نام" : "Unnamed Lead",
    noEmail: isFa ? "بدون ایمیل" : "No email",
    noPhone: isFa ? "بدون شماره" : "No phone",
    noData: "-",

    statusNew: isFa ? "درخواست جدید" : "New",
    statusContacted: isFa ? "تماس گرفته شده" : "Contacted",
    statusQuoted: isFa ? "پیشنهاد ارسال شده" : "Quoted",
    statusClosed: isFa ? "بسته شده" : "Closed",

    normal: isFa ? "عادی" : "Normal",
    medium: isFa ? "متوسط" : "Medium Priority",
    high: isFa ? "فوری" : "High Priority",
  };

  const getSafeArray = (value) => (Array.isArray(value) ? value : []);

  const getInquiryTypeLabel = (type) => {
    const map = {
      residential: text.residential,
      commercial: text.commercial,
      land: text.land,
      utility: text.utility,
    };
    return map[type] || type || text.noData;
  };

  const getStatusLabel = (status) => {
    const map = {
      new: text.statusNew,
      contacted: text.statusContacted,
      quoted: text.statusQuoted,
      closed: text.statusClosed,
    };
    return map[status] || status || text.noData;
  };

  const getPriorityClasses = (priority) => {
    if (priority === "high") {
      return {
        card: "border-red-200 bg-red-50/40 shadow-[0_12px_40px_rgba(239,68,68,0.12)]",
        badge: "bg-red-100 text-red-700",
      };
    }

    if (priority === "medium") {
      return {
        card: "border-yellow-200 bg-yellow-50/40 shadow-[0_12px_40px_rgba(245,158,11,0.10)]",
        badge: "bg-yellow-100 text-yellow-800",
      };
    }

    return {
      card: "border-[#e7dcc7] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]",
      badge: "bg-green-100 text-green-800",
    };
  };

  const getPriorityLabel = (priority) => {
    if (priority === "high") return text.high;
    if (priority === "medium") return text.medium;
    return text.normal;
  };

  const formatDateTime = (value) => {
    if (!value) return text.noData;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return text.noData;
    return date.toLocaleString(isFa ? "fa-IR" : undefined);
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/leads`
      );

      const textResponse = await response.text();
      let result;

      try {
        result = JSON.parse(textResponse);
      } catch {
        throw new Error(`Backend did not return JSON: ${textResponse}`);
      }

      if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch leads");
      }

      setLeads(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError(err.message || "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      setUpdatingLeadId(leadId);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/leads/${leadId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const textResponse = await response.text();
      let result;

      try {
        result = JSON.parse(textResponse);
      } catch {
        throw new Error(`Backend did not return JSON: ${textResponse}`);
      }

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update status");
      }

      setLeads((prev) => prev.map((lead) => (lead._id === leadId ? result.data : lead)));

      if (selectedLead?._id === leadId) {
        setSelectedLead(result.data);
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert(err.message || "Failed to update status");
    } finally {
      setUpdatingLeadId("");
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredLeads = leads
    .filter((lead) => {
      const matchesType = selectedType === "all" || lead?.inquiryType === selectedType;

      const searchableText = [
        lead?.contact?.fullName,
        lead?.contact?.email,
        lead?.contact?.phone,
        lead?.projectDetails?.projectLocation,
        lead?.projectDetails?.landLocation,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = normalizedSearch === "" || searchableText.includes(normalizedSearch);

      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a?.createdAt || 0).getTime();
      const dateB = new Date(b?.createdAt || 0).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const totalHigh = leads.filter((lead) => lead?.priority === "high").length;
  const totalMedium = leads.filter((lead) => lead?.priority === "medium").length;
  const totalNew = leads.filter((lead) => lead?.status === "new").length;

  return (
    <div className={`min-h-screen bg-[#f8f6f1] px-6 py-10 ${isFa ? "text-right font-['Vazirmatn']" : ""}`}>
      <div className="mx-auto max-w-7xl">
        <div
          className={`mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between ${
            isFa ? "xl:flex-row-reverse" : ""
          }`}
        >
          <div className="max-w-md">
            <p
              className={`text-sm font-medium text-amber-600 ${
                isFa ? "tracking-normal" : "uppercase tracking-[0.25em]"
              }`}
            >
              {text.admin}
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">{text.title}</h1>
            <p className="mt-3 text-lg text-slate-600">{text.subtitle}</p>
          </div>

          <div className="flex w-full max-w-5xl flex-col gap-4">
            <div className={`flex ${isFa ? "justify-start" : "justify-end"}`}>
              <AdminLanguageSwitcher language={language} setLanguage={setLanguage} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {text.searchLeads}
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={text.searchPlaceholder}
                  className="w-full rounded-2xl border border-[#d8cfbf] bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {text.filterType}
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full rounded-2xl border border-[#d8cfbf] bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
                >
                  <option value="all">{text.all}</option>
                  <option value="residential">{text.residential}</option>
                  <option value="commercial">{text.commercial}</option>
                  <option value="land">{text.land}</option>
                  <option value="utility">{text.utility}</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {text.sortDate}
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full rounded-2xl border border-[#d8cfbf] bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
                >
                  <option value="newest">{text.newest}</option>
                  <option value="oldest">{text.oldest}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-3xl border border-[#e7dcc7] bg-white px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <p
              className={`text-xs text-slate-500 ${
                isFa ? "tracking-normal" : "uppercase tracking-[0.2em]"
              }`}
            >
              {text.totalLeads}
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{leads.length}</p>
          </div>

          <div className="rounded-3xl border border-[#e7dcc7] bg-white px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <p
              className={`text-xs text-slate-500 ${
                isFa ? "tracking-normal" : "uppercase tracking-[0.2em]"
              }`}
            >
              {text.showing}
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{filteredLeads.length}</p>
          </div>

          <div className="rounded-3xl border border-red-100 bg-red-50/70 px-5 py-4 shadow-[0_12px_40px_rgba(239,68,68,0.08)]">
            <p
              className={`text-xs text-red-500 ${
                isFa ? "tracking-normal" : "uppercase tracking-[0.2em]"
              }`}
            >
              {text.highPriority}
            </p>
            <p className="mt-2 text-3xl font-bold text-red-700">{totalHigh}</p>
          </div>

          <div className="rounded-3xl border border-yellow-100 bg-yellow-50/70 px-5 py-4 shadow-[0_12px_40px_rgba(245,158,11,0.08)]">
            <p
              className={`text-xs text-yellow-600 ${
                isFa ? "tracking-normal" : "uppercase tracking-[0.2em]"
              }`}
            >
              {text.mediumPriority}
            </p>
            <p className="mt-2 text-3xl font-bold text-yellow-700">{totalMedium}</p>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50/70 px-5 py-4 shadow-[0_12px_40px_rgba(59,130,246,0.08)]">
            <p
              className={`text-xs text-blue-600 ${
                isFa ? "tracking-normal" : "uppercase tracking-[0.2em]"
              }`}
            >
              {text.newLeads}
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-700">{totalNew}</p>
          </div>
        </div>

        <div className={`mb-6 flex ${isFa ? "justify-start" : "justify-end"}`}>
          <button
            type="button"
            onClick={fetchLeads}
            className="rounded-2xl border border-[#d8cfbf] bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-amber-400 hover:text-slate-900"
          >
            {text.refresh}
          </button>
        </div>

        {loading && (
          <div className="rounded-3xl border border-[#e7dcc7] bg-white p-8 text-slate-600 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            {text.loading}
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && filteredLeads.length === 0 && (
          <div className="rounded-3xl border border-[#e7dcc7] bg-white p-10 text-center text-slate-600 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <h2 className="text-2xl font-semibold text-slate-900">{text.noLeads}</h2>
            <p className="mt-3">{text.noLeadsSub}</p>
          </div>
        )}

        <div className="grid gap-6">
          {filteredLeads.map((lead) => {
            const priorityStyles = getPriorityClasses(lead?.priority);

            return (
              <div
                key={lead?._id || `${lead?.contact?.email || "lead"}-${lead?.createdAt || Math.random()}`}
                onClick={() => setSelectedLead(lead)}
                className={`cursor-pointer rounded-[28px] border p-7 transition hover:scale-[1.01] ${priorityStyles.card}`}
              >
                <div
                  className={`flex flex-col gap-4 border-b border-[#eee4d3] pb-5 lg:flex-row lg:items-start lg:justify-between ${
                    isFa ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {lead?.contact?.fullName || text.unnamedLead}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {lead?.contact?.email || text.noEmail} • {lead?.contact?.phone || text.noPhone}
                    </p>

                    {lead?.priority === "high" && (
                      <p
                        className={`mt-2 inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 ${
                          isFa ? "tracking-normal" : "uppercase tracking-[0.12em]"
                        }`}
                      >
                        {text.urgentFollowUp}
                      </p>
                    )}
                  </div>

                  <div className={`flex flex-col gap-3 ${isFa ? "lg:items-start" : "lg:items-end"}`}>
                    <div
                      className={`flex flex-wrap gap-3 ${
                        isFa ? "lg:justify-start" : "lg:justify-end"
                      }`}
                    >
                      <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                        {getInquiryTypeLabel(lead?.inquiryType)}
                      </span>
                      <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800">
                        {text.score}: {lead?.leadScore ?? 0}
                      </span>
                      <span className={`rounded-full px-4 py-2 text-sm font-medium ${priorityStyles.badge}`}>
                        {getPriorityLabel(lead?.priority)}
                      </span>
                    </div>

                    <div className="w-full min-w-[180px] lg:w-[220px]">
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        {text.leadStatus}
                      </label>
                      <select
                        value={lead?.status || "new"}
                        disabled={updatingLeadId === lead?._id}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(lead?._id, e.target.value)}
                        className="w-full rounded-2xl border border-[#d8cfbf] bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                      >
                        <option value="new">{text.statusNew}</option>
                        <option value="contacted">{text.statusContacted}</option>
                        <option value="quoted">{text.statusQuoted}</option>
                        <option value="closed">{text.statusClosed}</option>
                      </select>

                      {updatingLeadId === lead?._id && (
                        <p className="mt-2 text-xs text-slate-500">{text.updatingStatus}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                  <div className="rounded-3xl bg-[#fcfaf6] p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{text.contact}</h3>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-medium text-slate-800">{text.name}:</span>{" "}
                        {lead?.contact?.fullName || text.noData}
                      </p>
                      <p>
                        <span className="font-medium text-slate-800">{text.email}:</span>{" "}
                        {lead?.contact?.email || text.noData}
                      </p>
                      <p>
                        <span className="font-medium text-slate-800">{text.phone}:</span>{" "}
                        {lead?.contact?.phone || text.noData}
                      </p>
                      <p>
                        <span className="font-medium text-slate-800">{text.country}:</span>{" "}
                        {lead?.contact?.country || text.noData}
                      </p>
                      <p>
                        <span className="font-medium text-slate-800">{text.address}:</span>{" "}
                        {lead?.contact?.cityAddress || text.noData}
                      </p>
                      <p>
                        <span className="font-medium text-slate-800">{text.preferredContact}:</span>{" "}
                        {lead?.contact?.preferredContactMethod || text.noData}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-[#fcfaf6] p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{text.project}</h3>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-medium text-slate-800">{text.type}:</span>{" "}
                        {getInquiryTypeLabel(lead?.inquiryType)}
                      </p>
                      <p>
                        <span className="font-medium text-slate-800">{text.location}:</span>{" "}
                        {lead?.projectDetails?.projectLocation ||
                          lead?.projectDetails?.landLocation ||
                          text.noData}
                      </p>
                      <p>
                        <span className="font-medium text-slate-800">{text.landSize}:</span>{" "}
                        {lead?.projectDetails?.landSize || text.noData}
                      </p>
                      <p>
                        <span className="font-medium text-slate-800">{text.monthlyBill}:</span>{" "}
                        {lead?.projectDetails?.monthlyBill || text.noData}
                      </p>
                      <p>
                        <span className="font-medium text-slate-800">{text.energyUsage}:</span>{" "}
                        {lead?.projectDetails?.energyUsage || text.noData}
                      </p>
                      <p>
                        <span className="font-medium text-slate-800">{text.timeline}:</span>{" "}
                        {lead?.timeline || text.noData}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-[#fcfaf6] p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{text.uploadsNotes}</h3>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <div>
                        <p className="font-medium text-slate-800">{text.message}</p>
                        <p className="mt-1 break-words">{lead?.message || text.noData}</p>
                      </div>

                      <div>
                        <p className="font-medium text-slate-800">{text.interestReasons}</p>
                        {getSafeArray(lead?.interestReasons).length ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {getSafeArray(lead?.interestReasons).map((reason, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700"
                              >
                                {reason}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-1">{text.noData}</p>
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-slate-800">{text.attachments}</p>
                        {getSafeArray(lead?.attachments).length ? (
                          <div className="mt-2 space-y-2">
                            {getSafeArray(lead?.attachments).map((file, index) => (
                              <div
                                key={index}
                                className="rounded-2xl border border-[#e7dcc7] bg-white px-4 py-3"
                              >
                                <p className="truncate font-medium text-slate-800">
                                  {file?.originalName || "Unnamed file"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {file?.mimeType || "unknown"} •{" "}
                                  {typeof file?.size === "number"
                                    ? `${(file.size / 1024).toFixed(1)} KB`
                                    : "0.0 KB"}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-1">{text.noUploads}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`mt-5 flex flex-col gap-2 text-xs text-slate-400 md:flex-row md:items-center md:justify-between ${
                    isFa ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <span>
                    {text.created}: {formatDateTime(lead?.createdAt)}
                  </span>
                  <span>
                    {text.updated}: {formatDateTime(lead?.updatedAt)}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-slate-500 shadow-sm">
                    {text.status}: {getStatusLabel(lead?.status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />

          <div
            className={`h-full w-[420px] max-w-full overflow-y-auto bg-white p-6 shadow-2xl animate-[slideIn_.3s_ease] ${
              isFa ? "text-right font-['Vazirmatn']" : ""
            }`}
          >
            <div className={`mb-6 flex items-center justify-between ${isFa ? "flex-row-reverse" : ""}`}>
              <h2 className="text-xl font-bold text-slate-900">{text.details}</h2>

              <button
                onClick={() => setSelectedLead(null)}
                className="text-lg text-slate-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            <h3 className="text-2xl font-semibold text-slate-900">
              {selectedLead.contact?.fullName || text.unnamedLead}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {selectedLead.contact?.email || text.noEmail} • {selectedLead.contact?.phone || text.noPhone}
            </p>

            <div className="mt-5">
              <label className="text-sm text-slate-600">{text.leadStatus}</label>
              <select
                value={selectedLead.status || "new"}
                onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#d8cfbf] px-3 py-2"
              >
                <option value="new">{text.statusNew}</option>
                <option value="contacted">{text.statusContacted}</option>
                <option value="quoted">{text.statusQuoted}</option>
                <option value="closed">{text.statusClosed}</option>
              </select>
            </div>

            <div className="mt-6 space-y-6 text-sm text-slate-600">
              <div>
                <p className="mb-2 font-semibold text-slate-800">{text.contact}</p>
                <p>{text.country}: {selectedLead.contact?.country || text.noData}</p>
                <p>{text.address}: {selectedLead.contact?.cityAddress || text.noData}</p>
                <p>{text.preferredContact}: {selectedLead.contact?.preferredContactMethod || text.noData}</p>
              </div>

              <div>
                <p className="mb-2 font-semibold text-slate-800">{text.project}</p>
                <p>{text.type}: {getInquiryTypeLabel(selectedLead.inquiryType)}</p>
                <p>
                  {text.location}:{" "}
                  {selectedLead.projectDetails?.projectLocation ||
                    selectedLead.projectDetails?.landLocation ||
                    text.noData}
                </p>
                <p>{text.landSize}: {selectedLead.projectDetails?.landSize || text.noData}</p>
                <p>{text.monthlyBill}: {selectedLead.projectDetails?.monthlyBill || text.noData}</p>
                <p>{text.energyUsage}: {selectedLead.projectDetails?.energyUsage || text.noData}</p>
                <p>{text.timeline}: {selectedLead.timeline || text.noData}</p>
              </div>

              <div>
                <p className="mb-2 font-semibold text-slate-800">{text.message}</p>
                <p>{selectedLead.message || text.noData}</p>
              </div>

              <div>
                <p className="mb-2 font-semibold text-slate-800">{text.interestReasons}</p>
                {getSafeArray(selectedLead.interestReasons).length ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedLead.interestReasons.map((reason, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>{text.noData}</p>
                )}
              </div>

              <div>
                <p className="mb-2 font-semibold text-slate-800">{text.attachments}</p>
                {getSafeArray(selectedLead.attachments).length ? (
                  <div className="space-y-2">
                    {selectedLead.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-[#e7dcc7] bg-[#fcfaf6] px-4 py-3"
                      >
                        <p className="truncate font-medium text-slate-800">
                          {file?.originalName || "Unnamed file"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {file?.mimeType || "unknown"} •{" "}
                          {typeof file?.size === "number"
                            ? `${(file.size / 1024).toFixed(1)} KB`
                            : "0.0 KB"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{text.noUploads}</p>
                )}
              </div>

              <div>
                <p className="mb-2 font-semibold text-slate-800">{text.created}</p>
                <p>{formatDateTime(selectedLead.createdAt)}</p>
              </div>

              <div>
                <p className="mb-2 font-semibold text-slate-800">{text.updated}</p>
                <p>{formatDateTime(selectedLead.updatedAt)}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedLead(null)}
              className="btn-gold mt-8 rounded-2xl px-6 py-3 font-semibold"
            >
              {text.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Landing({ language, setLanguage }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedInquiryType, setSelectedInquiryType] = useState("residential");

  useEffect(() => {
    const targetSection = location.state?.scrollTo;
    if (!targetSection) return;

    requestAnimationFrame(() => {
      scrollToSection(targetSection);
      navigate(location.pathname, { replace: true, state: null });
    });
  }, [location.pathname, location.state, navigate]);

  return (
    <div className="min-h-screen">
      <section className="relative bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <CinematicBackground />
        </div>

        <div className="relative z-10">
          <Navbar language={language} setLanguage={setLanguage} />
          <Hero />
          <ProjectTypeCards setSelectedInquiryType={setSelectedInquiryType} />
        </div>
      </section>

      <ServicesSection />
      <PortfolioPreviewSection />
      <CredibilitySection />
      <InquirySection
        selectedInquiryType={selectedInquiryType}
        setSelectedInquiryType={setSelectedInquiryType}
      />
      <FinalCTASection />
    </div>
  );
}

function AppShell() {
  const { i18n } = useTranslation();

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app-language") || "fa";
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    localStorage.setItem("app-language", language);
  }, [language, i18n]);

  return (
    <Routes>
      <Route path="/" element={<Landing language={language} setLanguage={setLanguage} />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/admin-login" element={<AdminLoginPage language={language} />} />
      <Route
        path="/admin-dashboard"
        element={<AdminDashboardPage language={language} setLanguage={setLanguage} />}
      />
      <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
      <Route path="/services" element={<PlaceholderPage title="Services" />} />
      <Route path="/projects" element={<PlaceholderPage title="Projects" />} />
      <Route path="/partnerships" element={<PlaceholderPage title="Partnerships" />} />
      <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
    </Routes>
  );
}

function App() {
  const Router = window.location.protocol === "file:" ? HashRouter : BrowserRouter;

  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
