import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Collection from "../models/Collection.js";

// ── Unsplash fashion image pool ───────────────────────────────────────────────
const IMGS = [
  "photo-1515886657613-9f3515b0c78f",
  "photo-1469334031218-e382a71b716b",
  "photo-1496747611176-843222e1e57c",
  "photo-1485968579580-b6d095142e6e",
  "photo-1525507119028-ed4c629a60a3",
  "photo-1552902865-b72c031ac5ea",
  "photo-1509631179647-0177331693ae",
  "photo-1551803091-e20673f15770",
  "photo-1554412933-514a83d2f3c8",
  "photo-1617137968427-85924c800a22",
  "photo-1585487000160-6ebcfceb0d03",
  "photo-1616627988047-1f1a28aa25a9",
  "photo-1617137984095-74e4e5e3613f",
  "photo-1602810318383-e386cc2a3ccf",
  "photo-1616486338812-3dadae4b4ace",
  "photo-1539109136881-3be0616acf4b",
  "photo-1558618666-fcd25c85cd64",
  "photo-1512436991641-6745cdb1723f",
  "photo-1434389677669-e08b4cac3105",
  "photo-1483985988355-763728e1935b",
];

let imgIdx = 0;
const img  = () => `https://images.unsplash.com/${IMGS[imgIdx++ % IMGS.length]}?auto=format&fit=crop&w=600&q=80`;
const img2 = () => `https://images.unsplash.com/${IMGS[imgIdx++ % IMGS.length]}?auto=format&fit=crop&w=600&q=80`;
const pid  = (i) => `kamari/seed/img-${i}`;

