/**
 * Guides Data Layer
 * All guide articles stored as structured data for SEO-friendly static generation.
 * Content is in both English and Bangla.
 */

export interface Guide {
  slug: string;
  lang: 'en' | 'bn';
  title: string;
  description: string;
  publishedAt: string;
  /** Defaults to publishedAt when a guide hasn't been revised since. */
  updatedAt?: string;
  /** Byline shown on the guide page and used in Article JSON-LD (E-E-A-T authorship signal). */
  author: string;
  category: 'how-to' | 'tips' | 'culture';
  readingTimeMin: number;
  /** HTML string for article body */
  content: string;
  /**
   * Optional ordered steps for genuinely sequential how-to content, rendered as
   * HowTo JSON-LD. Only set this when the guide's content is an actual step-by-step
   * procedure (not a general list of tips) — don't force it onto every guide.
   */
  howToSteps?: { name: string; text: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'how-to-write-islamic-marriage-bio-data',
    lang: 'en',
    title: 'How to Write the Perfect Islamic Marriage Bio Data',
    description:
      'A step-by-step guide to creating a professional, complete, and Islamic-format marriage bio data that makes a great first impression.',
    publishedAt: '2025-12-01',
    author: 'Mehadi',
    category: 'how-to',
    readingTimeMin: 5,
    howToSteps: [
      { name: 'Keep it honest', text: 'Exaggerated profiles lead to disappointment — describe yourself accurately.' },
      { name: 'Include a recent, modest photo', text: 'Add a clear, recent photo that reflects how you actually look today.' },
      { name: 'Proofread for spelling errors', text: 'Spelling mistakes leave a poor impression — review the whole document carefully before sharing.' },
      { name: 'Share a PDF or printed copy', text: 'Share a proper PDF or printed copy rather than a screenshot from a mobile screen.' },
      { name: 'Update it every 6 months', text: 'Revisit and update your bio data periodically as your circumstances change.' },
    ],
    content: `
<h2>What Is a Marriage Bio Data?</h2>
<p>A marriage bio data (also called a marriage CV or rishta profile) is a structured document summarising a person's personal, educational, religious, and family background. It is widely used in South Asian and Muslim communities to help families evaluate potential marriage matches.</p>

<h2>Why Presentation Matters</h2>
<p>First impressions count. A neatly formatted, complete bio data signals seriousness and respect. An unclear or missing-field document often gets filtered out before a family even reads the content.</p>

<h2>Essential Sections to Include</h2>
<ul>
  <li><strong>Personal Information</strong> — Full name, date of birth, height, complexion, blood group, nationality.</li>
  <li><strong>Religious Information</strong> — Sect, prayer practice, Quran recitation, Islamic education, beard / hijab observance.</li>
  <li><strong>Educational Background</strong> — Highest qualification, institution, field of study.</li>
  <li><strong>Professional Information</strong> — Occupation, employer, income range.</li>
  <li><strong>Family Information</strong> — Father and mother's name and occupation, number of siblings, economic status.</li>
  <li><strong>Contact Information</strong> — Email, phone number, permanent address.</li>
  <li><strong>Partner Expectations</strong> — Age range, education, occupation, and religious expectations.</li>
</ul>

<h2>Tips for a Great Bio Data</h2>
<ol>
  <li>Keep it honest — exaggerated profiles lead to disappointment.</li>
  <li>Include a recent, modest photo.</li>
  <li>Proofread for spelling errors; they leave a poor impression.</li>
  <li>Share a PDF or printed copy — not a screenshot from a mobile screen.</li>
  <li>Update it every 6 months as circumstances change.</li>
</ol>

<h2>Using Marriage Bio Data Maker</h2>
<p>Our free tool lets you fill in all sections using a guided form, see a live preview, choose from 8 templates, and download a professional PDF in minutes — no design skills needed.</p>
    `.trim(),
  },

