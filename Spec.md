MISS MAID GROUP — LANDPAGE SPEC (FINAL)
1. BRANDING & DESIGN SYSTEM
1.1. Logo Analysis → Color Palette
Com base na logo enviada:

Primary Color (Brand Green)
HEX: #4CAF50

RGB: 76, 175, 80

Uso: botões principais, ícones, destaques, headings secundários.

Secondary Color (Deep Green)
HEX: #2E7D32

RGB: 46, 125, 50

Uso: hover states, bordas, elementos de confiança.

Neutral Palette
White: #FFFFFF

Light Gray: #F5F5F5

Medium Gray: #9E9E9E

Dark Gray: #212121

Accent Color (Soft Beige for premium feel)
HEX: #F7F3E9

1.2. Typography
Primary Font: Inter

Secondary Font: Lato

Headings: Inter Bold

Body: Inter Regular

1.3. UI Style
Clean, modern, minimalistic

Rounded corners (8px)

High whitespace

Icons outline style (Heroicons / Lucide)

Buttons com sombra leve e hover animado

2. SEO MASTER STRUCTURE (Gold Coast)
2.1. Primary Keywords
house cleaning Gold Coast

Gold Coast cleaners

professional cleaning Gold Coast

domestic cleaning Gold Coast

deep cleaning Gold Coast

regular cleaning Gold Coast

2.2. Secondary Keywords
cleaning services Gold Coast

best cleaners Gold Coast

home cleaning Gold Coast

cleaning company Gold Coast

maid service Gold Coast

2.3. Local SEO (Suburbs)
A página deve listar todos os suburbs:

Gold Coast Suburbs:  
Southport, Surfers Paradise, Broadbeach, Broadbeach Waters, Main Beach, Labrador, Runaway Bay, Biggera Waters, Helensvale, Hope Island, Arundel, Parkwood, Molendinar, Ashmore, Benowa, Carrara, Merrimac, Robina, Varsity Lakes, Burleigh Heads, Burleigh Waters, Miami, Mermaid Beach, Mermaid Waters, Palm Beach, Currumbin, Tugun, Elanora, Coomera, Upper Coomera, Oxenford, Ormeau, Pimpama.

2.4. SEO Structure (Headings)
H1: Professional House Cleaning Services in Gold Coast

H2: Why Choose Miss Maid Group

H2: Our Cleaning Services

H2: How It Works

H2: Customer Reviews

H2: Service Areas Across Gold Coast

H2: Frequently Asked Questions

H2: Request Your Quote

H3: Regular Cleaning

H3: Deep Cleaning

H3: Move-in/Move-out Cleaning

H3: Add-ons

H3: Contact Form

2.5. Schema Markup (JSON-LD)
LocalBusiness

Service

FAQ

BreadcrumbList

3. LANDPAGE STRUCTURE (FULL)
3.1. Header
Logo (left)

Navigation: Home, Services, How It Works, Reviews, Contact

CTA Button: Get a Quote

Phone: 0430 588 920 (click-to-call)

3.2. Hero Section
Title:  
Professional House Cleaning Services in Gold Coast

Subtitle:  
Reliable, insured, and detail-oriented cleaners delivering hotel-level quality to your home.

Micro-trust badges:

Police-checked cleaners

No contracts

Satisfaction guaranteed

CTA:

Get My Quote (scroll to simulator)

Call Us: 0430 588 920

Image:  
Clean modern home + subtle green accents.

3.3. Benefits Section
Insured & background-checked cleaners

Transparent pricing

All equipment included

Flexible scheduling

24h satisfaction guarantee

Local Gold Coast team

3.4. Services Section
Regular House Cleaning
Deep Cleaning
Move-in / Move-out Cleaning
Add-ons:
Oven

Fridge

Windows

Balcony

Walls

Skirting boards

Admin Toggle:

Airbnb Cleaning (hidden by default)

When toggled ON → appears automatically in Services section

3.5. How It Works
Request your quote

Choose your preferred time

Enjoy your spotless home

3.6. Reviews Section
3–6 testimonials com nome + suburb.

3.7. Before & After Gallery
Grid com 4–6 imagens.

3.8. Service Areas (SEO local)
Listar todos os suburbs mencionados acima.

3.9. FAQ
8 perguntas essenciais sobre:

products

access

payments

satisfaction guarantee

cancellations

equipment

pets

duration

3.10. Final CTA
Ready for a cleaner, fresher home?  
Button: Request Your Quote

3.11. Footer
Logo

Quick links

Contact

Email: hello@missmaidgroup.com.au

Phone: 0430 588 920

Terms & Privacy

4. PRICE SIMULATOR (LEAD-LOCKED)
4.1. Fields
Cleaning type (Regular / Deep / Move-in/out)

Bedrooms (1–6)

Bathrooms (1–4)

Frequency (One-time / Weekly / Fortnightly / Monthly)

Add-ons (checkboxes)

Name

Email

Phone

Suburb

4.2. Behavior
NO price shown on screen

On submit →

Save lead

Send email via Resend API

Show success message:
“Thanks! Your quote is on the way to your inbox.”

4.3. Email Content (Resend)
Lead details

Calculated price

Internal notes

Timestamp

5. ADMIN PANEL SPEC
5.1. Access
/admin (protected route)

Login with email + password

5.2. Features
Services Manager
Toggle ON/OFF for each service

Add new service

Edit service description

Add icon

Add price rules (for simulator)

Add-ons Manager
Add/remove add-ons

Set price multipliers

Quote Rules
Base price per bedroom

Base price per bathroom

Extra multipliers for deep cleaning

Frequency discounts

Leads Dashboard
List of all leads

Export CSV

View details

Mark as contacted

6. TECHNICAL ARCHITECTURE (NEXT.JS)
6.1. Framework
Next.js 14 (App Router)

TypeScript

TailwindCSS

Server Actions

Resend API

Prisma + PostgreSQL (Vercel Postgres)

6.2. Components
<Header />

<Hero />

<Benefits />

<Services />

<HowItWorks />

<Reviews />

<Gallery />

<ServiceAreas />

<FAQ />

<PriceSimulator />

<Footer />

<AdminPanel />

6.3. API Routes
POST /api/quote → envia email via Resend

POST /api/admin/services

POST /api/admin/addons

POST /api/admin/rules

7. MICROCOPY (ENGLISH)
Buttons
Get My Quote

Request Quote

Contact Us

Book Now

Call Now

Form Success
Your quote is on the way!

Thanks for reaching out — we’ll contact you shortly.

Trust Badges
Police-checked cleaners

Fully insured

Satisfaction guaranteed

8. PERFORMANCE & UX
Lighthouse score 95+

Lazy loading images

WebP format

Mobile-first

Sticky CTA on mobile

Smooth scroll

Form validation

Anti-spam honeypot