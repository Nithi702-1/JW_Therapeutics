// Top-level navigation, sourced 1:1 from jwtherapeutics.com/en/.
// External URLs preserved so they still point at the live site.

const BASE = "https://www.jwtherapeutics.com";

export const navItems = [
  {
    label: "Home",
    href: `${BASE}/en/`,
    isHome: true,
  },
  {
    label: "About Us",
    href: `${BASE}/en/about-us/overview/`,
    children: [
      { label: "Overview", href: `${BASE}/en/about-us/overview/` },
      { label: "Vision and Mission", href: `${BASE}/en/about-us/vision-and-mission/` },
      { label: "History", href: `${BASE}/en/about-us/history/` },
      { label: "Contact Us", href: `${BASE}/en/about-us/contact-us/` },
    ],
  },
  {
    label: "R&D and Manufacturing",
    href: `${BASE}/en/r-d-and-manufacturing/pipeline/`,
    children: [
      { label: "Pipeline", href: `${BASE}/en/r-d-and-manufacturing/pipeline/` },
      {
        label: "Getting to Know CAR-T",
        href: `${BASE}/en/r-d-and-manufacturing/getting-to-know-car-t/`,
      },
      { label: "Products", href: `${BASE}/en/r-d-and-manufacturing/products/` },
      {
        label: "Process Development",
        href: `${BASE}/en/r-d-and-manufacturing/process-development/`,
      },
      { label: "Manufacturing", href: `${BASE}/en/r-d-and-manufacturing/manufacturing/` },
    ],
  },
  {
    label: "Media",
    href: `${BASE}/en/media/press-release/`,
    children: [
      { label: "Press Release", href: `${BASE}/en/media/press-release/` },
      { label: "Media Library", href: `${BASE}/en/media/media-library/` },
      { label: "Media Coverage", href: `${BASE}/en/media/media-coverage/` },
    ],
  },
  {
    label: "Investor",
    href: `${BASE}/en/investor/announcement-notices/`,
    children: [
      {
        label: "Announcement & Notices",
        href: `${BASE}/en/investor/announcement-notices/`,
      },
      { label: "Prospectus", href: `${BASE}/en/investor/prospectus/` },
      {
        label: "Corporate Governance",
        href: `${BASE}/en/investor/corporate-governance/`,
      },
      { label: "Financial Reports", href: `${BASE}/en/investor/financial-report/` },
      { label: "IR Contact", href: `${BASE}/en/investor/ir-contact/` },
    ],
  },
  {
    label: "Career",
    href: `${BASE}/en/career/people-and-culture/`,
    children: [
      { label: "People and Culture", href: `${BASE}/en/career/people-and-culture/` },
      { label: "Join Us", href: `${BASE}/en/career/join-us/` },
    ],
  },
];

export const footerLinks = [
  { label: "Forward-Looking Statements", href: `${BASE}/en/forward-looking-statements/` },
  { label: "Disclaimer", href: `${BASE}/en/disclaimer/` },
  {
    label: "User Service and Privacy Terms",
    href: `${BASE}/en/user-service-and-privacy-terms/`,
  },
];