const slugify = (s, n) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${n}`;

// ── Collections ───────────────────────────────────────────────────────────────
const COLLECTIONS = [
  { name: "T-Shirts & Tops",   subtitle: "Everyday casual tops",         description: "Comfortable t-shirts, tank tops and casual tops for everyday wear.", displayOrder: 1, imgId: "photo-1554412933-514a83d2f3c8" },
  { name: "Shirts & Blouses",  subtitle: "Shirts for every occasion",    description: "Formal shirts, casual button-downs and blouses.",                    displayOrder: 2, imgId: "photo-1525507119028-ed4c629a60a3" },
  { name: "Frocks & Dresses",  subtitle: "Frocks for all occasions",     description: "Casual frocks, midi dresses and summer dresses.",                    displayOrder: 3, imgId: "photo-1515886657613-9f3515b0c78f" },
  { name: "Trousers & Pants",  subtitle: "Smart and casual bottoms",     description: "Formal trousers, straight-cut pants and wide-leg trousers.",          displayOrder: 4, imgId: "photo-1509631179647-0177331693ae" },
  { name: "Sets & Co-ords",    subtitle: "Matching top & bottom sets",   description: "Effortlessly styled matching sets.",                                  displayOrder: 5, imgId: "photo-1616627988047-1f1a28aa25a9" },
];

// ── Stock scenarios (used in comments for clarity) ────────────────────────────
// NORMAL    — all sizes good stock
// SOME_OUT  — some sizes stock 0 (XL, XXL unavailable)
// LOW_STOCK — most sizes only 1–3 left
// LTD_SIZES — limited size range (S, M, L only)
// COLOR_OUT — one color fully sold out (all sizes 0)
// SOLD_OUT  — product isSoldOut: true

// Helper to build a colors array with explicit control
const sz = (sizes) => sizes.map(([size, stock]) => ({ size, stock }));

const FULL   = sz([["XS",15],["S",20],["M",25],["L",18],["XL",10],["XXL",6]]);
const NO_XXL = sz([["XS",12],["S",18],["M",22],["L",15],["XL",8],["XXL",0]]);
const SML    = sz([["S",14], ["M",20],["L",12]]);
const SMLL   = sz([["S",10], ["M",16],["L",14],["XL",8]]);
const LOW    = sz([["XS",1], ["S",2], ["M",3], ["L",1], ["XL",0],["XXL",0]]);
const OUT    = sz([["XS",0], ["S",0], ["M",0], ["L",0], ["XL",0],["XXL",0]]);

const clr = (name, code, sizes) => ({
  colorName: name, colorCode: code,
  images: [{ url: img(), publicId: pid(imgIdx) }, { url: img2(), publicId: pid(imgIdx + 1) }],
  sizes,
});

// ── Products ──────────────────────────────────────────────────────────────────
let prodIdx = 0;

const PRODUCTS = [

  // ── T-Shirts & Tops ─────────────────────────────────────────────────
  {
    // NORMAL — all sizes & colors in stock
    name: "Women's Basic Round Neck T-Shirt", col: "T-Shirts & Tops",
    price: 1500, fabric: "100% Cotton Jersey",
    design: "Round neck, short sleeves, relaxed fit",
    care: "Machine wash cold, tumble dry low",
    isFeatured: true, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("White", "#FFFFFF", FULL),
      clr("Black", "#1A1A1A", FULL),
    ],
  },
  {
    // SOME_OUT — XL and XXL sold out
    name: "Striped Casual T-Shirt", col: "T-Shirts & Tops",
    price: 1800, fabric: "Cotton Blend",
    design: "Classic horizontal stripes, crew neck, short sleeves",
    care: "Machine wash cold, do not bleach",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("Navy Blue", "#1B2A5E", NO_XXL),
      clr("Grey",      "#808080", NO_XXL),
    ],
  },
  {
    // LOW_STOCK — hurry, only a few left
    name: "Plain V-Neck T-Shirt", col: "T-Shirts & Tops",
    price: 1400, fabric: "Soft Combed Cotton",
    design: "V-neckline, short sleeves, slim fit",
    care: "Hand wash or machine wash gentle",
    isFeatured: false, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("White", "#FFFFFF",  LOW),
      clr("Pink",  "#FF69B4",  LOW),
      clr("Beige", "#D4B896",  LOW),
    ],
  },
  {
    // LTD_SIZES — only S, M, L available
    name: "Sleeveless Tank Top", col: "T-Shirts & Tops",
    price: 1200, fabric: "100% Cotton",
    design: "Sleeveless, scooped neck, relaxed fit",
    care: "Machine wash cold, hang to dry",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("White",  "#FFFFFF",  SML),
      clr("Coral",  "#FF6B6B",  SML),
    ],
  },
  {
    // COLOR_OUT — Cream color fully sold out
    name: "Off-Shoulder Casual Top", col: "T-Shirts & Tops",
    price: 2200, fabric: "Viscose Blend",
    design: "Off-shoulder neckline, elasticated collar, flowy fit",
    care: "Hand wash cold, lay flat to dry",
    isFeatured: true, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Pink",  "#FF69B4",  SMLL),
      clr("Cream", "#FFFDD0",  OUT),   // fully sold out color
    ],
  },
  {
    // NORMAL
    name: "Casual Graphic Print Tee", col: "T-Shirts & Tops",
    price: 1600, fabric: "Cotton Jersey",
    design: "Graphic print front, round neck, short sleeves, boxy fit",
    care: "Wash inside out in cold water",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("Black",    "#1A1A1A", FULL),
      clr("Navy Blue","#1B2A5E", FULL),
    ],
  },
  {
    // SOLD_OUT — entire product out of stock
    name: "Basic Crop Top", col: "T-Shirts & Tops",
    price: 1300, fabric: "Stretch Cotton",
    design: "Cropped length, round neck, short sleeves",
    care: "Machine wash gentle, do not iron print",
    isFeatured: false, isNewArrival: false, isSoldOut: true,
    colors: [
      clr("Black", "#1A1A1A", OUT),
      clr("White", "#FFFFFF", OUT),
    ],
  },
  {
    // NORMAL — 3 colors
    name: "Rib-Knit Fitted Top", col: "T-Shirts & Tops",
    price: 1900, fabric: "Cotton Rib Knit",
    design: "Ribbed texture, fitted silhouette, round neck",
    care: "Hand wash cold, reshape while damp",
    isFeatured: true, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Black",   "#1A1A1A", FULL),
      clr("Beige",   "#D4B896", FULL),
      clr("Mustard", "#FFDB58", SMLL),
    ],
  },

  // ── Shirts & Blouses ────────────────────────────────────────────────
  {
    // NORMAL
    name: "Women's Classic Formal Shirt", col: "Shirts & Blouses",
    price: 2800, fabric: "100% Cotton Poplin",
    design: "Button-down collar, long sleeves with cuffs, straight cut",
    care: "Iron on medium heat, machine wash cold",
    isFeatured: true, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("White",      "#FFFFFF",  FULL),
      clr("Light Blue", "#ADD8E6",  FULL),
    ],
  },
  {
    // SOME_OUT — XL low, XXL out
    name: "Casual Linen Shirt", col: "Shirts & Blouses",
    price: 3200, fabric: "100% Linen",
    design: "Relaxed fit, half placket, roll-up sleeves, side slits",
    care: "Hand wash cold, line dry, iron while damp",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("Beige",       "#D4B896", sz([["XS",10],["S",14],["M",18],["L",12],["XL",2],["XXL",0]])),
      clr("Olive Green", "#6B7645", sz([["XS",8], ["S",12],["M",15],["L",10],["XL",3],["XXL",0]])),
    ],
  },
  {
    // LTD_SIZES — S, M, L only
    name: "Floral Print Blouse", col: "Shirts & Blouses",
    price: 2500, fabric: "Chiffon",
    design: "All-over floral print, V-neck, flowy sleeves",
    care: "Hand wash only in cold water, hang dry",
    isFeatured: false, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Pink",  "#FF69B4", SML),
      clr("Coral", "#FF6B6B", SML),
    ],
  },
  {
    // NORMAL
    name: "Satin Evening Blouse", col: "Shirts & Blouses",
    price: 3500, fabric: "Satin Weave Polyester",
    design: "V-neck, long sleeves with slit cuffs, relaxed elegant fit",
    care: "Dry clean recommended, or hand wash gently",
    isFeatured: true, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Black",  "#1A1A1A", FULL),
      clr("Maroon", "#800000", SMLL),
    ],
  },
  {
    // SOME_OUT — XS size sold out
    name: "Casual Plaid Shirt", col: "Shirts & Blouses",
    price: 2600, fabric: "Cotton Flannel",
    design: "Classic plaid check, button-down, long sleeves, relaxed fit",
    care: "Machine wash cold, tumble dry low",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("Red",      "#CC2222", sz([["XS",0],["S",12],["M",18],["L",14],["XL",8],["XXL",4]])),
      clr("Navy Blue","#1B2A5E", sz([["XS",0],["S",10],["M",16],["L",12],["XL",6],["XXL",2]])),
    ],
  },
  {
    // LTD_SIZES — S, M, L only (one color)
    name: "White Formal Shirt", col: "Shirts & Blouses",
    price: 2900, fabric: "Stretch Cotton Poplin",
    design: "Slim fit, pointed collar, long sleeves, concealed button front",
    care: "Machine wash cold, iron on medium heat",
    isFeatured: false, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("White", "#FFFFFF", SML),
    ],
  },
  {
    // SOLD_OUT
    name: "Ruffled Chiffon Blouse", col: "Shirts & Blouses",
    price: 2800, fabric: "Chiffon",
    design: "Ruffled front detail, round neck, long sleeves",
    care: "Hand wash cold, hang to dry",
    isFeatured: false, isNewArrival: false, isSoldOut: true,
    colors: [
      clr("Pink",  "#FF69B4", OUT),
      clr("Cream", "#FFFDD0", OUT),
    ],
  },
  {
    // NORMAL
    name: "Oversized Casual Shirt", col: "Shirts & Blouses",
    price: 2400, fabric: "Lightweight Cotton",
    design: "Oversized fit, dropped shoulders, chest pocket, short sleeves",
    care: "Machine wash cold, do not bleach",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("White",  "#FFFFFF",  FULL),
      clr("Yellow", "#F5C518",  FULL),
    ],
  },

  // ── Frocks & Dresses ────────────────────────────────────────────────
  {
    // NORMAL — 3 colors
    name: "Casual A-Line Frock", col: "Frocks & Dresses",
    price: 3200, fabric: "Cotton Blend",
    design: "A-line silhouette, round neck, short sleeves, knee length",
    care: "Machine wash cold, tumble dry low",
    isFeatured: true, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Pink",       "#FF69B4", FULL),
      clr("Light Blue", "#ADD8E6", FULL),
      clr("Beige",      "#D4B896", SMLL),
    ],
  },
  {
    // LOW_STOCK
    name: "Floral Midi Frock", col: "Frocks & Dresses",
    price: 3800, fabric: "Chiffon",
    design: "All-over floral print, V-neck, flared midi skirt, fitted bodice",
    care: "Hand wash cold, hang to dry",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("Coral",      "#FF6B6B", sz([["XS",1],["S",2],["M",1],["L",0],["XL",0],["XXL",0]])),
      clr("Olive Green","#6B7645", sz([["XS",0],["S",1],["M",2],["L",1],["XL",0],["XXL",0]])),
    ],
  },
  {
    // LTD_SIZES — XS through L only
    name: "Casual Mini Frock", col: "Frocks & Dresses",
    price: 2800, fabric: "Cotton Jersey",
    design: "Scoop neck, short sleeves, flared mini skirt",
    care: "Machine wash cold, do not iron",
    isFeatured: false, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Black", "#1A1A1A", sz([["XS",10],["S",16],["M",20],["L",14]])),
      clr("Red",   "#CC2222", sz([["XS",8], ["S",12],["M",16],["L",10]])),
    ],
  },
  {
    // NORMAL
    name: "Wrap Midi Dress", col: "Frocks & Dresses",
    price: 4200, fabric: "Viscose Georgette",
    design: "Wrap-front, V-neckline, adjustable tie waist, midi length",
    care: "Dry clean or hand wash cold",
    isFeatured: true, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Navy Blue", "#1B2A5E", FULL),
      clr("Maroon",    "#800000", SMLL),
    ],
  },
  {
    // COLOR_OUT — White color fully sold out
    name: "Sleeveless Summer Frock", col: "Frocks & Dresses",
    price: 2600, fabric: "100% Cotton",
    design: "Sleeveless, square neck, A-line skirt, knee length",
    care: "Machine wash cold, line dry",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("White",  "#FFFFFF",  OUT),   // sold out color
      clr("Yellow", "#F5C518",  FULL),
    ],
  },
  {
    // NORMAL — 3 colors
    name: "Shirt Dress", col: "Frocks & Dresses",
    price: 3600, fabric: "Linen Cotton Blend",
    design: "Button-through front, shirt collar, belt included, knee length",
    care: "Machine wash cold, iron on medium",
    isFeatured: false, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Beige",       "#D4B896", FULL),
      clr("Grey",        "#808080", FULL),
      clr("Olive Green", "#6B7645", SMLL),
    ],
  },
  {
    // LOW_STOCK
    name: "Bodycon Midi Dress", col: "Frocks & Dresses",
    price: 3400, fabric: "Stretch Jersey",
    design: "Fitted bodycon silhouette, round neck, sleeveless, midi length",
    care: "Machine wash cold gentle, hang to dry",
    isFeatured: false, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Black",  "#1A1A1A", sz([["XS",0],["S",2],["M",3],["L",1],["XL",0],["XXL",0]])),
      clr("Maroon", "#800000", sz([["XS",1],["S",1],["M",2],["L",0],["XL",0],["XXL",0]])),
    ],
  },
  {
    // SOLD_OUT
    name: "Casual Maxi Dress", col: "Frocks & Dresses",
    price: 4500, fabric: "Lightweight Rayon",
    design: "Flowy maxi length, V-neck, sleeveless, side slits",
    care: "Hand wash cold, do not wring",
    isFeatured: false, isNewArrival: false, isSoldOut: true,
    colors: [
      clr("Teal",     "#008080", OUT),
      clr("Navy Blue","#1B2A5E", OUT),
    ],
  },

  // ── Trousers & Pants ────────────────────────────────────────────────
  {
    // NORMAL
    name: "Women's Formal Trousers", col: "Trousers & Pants",
    price: 3500, fabric: "Poly-Viscose Blend",
    design: "Straight cut, mid-rise, zip fly, side and back pockets",
    care: "Dry clean or machine wash cold, iron on medium",
    isFeatured: true, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Black",    "#1A1A1A", FULL),
      clr("Navy Blue","#1B2A5E", FULL),
    ],
  },
  {
    // SOME_OUT — XL and XXL sold out
    name: "Straight-Cut Casual Pants", col: "Trousers & Pants",
    price: 2800, fabric: "Cotton Twill",
    design: "Straight leg, mid-rise, elasticated back waist, side pockets",
    care: "Machine wash cold, tumble dry low",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("Grey",  "#808080", sz([["XS",10],["S",15],["M",18],["L",12],["XL",0],["XXL",0]])),
      clr("Beige", "#D4B896", sz([["XS",8], ["S",12],["M",15],["L",10],["XL",0],["XXL",0]])),
    ],
  },
  {
    // NORMAL — 3 colors
    name: "Wide Leg Trousers", col: "Trousers & Pants",
    price: 3800, fabric: "Linen Blend",
    design: "High-rise, wide-leg silhouette, elasticated waist, pockets",
    care: "Machine wash gentle, hang to dry, iron while damp",
    isFeatured: false, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("White",       "#FFFFFF",  FULL),
      clr("Cream",       "#FFFDD0",  FULL),
      clr("Olive Green", "#6B7645",  SMLL),
    ],
  },
  {
    // LTD_SIZES — S to XL only
    name: "Slim Fit Formal Pants", col: "Trousers & Pants",
    price: 3200, fabric: "Stretch Poly-Viscose",
    design: "Slim tapered leg, high-rise, zip fly, clean front",
    care: "Machine wash cold, iron on medium heat",
    isFeatured: false, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Black",  "#1A1A1A", SMLL),
      clr("Maroon", "#800000", SMLL),
    ],
  },
  {
    // COLOR_OUT — Teal fully sold out
    name: "Palazzo Pants", col: "Trousers & Pants",
    price: 2600, fabric: "Chiffon",
    design: "Floor-length, high-rise, very wide flowy leg, elasticated waist",
    care: "Hand wash cold, hang to dry",
    isFeatured: true, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Teal",   "#008080", OUT),   // sold out color
      clr("Yellow", "#F5C518", FULL),
    ],
  },
  {
    // NORMAL
    name: "Cropped Cigarette Pants", col: "Trousers & Pants",
    price: 3000, fabric: "Cotton Blend",
    design: "Cropped length, slim straight leg, mid-rise, zip fly",
    care: "Machine wash cold, iron on medium",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("Black",    "#1A1A1A", FULL),
      clr("Navy Blue","#1B2A5E", FULL),
    ],
  },
  {
    // NORMAL — 3 colors
    name: "Casual Jogger Pants", col: "Trousers & Pants",
    price: 2200, fabric: "Cotton Fleece",
    design: "Relaxed tapered leg, elasticated waist and cuffs, drawstring",
    care: "Machine wash cold, tumble dry low",
    isFeatured: false, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Grey",        "#808080", FULL),
      clr("Black",       "#1A1A1A", FULL),
      clr("Olive Green", "#6B7645", SMLL),
    ],
  },
  {
    // LOW_STOCK
    name: "High-Waist Trousers", col: "Trousers & Pants",
    price: 3600, fabric: "Stretch Cotton",
    design: "High-rise waist, straight leg, zip fly, front pleats",
    care: "Machine wash cold, iron on low heat",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("Black",  "#1A1A1A", sz([["XS",0],["S",2],["M",3],["L",2],["XL",1],["XXL",0]])),
      clr("Maroon", "#800000", sz([["XS",1],["S",1],["M",2],["L",1],["XL",0],["XXL",0]])),
    ],
  },

  // ── Sets & Co-ords ──────────────────────────────────────────────────
  {
    // NORMAL
    name: "T-Shirt & Trouser Co-ord Set", col: "Sets & Co-ords",
    price: 4200, fabric: "Cotton Jersey + Cotton Twill",
    design: "Matching plain colour, round neck tee + straight-cut trousers",
    care: "Machine wash cold, do not bleach, hang to dry",
    isFeatured: true, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("White",    "#FFFFFF",  FULL),
      clr("Navy Blue","#1B2A5E",  FULL),
    ],
  },
  {
    // NORMAL
    name: "Shirt & Wide-Leg Pants Set", col: "Sets & Co-ords",
    price: 5500, fabric: "Linen Cotton Blend",
    design: "Button-down shirt + matching wide-leg trousers, same fabric",
    care: "Machine wash gentle, iron on medium while damp",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("Beige",       "#D4B896", FULL),
      clr("Olive Green", "#6B7645", SMLL),
    ],
  },
  {
    // SOME_OUT — XL and XXL sold out
    name: "Crop Top & Skirt Set", col: "Sets & Co-ords",
    price: 3800, fabric: "Stretch Cotton Rib",
    design: "Cropped rib-knit top + matching A-line midi skirt",
    care: "Machine wash gentle, reshape while damp",
    isFeatured: false, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Pink",  "#FF69B4", NO_XXL),
      clr("Black", "#1A1A1A", NO_XXL),
    ],
  },
  {
    // LTD_SIZES — S, M, L only
    name: "Casual Shorts & Top Set", col: "Sets & Co-ords",
    price: 3200, fabric: "Cotton Blend",
    design: "Relaxed fit top + matching casual shorts, drawstring waist",
    care: "Machine wash cold, tumble dry low",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("Coral",  "#FF6B6B", SML),
      clr("Yellow", "#F5C518", SML),
    ],
  },
  {
    // NORMAL
    name: "Formal Shirt & Trouser Set", col: "Sets & Co-ords",
    price: 6500, fabric: "Poly-Viscose Blend",
    design: "Collared formal shirt + matching straight-cut formal trousers",
    care: "Dry clean or machine wash cold, iron on medium",
    isFeatured: true, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Black",    "#1A1A1A", FULL),
      clr("Navy Blue","#1B2A5E", FULL),
    ],
  },
  {
    // LOW_STOCK
    name: "Matching Loungewear Set", col: "Sets & Co-ords",
    price: 2800, fabric: "100% Cotton Jersey",
    design: "Relaxed sweatshirt-style top + matching jogger pants",
    care: "Machine wash cold, tumble dry low",
    isFeatured: false, isNewArrival: false, isSoldOut: false,
    colors: [
      clr("Grey",  "#808080", sz([["XS",2],["S",3],["M",2],["L",1],["XL",0],["XXL",0]])),
      clr("Beige", "#D4B896", sz([["XS",1],["S",2],["M",3],["L",2],["XL",1],["XXL",0]])),
    ],
  },
  {
    // SOLD_OUT
    name: "Blazer & Trouser Set", col: "Sets & Co-ords",
    price: 7500, fabric: "Stretch Suiting Fabric",
    design: "Tailored blazer + matching straight-cut trousers, lined",
    care: "Dry clean recommended",
    isFeatured: false, isNewArrival: false, isSoldOut: true,
    colors: [
      clr("Black",  "#1A1A1A", OUT),
      clr("Maroon", "#800000", OUT),
    ],
  },
  {
    // COLOR_OUT — Teal fully sold out, White available
    name: "Tank Top & Palazzo Set", col: "Sets & Co-ords",
    price: 3500, fabric: "Viscose Blend",
    design: "Fitted tank top + matching flowy palazzo pants",
    care: "Hand wash cold, hang to dry",
    isFeatured: false, isNewArrival: true, isSoldOut: false,
    colors: [
      clr("Teal",  "#008080", OUT),   // sold out color
      clr("White", "#FFFFFF", FULL),
    ],
  },
];

// ── Seed ──────────────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✔  Connected to MongoDB\n");

  await Collection.deleteMany({});
  await Product.deleteMany({});
  console.log("✔  Cleared existing data\n");

  // Collections
  const colMap = {};
  for (const c of COLLECTIONS) {
    const doc = await Collection.create({
      name: c.name, subtitle: c.subtitle, description: c.description,
      image: { url: `https://images.unsplash.com/${c.imgId}?auto=format&fit=crop&w=600&q=80`, publicId: `kamari/col/${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` },
      isActive: true, displayOrder: c.displayOrder,
    });
    colMap[c.name] = doc;
    console.log(`  ✓ Collection: ${c.name}`);
  }
  console.log();

  // Products
  let n = 0;
  for (const p of PRODUCTS) {
    const totalStock = p.colors.reduce((t, c) => t + c.sizes.reduce((s, sz) => s + sz.stock, 0), 0);
    const scenario = p.isSoldOut ? "SOLD OUT" : totalStock === 0 ? "SOLD OUT" :
      p.colors.some(c => c.sizes.every(s => s.stock === 0)) ? "COLOR OUT" :
      p.colors.some(c => c.sizes.some(s => s.stock > 0 && s.stock <= 3)) ? "LOW STOCK" :
      p.colors[0].sizes.length < 6 ? "LTD SIZES" :
      p.colors.some(c => c.sizes.some(s => s.stock === 0)) ? "SOME OUT" : "NORMAL";

    await Product.create({
      name: p.name, slug: slugify(p.name, n),
      collection: p.col, setName: p.col,
      price: p.price,
      description: `${p.name} — stylish everyday wear for Sri Lankan women.`,
      fabric: p.fabric, design: p.design, productCare: p.care,
      sizeChartImage: "",
      colors: p.colors,
      isFeatured: p.isFeatured, isNewArrival: p.isNewArrival, isSoldOut: p.isSoldOut,
      isActive: true,
    });
    console.log(`  ✓ [${p.col}] ${p.name.padEnd(38)} [${scenario}]  LKR ${p.price.toLocaleString()}`);
    n++;
  }

  console.log(`\n✔  Done — ${COLLECTIONS.length} collections, ${n} products seeded.`);
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
