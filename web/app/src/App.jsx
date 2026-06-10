import { useEffect, useState } from 'react'
import './App.css'

const APK_DOWNLOAD_PATH = '/app-debug.apk'

function isRunningInAndroidApp() {
  if (typeof window === 'undefined') {
    return false
  }

  const capacitorPlatform = window.Capacitor?.getPlatform?.()
  const hasNativeCapacitor = window.Capacitor?.isNativePlatform?.() === true
  const userAgent = window.navigator.userAgent
  const isAndroidWebView = /Android/i.test(userAgent) && /\bwv\b|Version\/\d+\.\d+/i.test(userAgent)

  return capacitorPlatform === 'android' || hasNativeCapacitor || isAndroidWebView
}

const features = [
  {
    icon: '✨',
    tone: '1',
    title: 'منتخب مخصوص تو',
    text: 'مجموعه‌ای از ویدیوهای دست‌چین در زمینه زیبایی، سبک زندگی، سلامتی و خلاقیت — طراحی‌شده با فکر دختران.',
  },
  {
    icon: '💗',
    tone: '2',
    title: 'هرجا تماشا کن',
    text: 'با کیفیت HD روی موبایل، تبلت یا لپ‌تاپ تماشا کن. ویدیوهای موردعلاقه‌ات همیشه در دسترس‌اند.',
  },
  {
    icon: '⬇️',
    tone: '3',
    title: 'ذخیره آفلاین',
    text: 'ویدیوها رو دانلود کن و برای همیشه نگه دار. عالی برای سفر، راه رفتن یا شب‌های دنج بدون اینترنت.',
  },
  {
    icon: '🎀',
    tone: '4',
    title: 'پلی‌لیست‌های شیک',
    text: 'کتابخانه‌ات رو در پلی‌لیست‌های رویایی مرتب کن — روتین صبحگاهی، یکشنبه‌های مراقبت از خود، راهنمای درخشیدن.',
  },
  {
    icon: '🔒',
    tone: '5',
    title: 'خصوصی و امن',
    text: 'مجموعه‌ات مال خودته. بدون تبلیغ، بدون شلوغی — فقط یک فضای آرام ساخته‌شده برای تو.',
  },
  {
    icon: '🌸',
    tone: '6',
    title: 'ویدیوی تازه هر هفته',
    text: 'هر هفته ویدیوهای جدید اضافه می‌شه تا لیست تماشای تو همیشه هیجان‌انگیز و به‌روز بمونه.',
  },
]

const steps = [
  {
    title: 'مجموعه‌ها رو ببین',
    text: 'دسته‌بندی‌هایی مثل آموزش آرایش، ولاگ، ورزش و ایده‌های خلاقانه رو کشف کن.',
  },
  {
    title: 'علاقه‌مندی‌هات رو انتخاب کن',
    text: 'روی هر ویدیو بزن، پیش‌نمایش ببین و به کتابخانه شخصی‌ات اضافه‌ش کن.',
  },
  {
    title: 'تماشا یا دانلود',
    text: 'همین الان آنلاین تماشا کن یا روی دستگاهت ذخیره کن تا بعداً آفلاین ببینی.',
  },
  {
    title: 'از فضای خودت لذت ببر',
    text: 'در محیطی زیبا و بدون تبلیغ که مخصوص دختران طراحی شده، آرامش پیدا کن.',
  },
]

const videos = [
  { title: 'روتین درخشندگی صبحگاهی', category: 'زیبایی', duration: '۱۲:۳۴', thumb: '1' },
  { title: 'دکور اتاق دنج', category: 'سبک زندگی', duration: '۱۸:۰۲', thumb: '2' },
  { title: 'پیلاتس در خانه', category: 'سلامتی', duration: '۲۴:۱۵', thumb: '3' },
  { title: 'ژورنال‌نویسی برای آرامش', category: 'مراقبت از خود', duration: '۰۹:۴۸', thumb: '4' },
  { title: 'آبرنگ برای مبتدی‌ها', category: 'خلاقیت', duration: '۱۵:۲۲', thumb: '5' },
  { title: 'ولاگ آخر هفته در پاریس', category: 'سفر', duration: '۲۱:۰۷', thumb: '6' },
]

const categories = [
  'همه',
  'زیبایی',
  'سبک زندگی',
  'سلامتی',
  'مراقبت از خود',
  'خلاقیت',
  'سفر',
]

