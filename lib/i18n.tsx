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
    en: "Routevia builds frontshops, onboarding flows, and payment infrastructure for digital goods, eSIM, and online education. We help merchants get approved and start processing worldwide.",
    ru: "Routevia создаёт фронтшопы, онбординг-процессы и платёжную инфраструктуру для цифровых товаров, eSIM и онлайн-образования. Мы помогаем мерчантам пройти одобрение и начать процессинг по всему миру.",
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
  "why.tag": { en: "WHY ROUTEVIA", ru: "ПОЧЕМУ ROUTEVIA" },
  "why.title": { en: "Your strategic advantage", ru: "Ваше стратегическое преимущество" },
  "why.1.title": { en: "Frontshop expertise", ru: "Экспертиза фронтшопов" },
  "why.1.desc": {
    en: "We design frontshops around acquirer requirements, ensuring first-pass compliance.",
    ru: "Мы проектируем фронтшопы под требования эквайеров. За счёт этого они проходят комплаенс с первого раза.",
  },
  "why.2.title": { en: "Speed as a system", ru: "Скорость как система" },
  "why.2.desc": {
    en: "Frontshop and onboarding are built as one process, allowing launch in days, not weeks.",
    ru: "Фронтшоп и онбординг выстроены как единый процесс. Это позволяет запускаться за дни, а не недели.",
  },
  "why.3.title": { en: "Established connections", ru: "Рабочие подключения" },
  "why.3.desc": {
    en: "Direct relationships with PSPs and acquirers across EU, UK, and other regions.",
    ru: "Прямые связи с PSP и эквайерами в EU, UK и других юрисдикциях — без поиска с нуля.",
  },
  "why.4.title": { en: "Controlled compliance", ru: "Контролируемый комплаенс" },
  "why.4.desc": {
    en: "Everything is built to meet requirements from the start — no rework, fewer rejections.",
    ru: "Все решения изначально соответствуют требованиям. Без переделок, без лишних отказов.",
  },

  // CTA
  "cta.title": { en: "Ready to Start Processing?", ru: "Готовы начать процессинг?" },
  "cta.desc": {
    en: "Let's build your frontshop, handle the onboarding, and get you processing payments globally.",
    ru: "Построим фронтшоп, проведём онбординг и запустим приём платежей по всему миру.",
  },
  "cta.button": { en: "Get Started", ru: "Начать" },

  // About page
  "about.tag": { en: "", ru: "" },
  "about.title1": { en: "About", ru: "О" },
  "about.title2": { en: "Routevia", ru: "Routevia" },
  "about.desc": {
    en: "Routevia is a system for bringing merchants into processing. We unify frontshop development, onboarding, and payment infrastructure into a single controlled process.",
    ru: "Routevia — это система запуска мерчантов в процессинг. Мы объединяем разработку фронтшопов, онбординг и подключение платежной инфраструктуры в единый управляемый процесс.",
  },
  "about.mission.title": { en: "Our Mission", ru: "Наша миссия" },
  "about.mission.desc": {
    en: "Make merchant onboarding into processing simple and manageable. We handle frontshop, onboarding, and payment setup as one process.",
    ru: "Делать запуск мерчантов в процессинг понятным и управляемым. Мы закрываем фронтшоп, онбординг и подключение платежей в одном процессе.",
  },
  "about.vision.title": { en: "Our Vision", ru: "Наше видение" },
  "about.vision.desc": {
    en: "Make entering processing a standard and predictable operation without unnecessary complexity.",
    ru: "Сделать запуск в процессинг стандартной и предсказуемой операцией без лишней сложности.",
  },
  "about.values.title": { en: "Our Values", ru: "Наши ценности" },
  "about.values.1.title": { en: "Speed by design", ru: "Скорость как система" },
  "about.values.1.desc": {
    en: "Frontshop, onboarding, and application flow are built as one system. This reduces launch time without sacrificing quality.",
    ru: "Фронтшоп, онбординг и подача заявок выстроены как единый процесс. За счёт этого мы сокращаем время запуска без потери качества.",
  },
  "about.values.2.title": { en: "Controlled compliance", ru: "Контролируемый комплаенс" },
  "about.values.2.desc": {
    en: "We design everything with acquirers and PSP requirements in mind. This lowers rejection risk and speeds up onboarding.",
    ru: "Мы изначально проектируем решения под требования эквайеров и PSP. Это снижает риски отказов и ускоряет прохождение онбординга.",
  },
  "about.values.3.title": { en: "Outcome-focused", ru: "Работа на результат" },
  "about.values.3.desc": {
    en: "We don't just launch — we get you into live processing. Our model is aligned with your results.",
    ru: "Мы не просто запускаем, а доводим до работающего процессинга. Модель выстроена так, чтобы мы были заинтересованы в вашем результате.",
  },

  // How it works
  "process.title": { en: "How it works", ru: "Как проходит запуск" },
  "process.1.step": { en: "Setup", ru: "Подготовка" },
  "process.1.desc": {
    en: "We analyze your case and align requirements with PSPs and jurisdictions.",
    ru: "Анализируем ваш кейс, подбираем юрисдикцию и требования под PSP.",
  },
  "process.2.step": { en: "Frontshop", ru: "Фронтшоп" },
  "process.2.desc": {
    en: "We build a compliant frontshop tailored for approval.",
    ru: "Разрабатываем фронтшоп, адаптированный под комплаенс и требования эквайеров.",
  },
  "process.3.step": { en: "Onboarding", ru: "Онбординг" },
  "process.3.desc": {
    en: "We prepare documents, submit applications, and manage the process.",
    ru: "Готовим документы и подаём заявки. Сопровождаем процесс до решения.",
  },
  "process.4.step": { en: "Go live", ru: "Запуск" },
  "process.4.desc": {
    en: "We connect payments and bring you into live processing.",
    ru: "Подключаем платежи и доводим до работающего процессинга.",
  },
  "about.cta.title": { en: "Want to Work With Us?", ru: "Хотите работать с нами?" },
  "about.cta.desc": {
    en: "Whether you need a frontshop, merchant onboarding, or a complete payment setup — we're ready to help.",
    ru: "Нужен фронтшоп, онбординг мерчанта или полная настройка платежей — мы готовы помочь.",
  },

  // Services page
  "srvpage.tag": { en: "OUR SERVICES", ru: "НАШИ УСЛУГИ" },
  "srvpage.title1": { en: "End-to-end merchant", ru: "Полный цикл запуска" },
  "srvpage.title2": { en: "launch", ru: "мерчанта" },
  "srvpage.desc": {
    en: "Frontshop, onboarding, and payment setup — handled as one controlled process.",
    ru: "Фронтшоп, онбординг и подключение платежей — как один управляемый процесс.",
  },
  "srvpage.s1.title": { en: "Frontshop infrastructure", ru: "Фронтшоп-инфраструктура" },
  "srvpage.s1.desc": {
    en: "Frontshops designed for compliance and high approval rates.",
    ru: "Фронтшопы, спроектированные под требования эквайеров и высокий процент одобрений.",
  },
  "srvpage.s1.f": {
    en: "Compliance-ready structure|Product and storefront logic|Legal pages|Performance and stability|Mobile optimization",
    ru: "Структура под комплаенс|Логика продукта и витрины|Юридические страницы|Скорость и стабильность|Адаптация под мобильные устройства",
  },
  "srvpage.s2.title": { en: "Merchant onboarding", ru: "Онбординг мерчантов" },
  "srvpage.s2.desc": {
    en: "Preparation and management through PSP and acquirer approval.",
    ru: "Подготовка и сопровождение до одобрения со стороны PSP и эквайеров.",
  },
  "srvpage.s2.f": {
    en: "Document preparation|Application submission|KYC / KYB coordination|Process management|Multi-PSP strategy",
    ru: "Подготовка документов|Подача заявок|KYC / KYB координация|Управление процессом|Multi-PSP стратегия",
  },
  "srvpage.s3.title": { en: "Payment integration", ru: "Платёжная интеграция" },
  "srvpage.s3.desc": {
    en: "Connecting and configuring payment infrastructure.",
    ru: "Подключение и настройка платёжной инфраструктуры.",
  },
  "srvpage.s3.f": {
    en: "PSP integration|Routing setup|Multi-currency support|Transaction flow|Basic fraud logic",
    ru: "Подключение PSP|Настройка маршрутизации|Мультивалютность|Обработка транзакций|Базовая антифрод-логика",
  },
  "srvpage.s4.title": { en: "Compliance & risk", ru: "Комплаенс и риски" },
  "srvpage.s4.desc": {
    en: "Ensuring alignment and reducing rejection risk.",
    ru: "Контроль соответствия и снижение риска отказов.",
  },
  "srvpage.s4.f": {
    en: "Project structure review|PSP requirement alignment|Risk assessment|Pre-submission adjustments|Review support",
    ru: "Проверка структуры проекта|Подготовка под требования PSP|Анализ рисков|Корректировки перед подачей|Поддержка при ревью",
  },
  "srvpage.s5.title": { en: "Routing & scaling", ru: "Routing и масштабирование" },
  "srvpage.s5.desc": {
    en: "Optimizing payment routing and scaling infrastructure.",
    ru: "Настройка и оптимизация маршрутизации платежей под рост и нагрузку.",
  },
  "srvpage.s5.f": {
    en: "Multi-PSP routing|Traffic balancing|Approval rate optimization|Load scaling|Geo and currency setup",
    ru: "Multi-PSP маршрутизация|Балансировка трафика|Оптимизация approval rate|Масштабирование нагрузки|География и валюты",
  },
  "srvpage.s6.title": { en: "Support & growth", ru: "Поддержка и развитие" },
  "srvpage.s6.desc": {
    en: "Ongoing support and development after launch.",
    ru: "Сопровождение после запуска и развитие платёжной инфраструктуры.",
  },
  "srvpage.s6.f": {
    en: "Performance monitoring|KPI optimization|New PSP connections|Frontshop updates|Compliance adjustments",
    ru: "Мониторинг работы|Оптимизация показателей|Подключение новых PSP|Обновление фронтшопа|Реакция на изменения комплаенса",
  },

  // Pricing
  "pricing.tag": { en: "ENGAGEMENT MODELS", ru: "МОДЕЛИ СОТРУДНИЧЕСТВА" },
  "pricing.title": { en: "Flexible Pricing", ru: "Гибкое ценообразование" },
  "pricing.desc": {
    en: "Every business is different. We scope the right engagement and terms together — no rigid price tags.",
    ru: "Каждый бизнес уникален. Мы подбираем модель сотрудничества и условия индивидуально — без фиксированных ценников.",
  },
  "pricing.popular": { en: "Most popular", ru: "Популярный" },
  "pricing.1.tag": { en: "FRONTSHOP PACKAGE", ru: "ПАКЕТ «ФРОНТШОП»" },
  "pricing.1.title": { en: "Launch-Ready", ru: "Готов к запуску" },
  "pricing.1.desc": { en: "Everything you need to get acquirer-approved and go live — fast.", ru: "Всё необходимое для одобрения эквайером и быстрого запуска." },
  "pricing.1.f1": { en: "Complete frontshop setup", ru: "Полная настройка фронтшопа" },
  "pricing.1.f2": { en: "Onboarding application package", ru: "Пакет документов для онбординга" },
  "pricing.1.f3": { en: "Acquirer submission-ready docs", ru: "Документы для подачи эквайеру" },
  "pricing.1.f4": { en: "One-time delivery", ru: "Разовая поставка" },
  "pricing.1.cta": { en: "Get a quote →", ru: "Получить предложение →" },
  "pricing.2.tag": { en: "FULL ONBOARDING", ru: "ПОЛНЫЙ ОНБОРДИНГ" },
  "pricing.2.title": { en: "Ongoing Partner", ru: "Постоянный партнёр" },
  "pricing.2.desc": { en: "Hands-on support from onboarding through compliance and beyond.", ru: "Практическая поддержка от онбординга через комплаенс и далее." },
  "pricing.2.f1": { en: "Onboarding management", ru: "Управление онбордингом" },
  "pricing.2.f2": { en: "Compliance support", ru: "Комплаенс-поддержка" },
  "pricing.2.f3": { en: "Merchant account maintenance", ru: "Обслуживание мерчант-аккаунтов" },
  "pricing.2.f4": { en: "Monthly retainer model", ru: "Ежемесячная модель сотрудничества" },
  "pricing.2.cta": { en: "Talk to us →", ru: "Связаться →" },
  "pricing.3.tag": { en: "REVENUE SHARE", ru: "REVENUE SHARE" },
  "pricing.3.title": { en: "Aligned Growth", ru: "Совместный рост" },
  "pricing.3.desc": { en: "We invest in your success. Costs scale with results, not upfront.", ru: "Мы инвестируем в ваш успех. Расходы масштабируются с результатами, а не авансом." },
  "pricing.3.f1": { en: "No large upfront payment", ru: "Без крупных авансовых платежей" },
  "pricing.3.f2": { en: "Performance-aligned terms", ru: "Условия, привязанные к результату" },
  "pricing.3.f3": { en: "Shared stake in outcomes", ru: "Общая заинтересованность в результатах" },
  "pricing.3.f4": { en: "Flexible for early-stage", ru: "Гибкость для стартапов" },
  "pricing.3.cta": { en: "Get a quote →", ru: "Получить предложение →" },
  "pricing.footer": {
    en: "Not sure which fits? Let's talk — we'll find the right model for your volume, risk profile, and timeline.",
    ru: "Не уверены, что подходит? Давайте обсудим — мы подберём оптимальную модель для вашего объёма, риск-профиля и сроков.",
  },
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
