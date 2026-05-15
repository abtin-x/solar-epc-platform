import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      brand: "SolarPro",
      navHome: "Home",
      navServices: "Services",
      navProjects: "Projects",
      navPartnerships: "Partnerships",
      navContact: "Contact",
      navConsultation: "Request Consultation",
      heroTitle1: "Solar solutions from homes",
      heroTitle2: "to utility-scale power plants",
      heroSubtitle:
        "We design, develop, and install solar projects for residential, commercial, land-based, and public-sector clients.",
      heroPrimary: "Request Consultation",
      heroSecondary: "View Projects",
      cardResidential: "Residential Solar",
      cardCommercial: "Commercial & Industrial",
      cardLand: "Land-Based Projects",
      cardUtility: "Utility-Scale & Government",
      cardText: "Tailored solar solutions for your project type.",
    },
  },
  fa: {
    translation: {
      brand: "سولار پرو",
      navHome: "خانه",
      navServices: "خدمات",
      navProjects: "پروژه‌ها",
      navPartnerships: "مشارکت‌ها",
      navContact: "تماس",
      navConsultation: "درخواست مشاوره",
      heroTitle1: "سولارهای خورشیدی از خانه‌ها",
      heroTitle2: "تا نیروگاه‌های مقیاس بزرگ",
      heroSubtitle:
        "ما پروژه‌های خورشیدی را برای بخش مسکونی، تجاری، زمین‌محور و عمومی طراحی، توسعه و اجرا می‌کنیم.",
      heroPrimary: "درخواست مشاوره",
      heroSecondary: "مشاهده پروژه‌ها",
      cardResidential: "خورشیدی مسکونی",
      cardCommercial: "تجاری و صنعتی",
      cardLand: "پروژه‌های زمین‌محور",
      cardUtility: "نیروگاهی و دولتی",
      cardText: "سولارهای متناسب با نوع پروژه شما.",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fa",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
