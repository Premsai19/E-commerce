/**
 * VoltTech - Product Catalog Data
 * Contains realistic tech gadget product data with specifications, ratings, and reviews.
 */

const PRODUCTS_DATA = [
  {
    id: "prod-1",
    name: "ApexBook Pro 16\"",
    category: "laptops",
    price: 1999,
    originalPrice: 2299,
    rating: 4.9,
    reviewsCount: 142,
    stock: 12,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    description: "Engineered for pro workflows. Features a stunning Liquid Retina XDR display, next-gen 12-core CPU, 32GB unified memory, and up to 22 hours of battery life.",
    features: [
      "16.2-inch Liquid Retina XDR display (3456 x 2234)",
      "Next-Gen 12-core CPU & 38-core GPU",
      "32GB High-Speed Unified Memory, 1TB NVMe SSD",
      "Studio-grade 3-mic array and 6-speaker sound system",
      "MagSafe 3, 3x Thunderbolt 4 ports, HDMI, SDXC"
    ],
    specs: {
      "Processor": "12-Core Silicon Chip",
      "Memory": "32GB Unified RAM",
      "Storage": "1TB PCIe Gen4 SSD",
      "Display": "16.2\" 120Hz Mini-LED",
      "Weight": "2.14 kg (4.7 lbs)"
    }
  },
  {
    id: "prod-2",
    name: "Nova X Ultra 5G",
    category: "smartphones",
    price: 999,
    originalPrice: 1149,
    rating: 4.8,
    reviewsCount: 98,
    stock: 24,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    description: "The peak of smartphone engineering with an aerospace titanium frame, 200MP periscope zoom camera, and all-day intelligent battery life.",
    features: [
      "6.8-inch Dynamic AMOLED 2X, 1-120Hz LTPO",
      "200MP Main + 50MP 5x Optical Telephoto + 12MP Ultra-wide",
      "Snapdragon 8 Gen 3 Flagship Processor",
      "5,000mAh Battery with 45W Fast Charging",
      "IP68 Water and Dust Resistance with S-Pen support"
    ],
    specs: {
      "Chipset": "Snapdragon 8 Gen 3",
      "Cameras": "200MP + 50MP + 12MP",
      "RAM/Storage": "12GB / 256GB UFS 4.0",
      "Battery": "5,000 mAh (45W)",
      "OS": "Android 14 with 7 yrs updates"
    }
  },
  {
    id: "prod-3",
    name: "SonicBlast ANC Studio",
    category: "audio",
    price: 279,
    originalPrice: 349,
    rating: 4.7,
    reviewsCount: 215,
    stock: 35,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Industry-leading active noise cancellation with custom 40mm titanium drivers that deliver crisp highs, balanced mids, and punchy deep bass.",
    features: [
      "Custom Adaptive Active Noise Cancellation with Transparency Mode",
      "Up to 45 hours playback with ANC off, 35 hours with ANC on",
      "Multipoint Bluetooth 5.3 connection for seamless device switching",
      "Ultra-soft memory foam ear cushions for fatigue-free listening",
      "Hi-Res Audio Certified with LDAC support"
    ],
    specs: {
      "Driver": "40mm Custom Titanium",
      "Battery Life": "45 Hours",
      "Connectivity": "Bluetooth 5.3 + 3.5mm AUX",
      "Weight": "250g",
      "Charging": "USB-C Fast Charge (10 min = 5 hrs)"
    }
  },
  {
    id: "prod-4",
    name: "ChronoFit Smartwatch Pro",
    category: "wearables",
    price: 299,
    originalPrice: 349,
    rating: 4.6,
    reviewsCount: 76,
    stock: 18,
    badge: "New",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Crafted with a sapphire crystal glass and titanium case. Monitors dual-frequency GPS, medical-grade ECG, blood oxygen, and continuous heart rate.",
    features: [
      "1.43-inch Always-On Sapphire AMOLED (1000 nits)",
      "Dual-Band multi-satellite GPS navigation",
      "Comprehensive ECG, SpO2, and Sleep Phase analysis",
      "Up to 14 days battery life on a single charge",
      "5 ATM + IP68 Water Resistance (Swim Proof)"
    ],
    specs: {
      "Case": "Grade 4 Titanium (46mm)",
      "Battery": "14 Days Typical Use",
      "Water Resistance": "50m (5 ATM)",
      "Sensors": "ECG, SpO2, Optical HR, Barometer",
      "Compatibility": "iOS & Android"
    }
  },
  {
    id: "prod-5",
    name: "Legion Titan 16 Gaming Rig",
    category: "laptops",
    price: 1749,
    originalPrice: 1999,
    rating: 4.8,
    reviewsCount: 64,
    stock: 8,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
    description: "Uncompromised gaming firepower powered by Intel Core i9 14th Gen and NVIDIA GeForce RTX 4080 with Coldfront vapor chamber cooling.",
    features: [
      "Intel Core i9-14900HX 24-core processor",
      "NVIDIA GeForce RTX 4080 12GB GDDR6 (175W TGP)",
      "16\" WQXGA 240Hz 500 nits 100% DCI-P3 Display with G-SYNC",
      "32GB DDR5 5600MHz RAM + 2TB NVMe PCIe 4.0 SSD",
      "Per-key RGB mechanical feel keyboard with anti-ghosting"
    ],
    specs: {
      "GPU": "RTX 4080 (175W)",
      "CPU": "Intel Core i9-14900HX",
      "RAM": "32GB DDR5",
      "Display": "240Hz 2.5K IPS G-SYNC",
      "Cooling": "Dual-Fan Vapor Chamber"
    }
  },
  {
    id: "prod-6",
    name: "EchoPulse Pro Wireless Earbuds",
    category: "audio",
    price: 149,
    originalPrice: 189,
    rating: 4.5,
    reviewsCount: 167,
    stock: 45,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    description: "Compact wireless audio with spatial head tracking, wind-reduction call mics, and Qi wireless charging case with 32-hour total reserve.",
    features: [
      "Custom 11mm Dynamic drivers with deep resonance chamber",
      "Smart Active Noise Reduction adjusts to ambient noise levels",
      "8 hours continuous play + 24 hours in Qi wireless charging case",
      "IPX5 water and sweat resistance for workouts",
      "Touch gesture controls for volume, track skip, and voice assistant"
    ],
    specs: {
      "Battery": "32 hrs total (8h buds + 24h case)",
      "Noise Cancellation": "Active -35dB",
      "Waterproofing": "IPX5",
      "Bluetooth": "5.3 with LE Audio",
      "Weight": "4.5g per bud"
    }
  },
  {
    id: "prod-7",
    name: "Vortex Pro RGB Mechanical Keyboard",
    category: "accessories",
    price: 119,
    originalPrice: 149,
    rating: 4.9,
    reviewsCount: 88,
    stock: 30,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    description: "75% compact hot-swappable mechanical keyboard with pre-lubed linear switches, gasket mount design, and custom sound-dampening foam.",
    features: [
      "Hot-swappable 5-pin PCB supports Cherry, Gateron, Kailh switches",
      "Multi-layer Poron gasket mount for creamy, thocky acoustics",
      "Double-shot PBT keycaps resistant to shine and oils",
      "Tri-mode connectivity: Bluetooth 5.0, 2.4GHz Wireless, and USB-C",
      "Programmable multi-function aluminum rotary knob"
    ],
    specs: {
      "Layout": "75% Compact (82 Keys)",
      "Switches": "Pre-lubed Red Linear",
      "Keycaps": "Double-shot PBT OEM profile",
      "Battery": "4,000 mAh Rechargeable",
      "Backlight": "South-facing 16.8M RGB"
    }
  },
  {
    id: "prod-8",
    name: "PixelFlow 8 5G",
    category: "smartphones",
    price: 699,
    originalPrice: 799,
    rating: 4.7,
    reviewsCount: 112,
    stock: 20,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=800&q=80",
    description: "Powered by custom AI processor for next-level computational photography, live translation, and zero bloatware pure experience.",
    features: [
      "6.2-inch Actua OLED Display with 120Hz refresh rate",
      "50MP Main sensor with Ultra-Res Zoom and Best Take feature",
      "Google Tensor G3 chip with dedicated security coprocessor",
      "Clean software with 7 years of OS & security updates",
      "Fast wireless charging & reverse battery share"
    ],
    specs: {
      "Display": "6.2\" OLED 120Hz",
      "Camera": "50MP Wide + 12MP Ultra-wide",
      "Battery": "4,575 mAh",
      "Processor": "Tensor G3",
      "Storage": "128GB / 256GB"
    }
  },
  {
    id: "prod-9",
    name: "Horizon 34\" Curved QD-OLED Monitor",
    category: "accessories",
    price: 799,
    originalPrice: 999,
    rating: 4.9,
    reviewsCount: 45,
    stock: 5,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    description: "Quantum Dot OLED technology with ultra-wide 1800R curve, 175Hz refresh rate, 0.03ms response time, and infinite contrast ratio.",
    features: [
      "34-inch 3440 x 1440 WQHD 21:9 Curved QD-OLED",
      "Lightning-fast 0.03ms (GtG) response time & 175Hz refresh rate",
      "VESA DisplayHDR True Black 400 with 99.3% DCI-P3 color gamut",
      "Integrated KVM switch allows control of two PCs with one keyboard/mouse",
      "Custom graphene heat sink for cool, silent burn-in prevention"
    ],
    specs: {
      "Resolution": "3440 x 1440 (UWQHD)",
      "Refresh Rate": "175Hz",
      "Response Time": "0.03ms GtG",
      "Curvature": "1800R",
      "Ports": "2x HDMI 2.1, 1x DP 1.4, USB-C 65W PD"
    }
  },
  {
    id: "prod-10",
    name: "Aerox Ultra-Light Wireless Mouse",
    category: "accessories",
    price: 69,
    originalPrice: 89,
    rating: 4.6,
    reviewsCount: 130,
    stock: 50,
    badge: "New",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    description: "Featherlight 58g honeycomb shell with TrueMove 26,000 DPI sensor, optical golden micro switches, and 80-hour battery life.",
    features: [
      "Ultra-lightweight 58-gram ergonomic design",
      "AquaBarrier IP54 protection against dust, water, and sweat",
      "Quantum 2.0 Wireless lag-free connection (2.4GHz and Bluetooth 5.0)",
      "Next-gen optical switches rated for 100M crisp clicks",
      "100% Virgin grade PTFE glide skates"
    ],
    specs: {
      "Weight": "58 grams",
      "DPI": "Up to 26,000",
      "Polling Rate": "1,000Hz (1ms)",
      "Battery": "Up to 80 hours",
      "Connection": "2.4GHz / BT / USB-C"
    }
  },
  {
    id: "prod-11",
    name: "MagFast 3-in-1 Charging Stand",
    category: "accessories",
    price: 49,
    originalPrice: 65,
    rating: 4.5,
    reviewsCount: 89,
    stock: 40,
    badge: "",
    image: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80",
    description: "Charge your smartphone, smartwatch, and wireless earbuds concurrently from a single sleek aluminum alloy magnetic tree.",
    features: [
      "Strong neodymium magnets for secure portrait or landscape orientation",
      "Fast 15W wireless output for phone, 5W for watch, and 5W for earbuds",
      "Smart LED indicator light with sleep-friendly night mode",
      "Foreign object detection and over-temperature safety shield",
      "Includes 30W USB-C PD power adapter in box"
    ],
    specs: {
      "Output": "15W + 5W + 5W (Max 25W)",
      "Material": "Anodized Space Gray Aluminum",
      "Input": "USB-C 9V/3A",
      "Compatibility": "MagSafe & Qi enabled devices",
      "Dimensions": "140 x 95 x 115 mm"
    }
  },
  {
    id: "prod-12",
    name: "ZenAir Ultra 14\" Laptop",
    category: "laptops",
    price: 1099,
    originalPrice: 1299,
    rating: 4.7,
    reviewsCount: 53,
    stock: 14,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    description: "Featherlight 1.1kg all-metal chassis with stunning 2.8K 120Hz OLED screen and Intel Core Ultra 7 processor with dedicated NPU for AI.",
    features: [
      "14-inch 2.8K (2880 x 1800) 120Hz 0.2ms OLED display",
      "Intel Core Ultra 7 155H with Intel AI Boost NPU",
      "16GB LPDDR5X RAM + 1TB PCIe 4.0 SSD",
      "75Wh high-capacity battery delivering up to 16 hours productivity",
      "Dolby Atmos Harman Kardon certified quad speakers"
    ],
    specs: {
      "Weight": "1.19 kg",
      "Display": "14\" 2.8K 120Hz OLED",
      "CPU": "Intel Core Ultra 7",
      "Battery": "75Wh (Up to 16h)",
      "Thickness": "14.9 mm"
    }
  }
];

// Available coupon codes
const PROMO_CODES = {
  "TECH10": { type: "percent", value: 10, description: "10% off entire order" },
  "FRESHER25": { type: "flat", value: 25, description: "$25 off orders above $100", minSpend: 100 },
  "VOLT50": { type: "flat", value: 50, description: "$50 off orders above $300", minSpend: 300 },
  "FREESHIP": { type: "shipping", value: 0, description: "Free express shipping" }
};