const testimonials = [
  {
    text: 'بالاخره یه اپ ویدیویی که واقعاً حس می‌کنم برای من طراحی شده. نرم، زیبا و خیلی راحت.',
    name: 'سارا م.',
    role: 'سازنده محتوای زیبایی',
    avatar: 'س',
    tone: '1',
  },
  {
    text: 'عاشق ذخیره آموزش‌های موردعلاقه‌ام آفلاینم. پلی‌لیست مراقبت از خودم واقعاً جای شادی منه.',
    name: 'لنا ک.',
    role: 'علاقه‌مند به سلامتی',
    avatar: 'ل',
    tone: '2',
  },
  {
    text: 'بدون تبلیغات تصادفی، بدون شلوغی — فقط ویدیوهای زیبایی که واقعاً دوست دارم ببینم. معتادش شدم.',
    name: 'آریا ت.',
    role: 'بلاگر سبک زندگی',
    avatar: 'آ',
    tone: '3',
  },
]

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function App() {
  const [showApkDownload, setShowApkDownload] = useState(() => !isRunningInAndroidApp())

  useEffect(() => {
    setShowApkDownload(!isRunningInAndroidApp())
  }, [])

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav__brand">
          <div className="nav__logo">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="nav__name">NeginCast</span>
        </div>
        <ul className="nav__links">
          <li><a href="#features">ویژگی‌ها</a></li>
          <li><a href="#how-it-works">نحوه کار</a></li>
          <li><a href="#collection">مجموعه ویدیوها</a></li>
          <li><a href="#stories">نظرات</a></li>
        </ul>
        <button type="button" className="nav__cta">شروع کنید</button>
      </nav>

      <section className="hero">
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            مخصوص دخترانی که عاشق ویدیوهای خوبن
          </div>
          <h1 className="hero__title">
            تماشا کن، ذخیره کن و با هر ویدیو <em>بدرخش</em>
          </h1>
          <p className="hero__subtitle">
            پناهگاه شخصی ویدیویی تو — آموزش آرایش، ولاگ‌های سبک زندگی
            و محتوای سلامتی رو آنلاین ببین یا دانلود کن و برای همیشه نگه دار.
            زیبا، خصوصی و کاملاً مال تو.
          </p>
          <div className="hero__actions">
            <button type="button" className="btn-primary">
              <PlayIcon />
              شروع تماشا
            </button>
            <button type="button" className="btn-secondary">
              <DownloadIcon />
              مشاهده دانلودها
            </button>
            {showApkDownload && (
              <a className="btn-apk" href={APK_DOWNLOAD_PATH} download="NeginCast.apk">
                <DownloadIcon />
                دانلود اپ اندروید
              </a>
            )}
          </div>
          <div className="hero__stats">
            <div>
              <div className="hero__stat-value">۲٬۴۰۰+</div>
              <div className="hero__stat-label">ویدیوی منتخب</div>
            </div>
            <div>
              <div className="hero__stat-value">۱۸</div>
              <div className="hero__stat-label">دسته‌بندی</div>
            </div>
            <div>
              <div className="hero__stat-value">۵۰هزار+</div>
              <div className="hero__stat-label">دختر خوشحال</div>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__floating hero__floating--top">
            <span className="floating-icon floating-icon--pink">🎬</span>
            <span>پخش HD آماده است</span>
          </div>
          <div className="hero__card">
            <div className="hero__video-preview">
              <button type="button" className="play-btn" aria-label="پخش پیش‌نمایش">
                <PlayIcon />
              </button>
            </div>
            <div className="hero__video-meta">
              <span className="hero__video-title">مراسم مراقبت پوست شبانه</span>
              <span className="hero__video-tag">زیبایی</span>
            </div>
          </div>
          <div className="hero__floating hero__floating--bottom">
            <span className="floating-icon floating-icon--lavender">⬇️</span>
            <span>ذخیره آفلاین · ۱۴:۲۰</span>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="section__header">
          <span className="section__eyebrow">چرا NeginCast؟</span>
          <h2 className="section__title">هرچی لازم داری، بدون چیز اضافه</h2>
          <p className="section__desc">
            تجربه‌ای با دقت طراحی‌شده برای تماشا و ذخیره ویدیو —
            ظاهر نرم، امکانات هوشمند، بدون سردرگمی.
          </p>
        </div>
        <div className="features">
          {features.map((f) => (
            <article key={f.title} className="feature-card">
              <div className={`feature-card__icon feature-card__icon--${f.tone}`}>
                {f.icon}
              </div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__text">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="section section--alt">
        <div className="section__header">
          <span className="section__eyebrow">ساده و دل‌نشین</span>
          <h2 className="section__title">نحوه کار</h2>
          <p className="section__desc">
            چهار قدم آسان از مرور تا لذت بردن. بدون تنظیمات پیچیده، بدون دردسر فنی.
          </p>
        </div>
        <div className="steps">
          {steps.map((s) => (
            <div key={s.title} className="step">
              <h3 className="step__title">{s.title}</h3>
              <p className="step__text">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="collection" className="section">
        <div className="section__header">
          <span className="section__eyebrow">مجموعه تو</span>
          <h2 className="section__title">ویدیوهایی که واقعاً دوستشون داری</h2>
          <p className="section__desc">
            کتابخانه دست‌چین ما رو مرور کن. هر ویدیو برای الهام‌بخشیدن، آرامش یا توانمندسازی انتخاب شده.
          </p>
        </div>
        <div className="categories">
          {categories.map((cat, i) => (
            <button
              key={cat}
              type="button"
              className={`category-pill${i === 0 ? ' category-pill--active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="gallery">
          {videos.map((v) => (
            <article key={v.title} className="video-card">
              <div className={`video-card__thumb video-card__thumb--${v.thumb}`}>
                <div className="video-card__play">
                  <PlayIcon />
                </div>
                <span className="video-card__duration">{v.duration}</span>
              </div>
              <div className="video-card__body">
                <h3 className="video-card__title">{v.title}</h3>
                <div className="video-card__meta">
                  <span className="video-card__category">{v.category}</span>
                  <span className="video-card__action">
                    <DownloadIcon />
                    ذخیره
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="stories" className="section section--alt">
        <div className="section__header">
          <span className="section__eyebrow">داستان‌های واقعی</span>
          <h2 className="section__title">محبوب دختران در همه‌جا</h2>
          <p className="section__desc">
            از جامعه‌ای بشنو که NeginCast رو مثل خونه حس می‌کنن.
          </p>
        </div>
        <div className="testimonials">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="testimonial">
              <span className="testimonial__quote">«</span>
              <p className="testimonial__text">{t.text}</p>
              <footer className="testimonial__author">
                <div className={`testimonial__avatar testimonial__avatar--${t.tone}`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="testimonial__name">{t.name}</div>
                  <div className="testimonial__role">{t.role}</div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-banner__content">
          <h2 className="cta-banner__title">آماده‌ای پناهگاه ویدیویی خودت رو بسازی؟</h2>
          <p className="cta-banner__text">
            به هزاران دختری بپیوند که NeginCast رو مقصد اصلی‌شون
            برای تماشا و ذخیره ویدیوهای موردعلاقه‌شون کردن.
          </p>
          <button type="button" className="btn-primary">
            <PlayIcon />
            شروع دوره آزمایشی رایگان
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer__top">
          <div>
            <div className="nav__brand">
              <div className="nav__logo">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="nav__name">NeginCast</span>
            </div>
            <p className="footer__brand-desc">
              یک پلتفرم ویدیویی زیبا مخصوص دختران — تماشا کن، دانلود کن
              و مجموعه ایده‌آل خودت رو بساز.
            </p>
          </div>
          <div className="footer__columns">
            <div className="footer__column">
              <h4>کاوش</h4>
              <ul>
                <li><a href="#features">ویژگی‌ها</a></li>
                <li><a href="#collection">مجموعه ویدیوها</a></li>
                <li><a href="#how-it-works">نحوه کار</a></li>
                <li><a href="#stories">نظرات</a></li>
              </ul>
            </div>
            <div className="footer__column">
              <h4>دسته‌بندی‌ها</h4>
              <ul>
                <li><a href="#collection">زیبایی</a></li>
                <li><a href="#collection">سبک زندگی</a></li>
                <li><a href="#collection">سلامتی</a></li>
                <li><a href="#collection">خلاقیت</a></li>
              </ul>
            </div>
            <div className="footer__column">
              <h4>پشتیبانی</h4>
              <ul>
                <li><a href="#">مرکز راهنما</a></li>
                <li><a href="#">حریم خصوصی</a></li>
                <li><a href="#">قوانین</a></li>
                <li><a href="#">تماس با ما</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© ۱۴۰۵ NeginCast. تمامی حقوق محفوظ است.</span>
          <span className="footer__hearts">ساخته‌شده با عشق برای دختران</span>
        </div>
      </footer>
    </div>
  )
}

export default App
