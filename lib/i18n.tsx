"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Lang = "en" | "ru";

type Translations = {
  [key: string]: { en: string; ru: string };
};

const translations: Translations = {
  // Nav
  "nav.home": { en: "Home", ru: "Главная" },
  "nav.about": { en: "About", ru: "О нас" },
  "nav.services": { en: "Services", ru: "Услуги" },
  "nav.contact": { en: "Contact", ru: "Контакты" },
  "nav.cta": { en: "Get in Touch", ru: "Связаться" },

  // Hero
  "hero.tag": { en: "Merchant Onboarding & Payment Solutions", ru: "Онбординг мерчантов и платёжные решения" },
  "hero.title1": { en: "Your Gateway to", ru: "Ваш путь к" },
  "hero.title2": { en: "Global Payments", ru: "глобальным платежам" },
  "hero.desc": {
    en: "Black Queen Ops builds frontshops, onboarding flows, and payment infrastructure for digital goods, eSIM, and online education. We help merchants get approved and start processing worldwide.",
    ru: "Black Queen Ops создаёт фронтшопы, онбординг-процессы и платёжную инфраструктуру для цифровых товаров, eSIM и онлайн-образования. Мы помогаем мерчантам пройти одобрение и начать процессинг по всему миру.",
  },
  "hero.cta1": { en: "Start Onboarding", ru: "Начать онбординг" },
  "hero.cta2": { en: "Our Services", ru: "Наши услуги" },

  // Stats
  "stats.1.value": { en: "50+", ru: "50+" },
  "stats.1.label": { en: "Merchants Onboarded", ru: "Мерчантов подключено" },
  "stats.2.value": { en: "EU & UK", ru: "ЕС и UK" },
  "stats.2.label": { en: "Jurisdictions", ru: "Юрисдикции" },
  "stats.3.value": { en: "24h", ru: "24ч" },
  "stats.3.label": { en: "Frontshop Delivery", ru: "Запуск фронтшопа" },
  "stats.4.value": { en: "95%+", ru: "95%+" },
  "stats.4.label": { en: "Approval Rate", ru: "Процент одобрений" },

  // Services section home
  "services.tag": { en: "What We Do", ru: "Что мы делаем" },
  "services.title": { en: "End-to-End Merchant Solutions", ru: "Полный цикл решений для мерчантов" },
  "services.1.title": { en: "Frontshop Development", ru: "Разработка фронтшопов" },
  "services.1.desc": {
    en: "We design and build compliant, conversion-optimized storefronts tailored for merchant onboarding with PSPs and acquirers.",
    ru: "Проектируем и создаём комплаентные, конверсионные витрины для онбординга мерчантов с PSP и эквайерами.",
  },
  "services.2.title": { en: "Merchant Onboarding", ru: "Онбординг мерчантов" },
  "services.2.desc": {
    en: "Full-cycle onboarding support: document preparation, application filing, KYC/KYB coordination, and approval management.",
    ru: "Полный цикл сопровождения: подготовка документов, подача заявок, координация KYC/KYB, управление одобрениями.",
  },
  "services.3.title": { en: "Payment Integration", ru: "Платёжная интеграция" },
  "services.3.desc": {
    en: "Connect your business to global payment networks. Gateway setup, multi-currency processing, and fraud prevention.",
    ru: "Подключаем бизнес к глобальным платёжным сетям. Настройка шлюзов, мультивалютный процессинг, защита от фрода.",
  },
  "services.more": { en: "View All Services", ru: "Все услуги" },

  // Why us
  "why.tag": { en: "Why Black Queen", ru: "Почему Black Queen" },
  "why.title": { en: "Your Strategic Advantage", ru: "Ваше стратегическое преимущество" },
  "why.1.title": { en: "Frontshop Expertise", ru: "Экспертиза фронтшопов" },
  "why.1.desc": {
    en: "We know exactly what acquirers look for. Our frontshops are built to pass compliance checks on the first try.",
    ru: "Мы точно знаем, что ищут эквайеры. Наши фронтшопы проходят комплаенс-проверки с первого раза.",
  },
  "why.2.title": { en: "Speed & Efficiency", ru: "Скорость и эффективность" },
  "why.2.desc": {
    en: "From brief to live frontshop in 24 hours. Onboarding applications submitted within days, not weeks.",
    ru: "От брифа до готового фронтшопа за 24 часа. Заявки на онбординг подаются за дни, а не недели.",
  },
  "why.3.title": { en: "Global Network", ru: "Глобальная сеть" },
  "why.3.desc": {
    en: "Direct relationships with PSPs, acquirers, and payment facilitators across EU, UK, and international markets.",
    ru: "Прямые контакты с PSP, эквайерами и платёжными фасилитаторами в ЕС, UK и международных рынках.",
  },
  "why.4.title": { en: "Full Compliance", ru: "Полный комплаенс" },
  "why.4.desc": {
    en: "Every frontshop and onboarding package meets regulatory requirements. We handle KYC, KYB, and AML documentation.",
    ru: "Каждый фронтшоп и пакет онбординга соответствует нормативным требованиям. KYC, KYB и AML-документация.",
  },

  // CTA
  "cta.title": { en: "Ready to Start Processing?", ru: "Готовы начать процессинг?" },
  "cta.desc": {
    en: "Let's build your frontshop, handle the onboarding, and get you processing payments globally.",
    ru: "Построим фронтшоп, проведём онбординг и запустим приём платежей по всему миру.",
  },
  "cta.button": { en: "Get Started", ru: "Начать" },

  // About page
  "about.tag": { en: "About Us", ru: "О нас" },
  "about.title1": { en: "Powering Merchant", ru: "Ускоряем" },
  "about.title2": { en: "Success", ru: "успех мерчантов" },
  "about.desc": {
    en: "Black Queen Ops is an international fintech company specializing in merchant onboarding, frontshop development, and payment infrastructure for digital businesses.",
    ru: "Black Queen Ops — международная финтех-компания, специализирующаяся на онбординге мерчантов, разработке фронтшопов и платёжной инфраструктуре для цифрового бизнеса.",
  },
  "about.mission.title": { en: "Our Mission", ru: "Наша миссия" },
  "about.mission.desc": {
    en: "To create a seamless path from business idea to live payment processing. We handle the complexity of compliance, frontshop development, and acquirer relationships so you can focus on growing your business.",
    ru: "Создать бесшовный путь от бизнес-идеи до работающего процессинга. Мы берём на себя сложности комплаенса, разработки фронтшопов и отношений с эквайерами, чтобы вы могли сосредоточиться на росте бизнеса.",
  },
  "about.vision.title": { en: "Our Vision", ru: "Наше видение" },
  "about.vision.desc": {
    en: "To become the go-to partner for digital merchants worldwide — the single point of contact that transforms a business concept into a fully compliant, revenue-generating online operation.",
    ru: "Стать главным партнёром для цифровых мерчантов по всему миру — единой точкой контакта, которая превращает бизнес-концепцию в полностью комплаентную онлайн-операцию.",
  },
  "about.values.title": { en: "What We Stand For", ru: "Наши ценности" },
  "about.values.1.title": { en: "Speed", ru: "Скорость" },
  "about.values.1.desc": {
    en: "24-hour frontshop delivery. Rapid onboarding submissions. We move fast because your revenue depends on it.",
    ru: "Фронтшоп за 24 часа. Быстрая подача заявок. Мы работаем быстро, потому что от этого зависит ваш доход.",
  },
  "about.values.2.title": { en: "Compliance-First", ru: "Комплаенс в приоритете" },
  "about.values.2.desc": {
    en: "Every solution is built with regulatory requirements in mind. No shortcuts, no risks to your merchant accounts.",
    ru: "Каждое решение строится с учётом регуляторных требований. Без компромиссов, без рисков для ваших мерчант-аккаунтов.",
  },
  "about.values.3.title": { en: "Partnership", ru: "Партнёрство" },
  "about.values.3.desc": {
    en: "Your success is our success. Revenue share models, long-term support, and a genuine investment in your growth.",
    ru: "Ваш успех — наш успех. Модели revenue share, долгосрочная поддержка и реальная заинтересованность в вашем росте.",
  },

  // Roadmap
  "roadmap.title": { en: "Our Roadmap", ru: "Дорожная карта" },
  "roadmap.1.year": { en: "Year 1", ru: "Год 1" },
  "roadmap.1.title": { en: "Foundation", ru: "Фундамент" },
  "roadmap.1.items": {
    en: "Core frontshop templates|PSP & acquirer partnerships|Onboarding process automation|First 50 merchants",
    ru: "Базовые шаблоны фронтшопов|Партнёрства с PSP и эквайерами|Автоматизация онбординга|Первые 50 мерчантов",
  },
  "roadmap.2.year": { en: "Year 2", ru: "Год 2" },
  "roadmap.2.title": { en: "Scale", ru: "Масштабирование" },
  "roadmap.2.items": {
    en: "Enterprise onboarding platform|Compliance team expansion|Multi-jurisdiction support|Self-service dashboard",
    ru: "Enterprise-платформа онбординга|Расширение комплаенс-команды|Мультиюрисдикционная поддержка|Панель самообслуживания",
  },
  "roadmap.3.year": { en: "Year 3", ru: "Год 3" },
  "roadmap.3.title": { en: "Expand", ru: "Экспансия" },
  "roadmap.3.items": {
    en: "AI-powered compliance tools|Investment in merchant projects|Global payment network|Full-cycle fintech platform",
    ru: "AI-инструменты комплаенса|Инвестиции в проекты мерчантов|Глобальная платёжная сеть|Полноцикловая финтех-платформа",
  },
  "about.cta.title": { en: "Want to Work With Us?", ru: "Хотите работать с нами?" },
  "about.cta.desc": {
    en: "Whether you need a frontshop, merchant onboarding, or a complete payment setup — we're ready to help.",
    ru: "Нужен фронтшоп, онбординг мерчанта или полная настройка платежей — мы готовы помочь.",
  },

  // Services page
  "srvpage.tag": { en: "Our Services", ru: "Наши услуги" },
  "srvpage.title1": { en: "Complete Merchant", ru: "Полный цикл" },
  "srvpage.title2": { en: "Solutions", ru: "для мерчантов" },
  "srvpage.desc": {
    en: "From frontshop design to live payment processing — we handle every step of your merchant journey.",
    ru: "От дизайна фронтшопа до запуска процессинга — мы ведём каждый этап вашего мерчант-пути.",
  },
  "srvpage.s1.title": { en: "Frontshop Development", ru: "Разработка фронтшопов" },
  "srvpage.s1.desc": {
    en: "Custom-built storefronts designed to meet acquirer requirements and maximize approval rates. Responsive, fast, and fully compliant.",
    ru: "Витрины, созданные для соответствия требованиям эквайеров и максимального процента одобрений. Адаптивные, быстрые, полностью комплаентные.",
  },
  "srvpage.s1.f": {
    en: "Acquirer-compliant design|Product catalog setup|Legal pages & policies|SSL & security setup|Mobile-responsive layout",
    ru: "Дизайн по требованиям эквайеров|Настройка каталога товаров|Юридические страницы и политики|SSL и безопасность|Адаптивная мобильная вёрстка",
  },
  "srvpage.s2.title": { en: "Merchant Onboarding", ru: "Онбординг мерчантов" },
  "srvpage.s2.desc": {
    en: "End-to-end onboarding with PSPs and acquirers. We prepare documents, file applications, coordinate KYC/KYB, and manage the approval process.",
    ru: "Полный онбординг с PSP и эквайерами. Готовим документы, подаём заявки, координируем KYC/KYB и управляем процессом одобрения.",
  },
  "srvpage.s2.f": {
    en: "Document preparation|Application filing|KYC/KYB coordination|Approval management|Multi-PSP strategy",
    ru: "Подготовка документов|Подача заявок|Координация KYC/KYB|Управление одобрениями|Мульти-PSP стратегия",
  },
  "srvpage.s3.title": { en: "Payment Integration", ru: "Платёжная интеграция" },
  "srvpage.s3.desc": {
    en: "Technical integration of payment gateways, multi-currency processing, 3DS, and fraud prevention systems into your frontshop.",
    ru: "Техническая интеграция платёжных шлюзов, мультивалютного процессинга, 3DS и систем защиты от фрода в ваш фронтшоп.",
  },
  "srvpage.s3.f": {
    en: "Gateway API integration|Multi-currency setup|3DS implementation|Fraud prevention|Webhook & callback setup",
    ru: "Интеграция API шлюзов|Настройка мультивалюты|Внедрение 3DS|Защита от фрода|Настройка вебхуков и колбэков",
  },
  "srvpage.s4.title": { en: "Compliance & Risk", ru: "Комплаенс и риски" },
  "srvpage.s4.desc": {
    en: "Regulatory compliance consulting: AML policies, KYC procedures, risk assessments, and ongoing monitoring to keep your merchant accounts safe.",
    ru: "Консалтинг по регуляторному комплаенсу: AML-политики, KYC-процедуры, оценка рисков и постоянный мониторинг для защиты мерчант-аккаунтов.",
  },
  "srvpage.s4.f": {
    en: "AML policy development|KYC procedure design|Risk assessment frameworks|Chargeback management|Regulatory monitoring",
    ru: "Разработка AML-политик|Проектирование KYC-процедур|Фреймворки оценки рисков|Управление чарджбэками|Регуляторный мониторинг",
  },
  "srvpage.s5.title": { en: "Website Development", ru: "Разработка сайтов" },
  "srvpage.s5.desc": {
    en: "Full-stack website development for merchants: landing pages, e-commerce platforms, and onboarding portals built with modern technologies.",
    ru: "Полная разработка сайтов для мерчантов: лендинги, e-commerce платформы и порталы онбординга на современных технологиях.",
  },
  "srvpage.s5.f": {
    en: "Landing pages & portfolios|E-commerce platforms|Admin dashboards|SEO optimization|Performance & speed",
    ru: "Лендинги и портфолио|E-commerce платформы|Админ-панели|SEO-оптимизация|Производительность и скорость",
  },
  "srvpage.s6.title": { en: "Strategic Advisory", ru: "Стратегический консалтинг" },
  "srvpage.s6.desc": {
    en: "High-level consulting on market entry, PSP selection, pricing strategy, and scaling your payment operations internationally.",
    ru: "Консалтинг по выходу на рынок, выбору PSP, ценовой стратегии и масштабированию платёжных операций на международном уровне.",
  },
  "srvpage.s6.f": {
    en: "Market entry strategy|PSP & acquirer selection|Pricing optimization|International expansion|Partnership development",
    ru: "Стратегия выхода на рынок|Выбор PSP и эквайеров|Оптимизация ценообразования|Международная экспансия|Развитие партнёрств",
  },

  // Pricing
  "pricing.title": { en: "Flexible Pricing", ru: "Гибкое ценообразование" },
  "pricing.desc": {
    en: "Choose the engagement model that works best for your business.",
    ru: "Выберите модель сотрудничества, которая подходит вашему бизнесу.",
  },
  "pricing.1.model": { en: "Frontshop Package", ru: "Пакет «Фронтшоп»" },
  "pricing.1.price": { en: "From €1,500", ru: "От €1 500" },
  "pricing.1.desc": { en: "Complete frontshop + onboarding application package ready for acquirer submission.", ru: "Готовый фронтшоп + пакет документов для подачи эквайеру." },
  "pricing.2.model": { en: "Full Onboarding", ru: "Полный онбординг" },
  "pricing.2.price": { en: "From €3K/mo", ru: "От €3K/мес" },
  "pricing.2.desc": { en: "Ongoing onboarding management, compliance support, and merchant account maintenance.", ru: "Постоянное управление онбордингом, комплаенс-поддержка и обслуживание мерчант-аккаунтов." },
  "pricing.3.model": { en: "Revenue Share", ru: "Revenue Share" },
  "pricing.3.price": { en: "5-10%", ru: "5-10%" },
  "pricing.3.desc": { en: "Performance-aligned model. We invest in your success and share the results.", ru: "Модель, привязанная к результату. Мы инвестируем в ваш успех и делим результат." },
  "srvpage.cta.title": { en: "Let's Build Your Payment Flow", ru: "Давайте построим ваш платёжный поток" },
  "srvpage.cta.desc": {
    en: "Every business is unique. Tell us about your needs and we'll design the perfect solution.",
    ru: "Каждый бизнес уникален. Расскажите о ваших потребностях, и мы спроектируем идеальное решение.",
  },
  "srvpage.cta.button": { en: "Request a Proposal", ru: "Запросить предложение" },

  // Contact page
  "contact.tag": { en: "Contact Us", ru: "Свяжитесь с нами" },
  "contact.title1": { en: "Let's Start a", ru: "Начнём" },
  "contact.title2": { en: "Conversation", ru: "разговор" },
  "contact.desc": {
    en: "Need a frontshop, merchant onboarding, or payment integration? We're here to help.",
    ru: "Нужен фронтшоп, онбординг мерчанта или платёжная интеграция? Мы здесь, чтобы помочь.",
  },
  "contact.info.title": { en: "Get in Touch", ru: "Контакты" },
  "contact.email": { en: "Email", ru: "Email" },
  "contact.telegram": { en: "Telegram", ru: "Telegram" },
  "contact.linkedin": { en: "LinkedIn", ru: "LinkedIn" },
  "contact.location": { en: "Location", ru: "Локация" },
  "contact.location.value": { en: "European Union", ru: "Европейский Союз" },
  "contact.location.sub": { en: "Remote-first company", ru: "Удалённая компания" },
  "contact.response.title": { en: "Response Time", ru: "Время ответа" },
  "contact.response.desc": {
    en: "We respond within 24 hours. For urgent onboarding matters, reach out via Telegram.",
    ru: "Мы отвечаем в течение 24 часов. По срочным вопросам онбординга пишите в Telegram.",
  },
  "contact.form.title": { en: "Send a Message", ru: "Отправить сообщение" },
  "contact.form.name": { en: "Name", ru: "Имя" },
  "contact.form.name.ph": { en: "Your name", ru: "Ваше имя" },
  "contact.form.email": { en: "Email", ru: "Email" },
  "contact.form.email.ph": { en: "your@email.com", ru: "ваш@email.com" },
  "contact.form.company": { en: "Company", ru: "Компания" },
  "contact.form.company.ph": { en: "Company name", ru: "Название компании" },
  "contact.form.message": { en: "Message", ru: "Сообщение" },
  "contact.form.message.ph": {
    en: "Tell us about your project — what kind of frontshop or onboarding do you need?",
    ru: "Расскажите о проекте — какой фронтшоп или онбординг вам нужен?",
  },
  "contact.form.submit": { en: "Send Message", ru: "Отправить" },

  // Footer
  "footer.desc": {
    en: "Frontshop development, merchant onboarding, and payment solutions for digital businesses worldwide.",
    ru: "Разработка фронтшопов, онбординг мерчантов и платёжные решения для цифрового бизнеса по всему миру.",
  },
  "footer.company": { en: "Company", ru: "Компания" },
  "footer.legal": { en: "Legal", ru: "Документы" },
  "footer.privacy": { en: "Privacy Policy", ru: "Политика конфиденциальности" },
  "footer.terms": { en: "Terms of Service", ru: "Условия использования" },
  "footer.copy": { en: "All rights reserved.", ru: "Все права защищены." },
};

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const t = useCallback(
    (key: string) => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang];
    },
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
