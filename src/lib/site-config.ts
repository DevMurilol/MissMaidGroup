export const siteConfig = {
  name: "Miss Maid Group",
  url: "https://www.missmaidgroup.com.au",
  description:
    "Reliable, insured, and detail-oriented house cleaners delivering hotel-level quality to homes across the Gold Coast. Police-checked cleaners, no contracts, satisfaction guaranteed.",
  keywords: [
    "house cleaning Gold Coast",
    "Gold Coast cleaners",
    "professional cleaning Gold Coast",
    "domestic cleaning Gold Coast",
    "deep cleaning Gold Coast",
    "regular cleaning Gold Coast",
    "cleaning services Gold Coast",
    "best cleaners Gold Coast",
    "home cleaning Gold Coast",
    "cleaning company Gold Coast",
    "maid service Gold Coast",
  ],
  phone: "0430 588 920",
  phoneHref: "tel:+61430588920",
  email: "hello@missmaidgroup.com.au",
} as const;

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#quote" },
] as const;

export const trustBadges = [
  "Police-checked cleaners",
  "High standards of cleaning",
] as const;

export const benefits = [
  {
    title: "Insured & background-checked",
    description:
      "Every cleaner is police-checked, fully insured, and personally vetted before they set foot in your home.",
    icon: "ShieldCheck",
  },
  {
    title: "Transparent pricing",
    description:
      "No hidden fees or surprise call-outs. Your quote is calculated up front and confirmed before we book.",
    icon: "ReceiptText",
  },
  {
    title: "All equipment included",
    description:
      "Our cleaners arrive fully equipped with professional products and tools, so you can simply enjoy a clean and comfortable home.",
    icon: "BrushCleaning",
  },
  {
    title: "Flexible scheduling",
    description:
      "Weekly, fortnightly, monthly or one-off, book a time that fits your life, not the other way around.",
    icon: "CalendarClock",
  },
  {
    title: "Professional cleaning standards  ",
    description:
      "We follow a detailed cleaning checklist to ensure every visit meets consistent, high‑quality standards",
    icon: "BadgeCheck",
  },
  {
    title: "Local Gold Coast team",
    description:
      "A dedicated local team who knows the Gold Coast, not a national call centre passing you around.",
    icon: "MapPin",
  },
] as const;

export type ServiceId = "regular" | "deep" | "move" | "airbnb";

export type ServiceView = {
  id: ServiceId;
  name: string;
  description: string;
  points: string[];
  icon: string;
  featured?: boolean;
  hidden?: boolean;
};

export type AddOnView = { id: string; name: string; price: number };

export const services: ServiceView[] = [
  {
    id: "deep",
    name: "Deep Cleaning",
    description:
      "A top-to-bottom reset that reaches the corners regular cleans skip, ideal for a seasonal refresh.",
    points: [
      "Skirting boards & window sills",
      "Inside cupboards & appliances",
      "Grout, tiles & tough build-up",
    ],
    icon: "Sparkles",
  },
  {
    id: "regular",
    name: "Regular House Cleaning",
    description:
      "Ongoing upkeep that keeps every room fresh, dusted, and genuinely spotless week after week.",
    points: [
      "Kitchen & bathrooms sanitised",
      "Dusting, vacuuming & mopping",
      "Beds made, surfaces cleared",
    ],
    icon: "Home",
    featured: true,
  },
  {
    id: "move",
    name: "Bond Cleaning",
    description:
      "Bond-back ready cleaning for tenants, landlords, and homeowners changing addresses.",
    points: [
      "Full interior deep clean",
      "Oven, fridge & cupboards",
      "Agent checklist compliant",
    ],
    icon: "PackageCheck",
  },
  {
    id: "airbnb",
    name: "Airbnb Cleaning",
    description:
      "Fast, reliable turnaround cleaning between guests, styled and ready for the next five-star review.",
    points: [
      "Same-day turnaround",
      "Linen reset & restocking",
      "Photo-ready presentation",
    ],
    icon: "KeyRound",
    hidden: true,
  },
];

export const addOns = [
  { id: "oven", name: "Oven", price: 35 },
  { id: "fridge", name: "Fridge", price: 30 },
  { id: "windows", name: "Windows (interior)", price: 40 },
  { id: "balcony", name: "Balcony", price: 25 },
  { id: "walls", name: "Walls (spot clean)", price: 30 },
] as const;