  {
    slug: 'best-marriage-bio-data-templates',
    lang: 'en',
    title: '8 Best Marriage Bio Data Templates and How to Choose One',
    description:
      'Compare all 8 templates available in Marriage Bio Data Maker and learn which style suits your background, tone, and family expectations.',
    publishedAt: '2025-12-15',
    author: 'Mehadi',
    category: 'tips',
    readingTimeMin: 4,
    content: `
<h2>Why Template Choice Matters</h2>
<p>Your template sets the visual tone before anyone reads a word. A traditional family may respond better to a classic ornamental design, while a younger, urban professional might prefer a clean modern layout.</p>

<h2>Template Overview</h2>
<ul>
  <li><strong>Modern</strong> — Clean lines, emerald accent, perfect for urban professionals.</li>
  <li><strong>Traditional</strong> — Ornamental borders, warm tones, ideal for conservative families.</li>
  <li><strong>Elegant</strong> — Blue geometric accents, suitable for well-educated applicants.</li>
  <li><strong>Minimal</strong> — Distraction-free, lets content speak for itself.</li>
  <li><strong>Gradient</strong> — Vibrant cyan-to-blue gradient, youthful and expressive.</li>
  <li><strong>Card</strong> — Structured block layout, easy to scan quickly.</li>
  <li><strong>Formal</strong> — Official, government-document style for formal submissions.</li>
  <li><strong>Heritage</strong> — Teal and earth tones that celebrate South Asian culture.</li>
</ul>

<h2>How to Choose</h2>
<ol>
  <li>Consider your audience — the family receiving the bio data.</li>
  <li>Match the template tone to your personality and background.</li>
  <li>Preview in both English and Bangla before exporting.</li>
  <li>When in doubt, Traditional or Modern are universally well-received.</li>
</ol>
    `.trim(),
  },

  {
    slug: 'bangla-biye-bio-data-likhte-kore',
    lang: 'bn',
    title: 'বিয়ের বায়ো ডেটা কীভাবে লিখবেন — সম্পূর্ণ গাইড',
    description:
      'ইসলামিক বিয়ের জন্য একটি পেশাদার ও সম্পূর্ণ বায়ো ডেটা তৈরি করার ধাপে ধাপে নির্দেশিকা।',
    publishedAt: '2025-12-20',
    author: 'Mehadi',
    category: 'how-to',
    readingTimeMin: 5,
    content: `
<h2>বায়ো ডেটা কী?</h2>
<p>বিয়ের বায়ো ডেটা (ম্যারেজ CV বা রিশতা প্রোফাইল নামেও পরিচিত) হলো একটি কাঠামোবদ্ধ নথি যাতে একজন ব্যক্তির ব্যক্তিগত, শিক্ষাগত, ধর্মীয় এবং পারিবারিক পরিচয় সংক্ষেপে উপস্থাপন করা হয়। মুসলিম পরিবারগুলোতে বিবাহের পাত্র-পাত্রী নির্বাচনে এটি ব্যাপকভাবে ব্যবহৃত হয়।</p>

<h2>কী কী তথ্য থাকা উচিত</h2>
<ul>
  <li><strong>ব্যক্তিগত তথ্য</strong> — পূর্ণ নাম, জন্ম তারিখ, উচ্চতা, গায়ের রং, রক্তের গ্রুপ, জাতীয়তা।</li>
  <li><strong>ধর্মীয় তথ্য</strong> — মাযহাব, নামাজ, কুরআন তিলাওয়াত, ইসলামিক শিক্ষা, দাড়ি / হিজাব।</li>
  <li><strong>শিক্ষাগত যোগ্যতা</strong> — সর্বোচ্চ ডিগ্রি, প্রতিষ্ঠান, বিষয়।</li>
  <li><strong>পেশাগত তথ্য</strong> — পেশা, প্রতিষ্ঠান, আয়ের পরিসর।</li>
  <li><strong>পারিবারিক তথ্য</strong> — বাবা-মায়ের নাম ও পেশা, ভাই-বোনের সংখ্যা, আর্থিক অবস্থা।</li>
  <li><strong>যোগাযোগের তথ্য</strong> — ইমেইল, ফোন নম্বর, স্থায়ী ঠিকানা।</li>
  <li><strong>প্রত্যাশা</strong> — বয়স, শিক্ষা, পেশা ও ধর্মীয় প্রত্যাশা।</li>
</ul>

<h2>ভালো বায়ো ডেটা লেখার টিপস</h2>
<ol>
  <li>সৎ থাকুন — অতিরঞ্জিত তথ্য পরে হতাশার কারণ হয়।</li>
  <li>সাম্প্রতিক ও শালীন একটি ছবি যুক্ত করুন।</li>
  <li>বানান ভুল যেন না থাকে — এটি খারাপ ছাপ ফেলে।</li>
  <li>মোবাইল স্ক্রিনশটের বদলে PDF বা প্রিন্ট শেয়ার করুন।</li>
  <li>প্রতি ৬ মাসে আপডেট করুন।</li>
</ol>

<h2>Marriage Bio Data Maker ব্যবহার করুন</h2>
<p>আমাদের বিনামূল্যের টুলটি ব্যবহার করে মাত্র কয়েক মিনিটে ৮টি টেমপ্লেটের মধ্যে থেকে বেছে নিয়ে পেশাদার PDF ডাউনলোড করুন — কোনো ডিজাইন দক্ষতা ছাড়াই।</p>
    `.trim(),
  },