export const howItWorks = [
  {
    step: "01",
    title: "Request your quote",
    description:
      "Tell us about your home in under two minutes, no price haggling, just the details we need.",
  },
  {
    step: "02",
    title: "Choose your preferred time",
    description:
      "Pick a day and frequency that suits your routine. We confirm by phone or email within hours.",
  },
  {
    step: "03",
    title: "Enjoy your spotless home",
    description:
      "Our vetted local team arrives on time, fully equipped, and leaves your home hotel-fresh.",
  },
] as const;

export const testimonials = [
  {
    name: "Amelia R.",
    suburb: "Burleigh Heads",
    quote:
      "Honestly the best cleaning service we've used on the Coast. The team is punctual, thorough, and my kitchen has never looked better.",
    rating: 4,
  },
  {
    name: "Josh T.",
    suburb: "Robina",
    quote:
      "Booked a bond cleaning and got our full bond back, no questions asked. Worth every dollar for the peace of mind.",
    rating: 5,
  },
  {
    name: "Priya N.",
    suburb: "Southport",
    quote:
      "Fortnightly cleans have genuinely changed how I feel about coming home. Reliable, friendly, and always on time.",
    rating: 5,
  },
  {
    name: "Michael D.",
    suburb: "Mermaid Beach",
    quote:
      "We run a small Airbnb near the beach and Miss Maid Group turns it around same-day, every time. Guests always comment on how fresh it feels.",
    rating: 5,
  },
  {
    name: "Sarah K.",
    suburb: "Helensvale",
    quote:
      "Deep clean before a family visit and the difference was night and day. Oven and grout came up like new.",
    rating: 5,
  },
  {
    name: "Liam C.",
    suburb: "Coomera",
    quote:
      "No lock-in contracts and transparent pricing sold me. The cleaners are always the same friendly faces too.",
    rating: 5,
  },
] as const;

export const galleryShowcase = {
  label: "Bathroom sink",
  before: "/images/gallery-sink-before.webp",
  after: "/images/gallery-sink-after.webp",
} as const;

export const suburbs = [
  "Southport",
  "Surfers Paradise",
  "Broadbeach",
  "Broadbeach Waters",
  "Main Beach",
  "Labrador",
  "Runaway Bay",
  "Biggera Waters",
  "Helensvale",
  "Hope Island",
  "Arundel",
  "Parkwood",
  "Molendinar",
  "Ashmore",
  "Benowa",
  "Carrara",
  "Merrimac",
  "Robina",
  "Varsity Lakes",
  "Burleigh Heads",
  "Burleigh Waters",
  "Miami",
  "Mermaid Beach",
  "Mermaid Waters",
  "Palm Beach",
  "Currumbin",
  "Tugun",
  "Elanora",
  "Coomera",
  "Upper Coomera",
  "Oxenford",
  "Ormeau",
  "Pimpama",
] as const;

export const faqs = [
  {
    question: "What cleaning products do you use?",
    answer:
      "We bring our own products and equipment as standard. If you have specific allergies or a product preference, just let us know when booking and we'll happily use yours.",
  },
  {
    question: "How do your cleaners access my home?",
    answer:
      "Most clients are home for their first clean, then choose whichever access method suits them, a key safe, door code, or being let in by a neighbour or agent. Every cleaner is police-checked and identifiable.",
  },
  {
    question: "How do I pay for my cleaning?",
    answer:
      "Payment is arranged directly with your cleaner after each service, using either bank transfer or cash",
  },
  {
    question: "Can I cancel or reschedule a booking?",
    answer:
      "Yes, there are no lock-in contracts. You can reschedule or cancel any booking free of charge with at least 24 hours' notice.",
  },
  {
    question: "Do I need to provide any equipment?",
    answer:
      "No, our team arrives fully equipped with everything needed for your clean. All you need to do is unlock the door.",
  },
  {
    question: "Are your cleaners okay with pets?",
    answer:
      "Absolutely, our cleaners are experienced and comfortable working in pet-friendly homes. Just let us know about any pets so we can plan ahead.",
  },
  {
    question: "How long does a clean take?",
    answer:
      "It depends on the size of your home and service type. A regular clean for a 3-bedroom home typically takes 2 to 3 hours, while deep cleans and bond cleanings can take longer.",
  },
] as const;