  {
    slug: 'islamic-marriage-process-guide',
    lang: 'en',
    title: 'The Islamic Marriage Process: From Bio Data to Nikah',
    description:
      'Understand the full Islamic marriage journey — from preparing your bio data and finding a match to the Islamic proposal and nikah ceremony.',
    publishedAt: '2026-01-10',
    author: 'Mehadi',
    category: 'culture',
    readingTimeMin: 6,
    content: `
<h2>Step 1: Prepare Your Bio Data</h2>
<p>A well-prepared bio data signals readiness and seriousness. It should be honest, complete, and formatted professionally. Include a recent photo and ensure all contact information is accurate.</p>

<h2>Step 2: Share Through Trusted Channels</h2>
<p>Share your bio data through family, community networks, mosque contacts, or trusted matrimonial platforms. Always vet the channel before sharing personal information.</p>

<h2>Step 3: Initial Screening</h2>
<p>Families review bio data and shortlist based on compatibility criteria — religion, education, family background, and geographic proximity. This is why completeness matters.</p>

<h2>Step 4: Meeting and Istikhara</h2>
<p>In Islamic tradition, both families meet (with proper modesty) to exchange further details. Many families perform Istikhara (a prayer for guidance) before finalising a decision.</p>

<h2>Step 5: The Proposal (Khitbah)</h2>
<p>Once both families agree, a formal proposal is made. This is not binding — either party may withdraw respectfully before the nikah.</p>

<h2>Step 6: Nikah</h2>
<p>The nikah is a simple, binding Islamic contract. It requires a wali (guardian) for the bride, two witnesses, an agreed mahr (dower), and the ijab-qabul (offer and acceptance).</p>

<h2>Keeping It Halal</h2>
<p>Islam guides every step of the marriage process. Avoid prolonged private communication before nikah, maintain modesty during meetings, and involve family throughout the process.</p>
    `.trim(),
  },
];

/**
 * Get all guides (optionally filtered by language).
 */
export function getAllGuides(lang?: 'en' | 'bn'): Guide[] {
  return lang ? GUIDES.filter((g) => g.lang === lang) : GUIDES;
}

/**
 * Get a single guide by slug.
 */
export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/**
 * Get all slugs (for generateStaticParams).
 */
export function getAllGuideSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
}
