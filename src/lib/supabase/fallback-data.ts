import { Product, BlogPost, DynamicPage, ToolMicroApp, SiteSettings } from "../types";

export const fallbackSettings: SiteSettings = {
  "id": "00000000-0000-0000-0000-000000000001",
  "global_seo_title": {
    "en": "Aronyok | Pure Living, Organic Herbs & Eco Store",
    "bn": "অরণ্যক | বিশুদ্ধ জীবনধারা, জৈব ভেষজ ও পরিবেশবান্ধব পণ্য"
  },
  "global_seo_description": {
    "en": "Explore wild raw honey, cold-pressed oils, medicinal herbs, and artisanal pottery from Bangladesh with Aronyok.",
    "bn": "অরণ্যকে আবিষ্কার করুন খাঁটি প্রাকৃতিক মধু, ঘানিতে ভাঙা তেল, ওষধি গাছ এবং পরিবেশবান্ধব মাটির সামগ্রী।"
  },
  "analytics_script": "<!-- Aronyok Analytics -->",
  "ad_banner_top_html": "<div class=\"bg-forest-800 text-cream-100 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2\"><span class=\"bg-forest-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full\">Spring Eco Special</span> <span>Enjoy 15% off all medicinal herbs with code <strong>ARONYOKGREEN</strong> 🌱</span></div>",
  "ai_system_prompt": "You are Aronyok (অরণ্যক), an intelligent, gentle, and highly knowledgeable nature expert, herbalist, and eco-living guide. You are fluent in both English and Bengali. If the user asks in Bengali, reply warmly in Bengali. If in English, reply in English. Help users identify therapeutic herbs, offer plant care advice, suggest organic solutions, and guide them through our eco products.",
  "contact_email": "care@aronyok.com",
  "contact_phone": "+880 1700 000000"
};

export const fallbackProducts: Product[] = [
  {
    "id": "prod-1",
    "name": {
      "en": "Organic Sundarbans Mangrove Raw Honey (500g)",
      "bn": "সুন্দরবনের প্রাকৃতিক চাকভাঙা খাঁটি মধু (৫০০ গ্রাম)"
    },
    "slug": "sundarbans-mangrove-raw-honey-500g",
    "description": {
      "en": "Harvested ethically by traditional Mawalis from deep Sundarbans mangroves (Khalisa & Keora blooms). 100% raw, unfiltered, and rich in natural antioxidants.",
      "bn": "সুন্দরবনের গহিন থেকে মৌয়ালদের হাতে সংগ্রহকৃত খলিসা ও কেওড়া ফুলের প্রাকৃতিক চাকভাঙা মধু। কোনো প্রকার প্রক্রিয়াজাতকরণ ছাড়া শতভাগ খাঁটি ও পুষ্টিগুণে ভরপুর।"
    },
    "price": 850,
    "compare_at_price": 950,
    "stock": 60,
    "image_url": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    "category": "honey",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Buy Pure Sundarbans Honey",
      "bn": "সুন্দরবনের খাঁটি মধু কিনুন"
    },
    "seo_description": {
      "en": "Raw honey straight from Sundarbans",
      "bn": "সুন্দরবনের ১০০% খাঁটি কাঁচা মধু"
    }
  },
  {
    "id": "prod-2",
    "name": {
      "en": "Cold-Pressed Organic Neem Seed Oil (200ml)",
      "bn": "ঘানিতে ভাঙা খাঁটি নিমের তেল (২০০ মি.লি.)"
    },
    "slug": "cold-pressed-neem-seed-oil-200ml",
    "description": {
      "en": "Pure cold-pressed Azadirachta Indica oil. Highly effective for natural garden pest deterrent and soothing skin & scalp treatments.",
      "bn": "দেশীয় নিমবীজ থেকে কাঠের ঘানিতে প্রস্তুত বিশুদ্ধ তেল। বাগানের জৈব কীটনাশক হিসেবে এবং ত্বক ও চুলের প্রাকৃতিক যত্নে অনন্য।"
    },
    "price": 380,
    "compare_at_price": 450,
    "stock": 45,
    "image_url": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    "category": "herbs",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Pure Cold Pressed Neem Oil",
      "bn": "ঘানিতে ভাঙা খাঁটি নিম তেল"
    },
    "seo_description": {
      "en": "Natural organic neem oil for pest control",
      "bn": "গাছের যত্ন ও ত্বকের সুরক্ষায় নিম তেল"
    }
  },
  {
    "id": "prod-3",
    "name": {
      "en": "Artisanal Tulsi & Ashwagandha Herbal Tea (100g)",
      "bn": "হাতে তৈরি তুলসী ও অশ্বগন্ধা ভেষজ চা (১০০ গ্রাম)"
    },
    "slug": "tulsi-ashwagandha-herbal-tea-100g",
    "description": {
      "en": "A calming, restorative blend of holy basil leaves and wild ashwagandha roots. Promotes deep sleep, eases anxiety, and bolsters innate immunity.",
      "bn": "কৃষ্ণ তুলসী ও পাহাড়ি অশ্বগন্ধার মেলবন্ধনে তৈরি বিশেষ শান্তিদায়ক ভেষজ চা। মানসিক প্রশান্তি ও দৈনন্দিন ক্লান্তি দূর করতে সহায়ক।"
    },
    "price": 420,
    "compare_at_price": 500,
    "stock": 35,
    "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    "category": "wellness",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Tulsi Ashwagandha Tea",
      "bn": "তুলসী ও অশ্বগন্ধা চা"
    },
    "seo_description": {
      "en": "Ayurvedic tea for peace and immunity",
      "bn": "প্রশান্তিদায়ক আয়ুর্বেদিক চা"
    }
  },
  {
    "id": "prod-4",
    "name": {
      "en": "Handcrafted Terracotta Clay Herb Planter",
      "bn": "ঐতিহ্যবাহী পোড়ামাটির নান্দনিক ভেষজ টব"
    },
    "slug": "handcrafted-terracotta-herb-planter",
    "description": {
      "en": "Fired with traditional wood-kilns by rural Bengali potters. Breathable natural clay creates optimal root aeration and moisture balance.",
      "bn": "গ্রাম বাংলার মৃৎশিল্পীদের হাতে গড়া প্রাকৃতিক পোড়ামাটির টব। মাটির প্রাকৃতিক ছিদ্রযুক্ত গঠন গাছের শিকড়ে বাতাস চলাচলে সাহায্য করে।"
    },
    "price": 290,
    "compare_at_price": 350,
    "stock": 80,
    "image_url": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
    "category": "gardening",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Clay Herb Planter",
      "bn": "পোড়ামাটির ভেষজ টব"
    },
    "seo_description": {
      "en": "Breathable clay pot for indoor herbs",
      "bn": "ভেষজ গাছের জন্য প্রাকৃতিক মাটির টব"
    }
  },
  {
    "id": "prod-5",
    "name": {
      "en": "Krishna Tulsi (Holy Basil) Live Potted Plant",
      "bn": "কৃষ্ণ তুলসী সতেজ টবসহ চারা গাছ"
    },
    "slug": "krishna-tulsi-live-potted-plant",
    "description": {
      "en": "Vigorous live Krishna Tulsi seedling potted in nutrient-rich organic compost. Known for strong aroma and potent medicinal properties.",
      "bn": "উন্নত জাতের ঔষধি কৃষ্ণ তুলসীর সতেজ চারা, পুষ্টিকর জৈব মাটিতে টবসহ রোপিত। ঘরের বারান্দা ও ছাদের জন্য উপযুক্ত।"
    },
    "price": 180,
    "compare_at_price": 220,
    "stock": 50,
    "image_url": "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Live Tulsi Plant",
      "bn": "কৃষ্ণ তুলসী চারা"
    },
    "seo_description": {
      "en": "Live potted Krishna Tulsi plant",
      "bn": "টবসহ সতেজ তুলসী গাছ"
    }
  },
  {
    "id": "prod-6",
    "name": {
      "en": "Organic Vermicompost Soil Enrichment (2kg)",
      "bn": "প্রিমিয়াম প্রাকৃতিক কেঁচো সার - ভার্মিকম্পোস্ট (২ কেজি)"
    },
    "slug": "organic-vermicompost-2kg",
    "description": {
      "en": "100% odourless, slow-release organic earthworm castings packed with beneficial soil microbes and bio-available micro-nutrients.",
      "bn": "শতভাগ দুর্গন্ধহীন ও জীবাণুমুক্ত জৈব কেঁচো সার। গাছের দ্রুত বৃদ্ধি এবং মাটির উর্বরতা বাড়াতে আদর্শ পুষ্টি উপাদান।"
    },
    "price": 160,
    "compare_at_price": 200,
    "stock": 120,
    "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80",
    "category": "gardening",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Organic Vermicompost 2kg",
      "bn": "কেঁচো সার ২ কেজি"
    },
    "seo_description": {
      "en": "Nutrient rich earthworm castings",
      "bn": "গাছের পুষ্টির জন্য সেরা জৈব সার"
    }
  },
  {
    "id": "prod-7",
    "name": {
      "en": "Cinnamon (Daruchini) Live Spice Seedling",
      "bn": "দারুচিনি গাছের চারা (Cinnamon Plant)"
    },
    "slug": "daruchini-cinnamon-plant",
    "description": {
      "en": "Aromatic and therapeutic live cinnamon tree seedling. Its bark and leaves yield aromatic spice and herbal infusions. Ideal for terrace pots or home orchards.",
      "bn": "সুগন্ধি ও ঔষধি গুণসম্পন্ন সতেজ দারুচিনি গাছের চারা। এর ছাল ও পাতা মসলা এবং ভেষজ চা তৈরিতে ব্যবহৃত হয়। টবে বা বাগানে সহজেই চাষযোগ্য।"
    },
    "price": 250,
    "compare_at_price": 300,
    "stock": 40,
    "image_url": "https://kmxrcebqozxnyoopdhnr.supabase.co/storage/v1/object/public/products/product-1793394420837-________-_____-____-___-2.jpg",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Cinnamon (Daruchini) Live Spice Seedling | Aronyok Plant Nursery",
      "bn": "দারুচিনি গাছের চারা (Cinnamon Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Aromatic and therapeutic live cinnamon tree seedling. Its bark and leaves yield aromatic spice and herbal infusions. Ideal for terrace pots or home orchards.",
      "bn": "সুগন্ধি ও ঔষধি গুণসম্পন্ন সতেজ দারুচিনি গাছের চারা। এর ছাল ও পাতা মসলা এবং ভেষজ চা তৈরিতে ব্যবহৃত হয়। টবে বা বাগানে সহজেই চাষযোগ্য।"
    },
    "sync_git": true,
    "git_message": "Update product \"Cinnamon (Daruchini) Live Spice Seedling\""
  },
  {
    "id": "prod-8",
    "name": {
      "en": "Indian Black Plum (Jamun) Grafted Live Plant",
      "bn": "ইন্ডিয়ান কালো জামের কলম চারা (Indian Jamun Plant)"
    },
    "slug": "indian-jam-jamun-plant",
    "description": {
      "en": "High-yield grafted Indian Black Plum (Jamun) seedling. Produces juicy, sweet, purple fruits beneficial for blood sugar management.",
      "bn": "উন্নত জাতের বড় মিষ্টি ইন্ডিয়ান জামের কলম করা চারা। কম সময়ে ফলনশীল এবং ডায়াবেটিস নিয়ন্ত্রণে জাম ও এর বীজ অত্যন্ত উপকারী।"
    },
    "price": 280,
    "compare_at_price": 350,
    "stock": 41,
    "image_url": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Indian Black Plum (Jamun) Grafted Live Plant | Aronyok Plant Nursery",
      "bn": "ইন্ডিয়ান কালো জামের কলম চারা (Indian Jamun Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "High-yield grafted Indian Black Plum (Jamun) seedling. Produces juicy, sweet, purple fruits beneficial for blood sugar management.",
      "bn": "উন্নত জাতের বড় মিষ্টি ইন্ডিয়ান জামের কলম করা চারা। কম সময়ে ফলনশীল এবং ডায়াবেটিস নিয়ন্ত্রণে জাম ও এর বীজ অত্যন্ত উপকারী।"
    }
  },
  {
    "id": "prod-9",
    "name": {
      "en": "Vietnamese All-Season Sweet Malta Seedling",
      "bn": "ভিয়েতনামি বারোমাসি মাল্টা চারা (Vietnamese Malta Plant)"
    },
    "slug": "vietnamese-malta-plant",
    "description": {
      "en": "Ever-bearing grafted Vietnamese sweet Malta citrus plant. Highly productive, sweet and juicy, suitable for rooftop drum cultivation.",
      "bn": "সারাবছর ফলনশীল সুমিষ্ট ও রসালো ভিয়েতনামি মাল্টার কলম চারা। ছাদে বড় টবে বা ড্রামে খুব দ্রুত ফলন দেয়।"
    },
    "price": 320,
    "compare_at_price": 380,
    "stock": 42,
    "image_url": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Vietnamese All-Season Sweet Malta Seedling | Aronyok Plant Nursery",
      "bn": "ভিয়েতনামি বারোমাসি মাল্টা চারা (Vietnamese Malta Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Ever-bearing grafted Vietnamese sweet Malta citrus plant. Highly productive, sweet and juicy, suitable for rooftop drum cultivation.",
      "bn": "সারাবছর ফলনশীল সুমিষ্ট ও রসালো ভিয়েতনামি মাল্টার কলম চারা। ছাদে বড় টবে বা ড্রামে খুব দ্রুত ফলন দেয়।"
    }
  },
  {
    "id": "prod-10",
    "name": {
      "en": "BARI-1 Sweet Malta Citrus Live Plant",
      "bn": "বারি-১ মিষ্টি মাল্টা চারা (BARI-1 Malta Plant)"
    },
    "slug": "bari-1-malta-plant",
    "description": {
      "en": "Authentic BARI-1 variety Malta developed by BARI. Known for its distinct sweet taste, thin peel, and heavy fruiting capacity.",
      "bn": "বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট উদ্ভাবিত জনপ্রিয় বারি-১ মাল্টা। হলুদ-সবুজ রঙের পাতলা খোসা ও প্রচুর রসালো মিষ্টি মাল্টা ধরে।"
    },
    "price": 300,
    "compare_at_price": 360,
    "stock": 43,
    "image_url": "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "BARI-1 Sweet Malta Citrus Live Plant | Aronyok Plant Nursery",
      "bn": "বারি-১ মিষ্টি মাল্টা চারা (BARI-1 Malta Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Authentic BARI-1 variety Malta developed by BARI. Known for its distinct sweet taste, thin peel, and heavy fruiting capacity.",
      "bn": "বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট উদ্ভাবিত জনপ্রিয় বারি-১ মাল্টা। হলুদ-সবুজ রঙের পাতলা খোসা ও প্রচুর রসালো মিষ্টি মাল্টা ধরে।"
    }
  },
  {
    "id": "prod-11",
    "name": {
      "en": "Tropical Low-Chill Apple Live Plant",
      "bn": "উষ্ণমণ্ডলীয় আপেল চারা (Tropical Apple Plant)"
    },
    "slug": "apple-plant",
    "description": {
      "en": "Acclimatized low-chill tropical apple seedling suited for warm subtropical climates. Thrives in containers with regular organic feed.",
      "bn": "বাংলাদেশের আবহাওয়া উপযোগী উষ্ণমণ্ডলীয় জাতের মিষ্টি আপেল চারা। ছাদে বড় টবে সঠিক পরিচর্যায় মিষ্টি আপেল ধরে।"
    },
    "price": 450,
    "compare_at_price": 550,
    "stock": 44,
    "image_url": "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Tropical Low-Chill Apple Live Plant | Aronyok Plant Nursery",
      "bn": "উষ্ণমণ্ডলীয় আপেল চারা (Tropical Apple Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Acclimatized low-chill tropical apple seedling suited for warm subtropical climates. Thrives in containers with regular organic feed.",
      "bn": "বাংলাদেশের আবহাওয়া উপযোগী উষ্ণমণ্ডলীয় জাতের মিষ্টি আপেল চারা। ছাদে বড় টবে সঠিক পরিচর্যায় মিষ্টি আপেল ধরে।"
    }
  },
  {
    "id": "prod-12",
    "name": {
      "en": "Wild Green Olive (Jolpai) Live Seedling",
      "bn": "দেশি টক-মিষ্টি জলপাই চারা (Jolpai Olive Plant)"
    },
    "slug": "jolpai-olive-plant",
    "description": {
      "en": "Native South Asian green olive (Elaeocarpus floribundus) seedling. Excellent for vitamin C and making savory pickles.",
      "bn": "পুষ্টিগুণে ভরপুর ঐতিহ্যবাহী জলপাইয়ের কলম চারা। সুস্বাদু আচার ও চাটনি তৈরিতে বহুল ব্যবহৃত এবং ভিটামিন সি সমৃদ্ধ।"
    },
    "price": 220,
    "compare_at_price": 270,
    "stock": 45,
    "image_url": "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Wild Green Olive (Jolpai) Live Seedling | Aronyok Plant Nursery",
      "bn": "দেশি টক-মিষ্টি জলপাই চারা (Jolpai Olive Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Native South Asian green olive (Elaeocarpus floribundus) seedling. Excellent for vitamin C and making savory pickles.",
      "bn": "পুষ্টিগুণে ভরপুর ঐতিহ্যবাহী জলপাইয়ের কলম চারা। সুস্বাদু আচার ও চাটনি তৈরিতে বহুল ব্যবহৃত এবং ভিটামিন সি সমৃদ্ধ।"
    }
  },
  {
    "id": "prod-13",
    "name": {
      "en": "Velvet Apple (Gaub / Mabolo) Live Seedling",
      "bn": "দেশি মিষ্টি বিলাতি গাব চারা (Velvet Apple / Gaub Plant)"
    },
    "slug": "gaub-velvet-apple-plant",
    "description": {
      "en": "Traditional velvet apple (Diospyros blancoi) plant. Produces aromatic, creamy sweet fruits with velvet-textured skin.",
      "bn": "ঐতিহ্যবাহী লালচে সুস্বাদু বিলাতি গাবের চারা। মখমলের মতো খোসাযুক্ত এবং দারুণ মিষ্টি সুবাসের দেশীয় ফল।"
    },
    "price": 260,
    "compare_at_price": 320,
    "stock": 46,
    "image_url": "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Velvet Apple (Gaub / Mabolo) Live Seedling | Aronyok Plant Nursery",
      "bn": "দেশি মিষ্টি বিলাতি গাব চারা (Velvet Apple / Gaub Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Traditional velvet apple (Diospyros blancoi) plant. Produces aromatic, creamy sweet fruits with velvet-textured skin.",
      "bn": "ঐতিহ্যবাহী লালচে সুস্বাদু বিলাতি গাবের চারা। মখমলের মতো খোসাযুক্ত এবং দারুণ মিষ্টি সুবাসের দেশীয় ফল।"
    }
  },
  {
    "id": "prod-14",
    "name": {
      "en": "Native Black Plum (Jamun) Live Tree Seedling",
      "bn": "দেশি কালো জাম গাছের চারা (Black Plum / Jam Plant)"
    },
    "slug": "deshi-jam-plant",
    "description": {
      "en": "Sturdy native black plum (Syzygium cumini) tree sapling. Prized for its antioxidant-rich purple berries and medicinal benefits.",
      "bn": "আমাদের দেশীয় মিষ্টি কালো জামের স্বাস্থ্যবান চারা। ছায়া প্রদানকারী বৃক্ষ এবং ডায়াবেটিস ও পেটের সমস্যায় অত্যন্ত উপকারী।"
    },
    "price": 200,
    "compare_at_price": 250,
    "stock": 47,
    "image_url": "https://kmxrcebqozxnyoopdhnr.supabase.co/storage/v1/object/public/products/product-1793393663285-images__6_.jpg",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Native Black Plum (Jamun) Live Tree Seedling | Aronyok Plant Nursery",
      "bn": "দেশি কালো জাম গাছের চারা (Black Plum / Jam Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Sturdy native black plum (Syzygium cumini) tree sapling. Prized for its antioxidant-rich purple berries and medicinal benefits.",
      "bn": "আমাদের দেশীয় মিষ্টি কালো জামের স্বাস্থ্যবান চারা। ছায়া প্রদানকারী বৃক্ষ এবং ডায়াবেটিস ও পেটের সমস্যায় অত্যন্ত উপকারী।"
    },
    "sync_git": true,
    "git_message": "Update product \"Native Black Plum (Jamun) Live Tree Seedling\""
  },
  {
    "id": "prod-15",
    "name": {
      "en": "Thai Sweet Apple Jujube (Boroi) Live Plant",
      "bn": "থাই আপেল কুল / বরই কলম চারা (Thai Apple Jujube Plant)"
    },
    "slug": "boroi-jujube-plant",
    "description": {
      "en": "High-yielding grafted Thai apple jujube sapling. Bears large, crisp, sweet fruits within its first year of planting.",
      "bn": "উন্নত জাতের মিষ্টি আপেল কুলের কলম চারা। প্রথম বছর থেকেই প্রচুর বড় সাইজের মিষ্টি বরই ধরে।"
    },
    "price": 250,
    "compare_at_price": 300,
    "stock": 48,
    "image_url": "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Thai Sweet Apple Jujube (Boroi) Live Plant | Aronyok Plant Nursery",
      "bn": "থাই আপেল কুল / বরই কলম চারা (Thai Apple Jujube Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "High-yielding grafted Thai apple jujube sapling. Bears large, crisp, sweet fruits within its first year of planting.",
      "bn": "উন্নত জাতের মিষ্টি আপেল কুলের কলম চারা। প্রথম বছর থেকেই প্রচুর বড় সাইজের মিষ্টি বরই ধরে।"
    }
  },
  {
    "id": "prod-16",
    "name": {
      "en": "Winter Dawn Sweet Strawberry Live Plant",
      "bn": "উইন্টার ডন স্ট্রবেরি চারা (Strawberry Live Plant)"
    },
    "slug": "strawberry-plant",
    "description": {
      "en": "Prolific sweet strawberry plant suited for balcony pots and hanging baskets. Yields vibrant, aromatic crimson berries.",
      "bn": "টবে চাষ উপযোগী উন্নত শীতকালীন মিষ্টি স্ট্রবেরি চারা। লাল টকটকে মিষ্টি স্ট্রবেরি ছাদে বা ব্যালকনিতে খুব সহজেই ফলে।"
    },
    "price": 150,
    "compare_at_price": 180,
    "stock": 49,
    "image_url": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Winter Dawn Sweet Strawberry Live Plant | Aronyok Plant Nursery",
      "bn": "উইন্টার ডন স্ট্রবেরি চারা (Strawberry Live Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Prolific sweet strawberry plant suited for balcony pots and hanging baskets. Yields vibrant, aromatic crimson berries.",
      "bn": "টবে চাষ উপযোগী উন্নত শীতকালীন মিষ্টি স্ট্রবেরি চারা। লাল টকটকে মিষ্টি স্ট্রবেরি ছাদে বা ব্যালকনিতে খুব সহজেই ফলে।"
    }
  },
  {
    "id": "prod-17",
    "name": {
      "en": "Sweet Karonda (Carissa Carandas) Live Plant",
      "bn": "থাই মিষ্টি করমচা চারা (Karonda / Carissa Plant)"
    },
    "slug": "koromcha-karonda-plant",
    "description": {
      "en": "Ornamental and fruiting sweet Karonda shrub. Bears cluster berries that transition from white-pink to ruby red.",
      "bn": "গোলাপি-সাদা রঙের আকর্ষণীয় থাই মিষ্টি করমচার চারা। সুস্বাদু আচার তৈরিতে সেরা এবং দেখতে দারুণ সুন্দর।"
    },
    "price": 220,
    "compare_at_price": 270,
    "stock": 50,
    "image_url": "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Sweet Karonda (Carissa Carandas) Live Plant | Aronyok Plant Nursery",
      "bn": "থাই মিষ্টি করমচা চারা (Karonda / Carissa Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Ornamental and fruiting sweet Karonda shrub. Bears cluster berries that transition from white-pink to ruby red.",
      "bn": "গোলাপি-সাদা রঙের আকর্ষণীয় থাই মিষ্টি করমচার চারা। সুস্বাদু আচার তৈরিতে সেরা এবং দেখতে দারুণ সুন্দর।"
    }
  },
  {
    "id": "prod-18",
    "name": {
      "en": "Aegle Marmelos (Large Sweet Bael) Seedling",
      "bn": "সুস্বাদু মিষ্টি বড় বেল চারা (Large Sweet Bael Plant)"
    },
    "slug": "borobel-bael-plant",
    "description": {
      "en": "Sacred sweet Golden Bael (Aegle marmelos) plant. Renowned for gut health, cooling beverages, and medicinal goodness.",
      "bn": "পেটের পীড়ায় মহৌষধ হিসেবে পরিচিত মিষ্টি সুগন্ধি বড় বেলের চারা। এর সরবত শরীর ঠাণ্ডা রাখে ও হজমশক্তি বাড়ায়।"
    },
    "price": 240,
    "compare_at_price": 300,
    "stock": 51,
    "image_url": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Aegle Marmelos (Large Sweet Bael) Seedling | Aronyok Plant Nursery",
      "bn": "সুস্বাদু মিষ্টি বড় বেল চারা (Large Sweet Bael Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Sacred sweet Golden Bael (Aegle marmelos) plant. Renowned for gut health, cooling beverages, and medicinal goodness.",
      "bn": "পেটের পীড়ায় মহৌষধ হিসেবে পরিচিত মিষ্টি সুগন্ধি বড় বেলের চারা। এর সরবত শরীর ঠাণ্ডা রাখে ও হজমশক্তি বাড়ায়।"
    }
  },
  {
    "id": "prod-19",
    "name": {
      "en": "Thai Golden-8 Sweet Guava Grafted Plant",
      "bn": "থাই গোল্ডেন-৮ পেয়ারা কলম চারা (Golden Guava Plant)"
    },
    "slug": "golden-peyara-guava-plant",
    "description": {
      "en": "Grafted Thai Golden-8 guava plant with crisp sweet flesh and few seeds. Produces abundantly year-round in pots.",
      "bn": "বীজ কম ও মিষ্টি সুস্বাদু থাই গোল্ডেন পেয়ারার কলম চারা। সারাবছর টবে বা বাগানে প্রচুর পেয়ারা ধরে।"
    },
    "price": 260,
    "compare_at_price": 320,
    "stock": 52,
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Thai Golden-8 Sweet Guava Grafted Plant | Aronyok Plant Nursery",
      "bn": "থাই গোল্ডেন-৮ পেয়ারা কলম চারা (Golden Guava Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Grafted Thai Golden-8 guava plant with crisp sweet flesh and few seeds. Produces abundantly year-round in pots.",
      "bn": "বীজ কম ও মিষ্টি সুস্বাদু থাই গোল্ডেন পেয়ারার কলম চারা। সারাবছর টবে বা বাগানে প্রচুর পেয়ারা ধরে।"
    }
  },
  {
    "id": "prod-20",
    "name": {
      "en": "All-Season Dwarf Hog Plum (Amra) Live Plant",
      "bn": "বারোমাসি মিষ্টি থাই আমড়া চারা (Hog Plum / Amra Plant)"
    },
    "slug": "amra-hog-plum-plant",
    "description": {
      "en": "Ever-bearing dwarf hog plum (Spondias mombin) plant. Clusters of tangy-sweet crunchy fruits grow readily on compact plants.",
      "bn": "বারোমাসি থাই আমড়ার বামন জাতের কলম চারা। ছোট গাছেই প্রচুর রসালো আমড়া থোকায় থোকায় ধরে।"
    },
    "price": 230,
    "compare_at_price": 280,
    "stock": 53,
    "image_url": "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "All-Season Dwarf Hog Plum (Amra) Live Plant | Aronyok Plant Nursery",
      "bn": "বারোমাসি মিষ্টি থাই আমড়া চারা (Hog Plum / Amra Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Ever-bearing dwarf hog plum (Spondias mombin) plant. Clusters of tangy-sweet crunchy fruits grow readily on compact plants.",
      "bn": "বারোমাসি থাই আমড়ার বামন জাতের কলম চারা। ছোট গাছেই প্রচুর রসালো আমড়া থোকায় থোকায় ধরে।"
    }
  },
  {
    "id": "prod-21",
    "name": {
      "en": "Sweet Burmese Grape (Lotkon) Live Seedling",
      "bn": "নরসিংদীর সুমিষ্ট লটকন চারা (Burmese Grape / Lotkon)"
    },
    "slug": "lotkon-burmese-grape-plant",
    "description": {
      "en": "Famous sweet Narsingdi Lotkon (Baccaurea ramiflora) sapling. Unique trunk-fruiting habit packed with vitamin C.",
      "bn": "নরসিংদীর বিখ্যাত মিষ্টি রসালো লটকনের চারা। কাণ্ডের চারপাশে থোকায় থোকায় ফল ধরে, যা ভিটামিন সি তে ভরপুর।"
    },
    "price": 250,
    "compare_at_price": 300,
    "stock": 54,
    "image_url": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Sweet Burmese Grape (Lotkon) Live Seedling | Aronyok Plant Nursery",
      "bn": "নরসিংদীর সুমিষ্ট লটকন চারা (Burmese Grape / Lotkon) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Famous sweet Narsingdi Lotkon (Baccaurea ramiflora) sapling. Unique trunk-fruiting habit packed with vitamin C.",
      "bn": "নরসিংদীর বিখ্যাত মিষ্টি রসালো লটকনের চারা। কাণ্ডের চারপাশে থোকায় থোকায় ফল ধরে, যা ভিটামিন সি তে ভরপুর।"
    }
  },
  {
    "id": "prod-22",
    "name": {
      "en": "All-Season Sweet Sapodilla (Chikoo / Sobeda) Plant",
      "bn": "বারোমাসি থাই সবেদা কলম চারা (Sapodilla / Sobeda)"
    },
    "slug": "sobeda-sapodilla-plant",
    "description": {
      "en": "Sweet honey-flavored grafted Sapodilla (Manilkara zapota) tree. Consistent all-season bearer suitable for rooftop containers.",
      "bn": "মধু মিষ্টি বারোমাসি সবেদার কলম করা চারা। টবে খুব সুন্দর বাড়ে এবং সারাবছর নিয়মিত ফলন পাওয়া যায়।"
    },
    "price": 280,
    "compare_at_price": 340,
    "stock": 55,
    "image_url": "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "All-Season Sweet Sapodilla (Chikoo / Sobeda) Plant | Aronyok Plant Nursery",
      "bn": "বারোমাসি থাই সবেদা কলম চারা (Sapodilla / Sobeda) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Sweet honey-flavored grafted Sapodilla (Manilkara zapota) tree. Consistent all-season bearer suitable for rooftop containers.",
      "bn": "মধু মিষ্টি বারোমাসি সবেদার কলম করা চারা। টবে খুব সুন্দর বাড়ে এবং সারাবছর নিয়মিত ফলন পাওয়া যায়।"
    }
  },
  {
    "id": "prod-23",
    "name": {
      "en": "Elephant Apple (Chalta) Live Tree Plant",
      "bn": "দেশি টক-মিষ্টি চালতা চারা (Elephant Apple / Chalta)"
    },
    "slug": "chalta-elephant-apple-plant",
    "description": {
      "en": "Traditional Dillenia indica (Elephant Apple) plant with large fragrant blossoms. Celebrated for culinary delicacies and scalp tonics.",
      "bn": "সুন্দর সুগন্ধি বড় ফুল ও আচারের উপযোগী ঐতিহ্যবাহী চালতার চারা। চুল পড়া রোধ ও পেটের সমস্যা দূর করতে অত্যন্ত উপকারী।"
    },
    "price": 220,
    "compare_at_price": 270,
    "stock": 56,
    "image_url": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Elephant Apple (Chalta) Live Tree Plant | Aronyok Plant Nursery",
      "bn": "দেশি টক-মিষ্টি চালতা চারা (Elephant Apple / Chalta) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Traditional Dillenia indica (Elephant Apple) plant with large fragrant blossoms. Celebrated for culinary delicacies and scalp tonics.",
      "bn": "সুন্দর সুগন্ধি বড় ফুল ও আচারের উপযোগী ঐতিহ্যবাহী চালতার চারা। চুল পড়া রোধ ও পেটের সমস্যা দূর করতে অত্যন্ত উপকারী।"
    }
  },
  {
    "id": "prod-24",
    "name": {
      "en": "Red Dwarf Ixora (Rangan) Flowering Shrub",
      "bn": "লাল থোকা রঙ্গন ফুলের চারা (Red Ixora / Rangan Plant)"
    },
    "slug": "rangan-ixora-plant",
    "description": {
      "en": "Evergreen dwarf Ixora coccinea shrub with vibrant clusters of fiery red blossoms. Perfect for sunny balconies and garden borders.",
      "bn": "গাঢ় লাল রঙের থোকা রঙ্গন ফুলের চারা। বারান্দার টব বা বাগানের সীমানায় সারা বছর আকর্ষণীয় রঙিন ফুল ফোটায়।"
    },
    "price": 160,
    "compare_at_price": 200,
    "stock": 57,
    "image_url": "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Red Dwarf Ixora (Rangan) Flowering Shrub | Aronyok Plant Nursery",
      "bn": "লাল থোকা রঙ্গন ফুলের চারা (Red Ixora / Rangan Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Evergreen dwarf Ixora coccinea shrub with vibrant clusters of fiery red blossoms. Perfect for sunny balconies and garden borders.",
      "bn": "গাঢ় লাল রঙের থোকা রঙ্গন ফুলের চারা। বারান্দার টব বা বাগানের সীমানায় সারা বছর আকর্ষণীয় রঙিন ফুল ফোটায়।"
    }
  },
  {
    "id": "prod-25",
    "name": {
      "en": "Katimon All-Season Sweet Mango Grafted Plant",
      "bn": "কাটিমন বারোমাসি মিষ্টি আম চারা (Katimon Mango Plant)"
    },
    "slug": "katimon-mango-plant",
    "description": {
      "en": "Renowned Thai Katimon all-season mango graft. Yields exceptionally sweet, fiberless mangoes up to 3 times a year in pots.",
      "bn": "বছরে ৩ বার মিষ্টি আম উৎপাদনকারী বিখ্যাত থাই কাটিমন জাতের কলম চারা। ছাদে ড্রামে চাষের জন্য এক নম্বর পছন্দ।"
    },
    "price": 380,
    "compare_at_price": 450,
    "stock": 58,
    "image_url": "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Katimon All-Season Sweet Mango Grafted Plant | Aronyok Plant Nursery",
      "bn": "কাটিমন বারোমাসি মিষ্টি আম চারা (Katimon Mango Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Renowned Thai Katimon all-season mango graft. Yields exceptionally sweet, fiberless mangoes up to 3 times a year in pots.",
      "bn": "বছরে ৩ বার মিষ্টি আম উৎপাদনকারী বিখ্যাত থাই কাটিমন জাতের কলম চারা। ছাদে ড্রামে চাষের জন্য এক নম্বর পছন্দ।"
    }
  },
  {
    "id": "prod-26",
    "name": {
      "en": "Vietnamese Dwarf Coconut (Dwarf Narkel) Live Plant",
      "bn": "ভিয়েতনামি খাটো জাতের নারিকেল চারা (Dwarf Coconut Plant)"
    },
    "slug": "narikel-coconut-plant",
    "description": {
      "en": "High-producing dwarf coconut palm. Bears sweet tender water coconuts within 3-4 years at easily accessible low heights.",
      "bn": "দ্রুত ফলনশীল খাটো জাতের ভিয়েতনামি নারিকেল চারা। মাত্র ৩-৪ বছরেই মাটি থেকে হাত দিয়ে নারিকেল ও ডাব পাড়া যায়।"
    },
    "price": 480,
    "compare_at_price": 580,
    "stock": 59,
    "image_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Vietnamese Dwarf Coconut (Dwarf Narkel) Live Plant | Aronyok Plant Nursery",
      "bn": "ভিয়েতনামি খাটো জাতের নারিকেল চারা (Dwarf Coconut Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "High-producing dwarf coconut palm. Bears sweet tender water coconuts within 3-4 years at easily accessible low heights.",
      "bn": "দ্রুত ফলনশীল খাটো জাতের ভিয়েতনামি নারিকেল চারা। মাত্র ৩-৪ বছরেই মাটি থেকে হাত দিয়ে নারিকেল ও ডাব পাড়া যায়।"
    }
  },
  {
    "id": "prod-27",
    "name": {
      "en": "Aromatic Green Cardamom (Elachi) Live Plant",
      "bn": "সবুজ সুগন্ধি এলাচ গাছের চারা (Green Cardamom Plant)"
    },
    "slug": "elachi-cardamom-plant",
    "description": {
      "en": "True Green Cardamom (Elettaria cardamomum) seedling. Thrives in semi-shade and moist rich soil, emitting heavenly fragrance.",
      "bn": "মসলার রানী হিসেবে খ্যাত সুগন্ধি সবুজ এলাচের চারা। ছায়াযুক্ত আর্দ্র স্থানে খুব ভালো বাড়ে এবং মিষ্টি সুবাস ছড়ায়।"
    },
    "price": 320,
    "compare_at_price": 400,
    "stock": 60,
    "image_url": "https://images.unsplash.com/photo-1457530378978-8bac673b8062?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Aromatic Green Cardamom (Elachi) Live Plant | Aronyok Plant Nursery",
      "bn": "সবুজ সুগন্ধি এলাচ গাছের চারা (Green Cardamom Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "True Green Cardamom (Elettaria cardamomum) seedling. Thrives in semi-shade and moist rich soil, emitting heavenly fragrance.",
      "bn": "মসলার রানী হিসেবে খ্যাত সুগন্ধি সবুজ এলাচের চারা। ছায়াযুক্ত আর্দ্র স্থানে খুব ভালো বাড়ে এবং মিষ্টি সুবাস ছড়ায়।"
    }
  },
  {
    "id": "prod-28",
    "name": {
      "en": "Sweet Thai Longan (Kat Lichu / Dragon Eye) Plant",
      "bn": "মিষ্টি থাই কাটলিচু / আঁশফল চারা (Thai Longan Plant)"
    },
    "slug": "katlichu-longan-plant",
    "description": {
      "en": "Juicy sweet Thai Longan (Dimocarpus longan) grafted tree. Produces dense clusters of translucent sweet fruit resembling lychee.",
      "bn": "লিচুর মতো সুস্বাদু মিষ্টি থাই কাটলিচুর কলম চারা। খোসা ছাড়িয়ে সহজে খাওয়া যায় এবং গাছে প্রচুর ফলন হয়।"
    },
    "price": 350,
    "compare_at_price": 420,
    "stock": 61,
    "image_url": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Sweet Thai Longan (Kat Lichu / Dragon Eye) Plant | Aronyok Plant Nursery",
      "bn": "মিষ্টি থাই কাটলিচু / আঁশফল চারা (Thai Longan Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Juicy sweet Thai Longan (Dimocarpus longan) grafted tree. Produces dense clusters of translucent sweet fruit resembling lychee.",
      "bn": "লিচুর মতো সুস্বাদু মিষ্টি থাই কাটলিচুর কলম চারা। খোসা ছাড়িয়ে সহজে খাওয়া যায় এবং গাছে প্রচুর ফলন হয়।"
    }
  },
  {
    "id": "prod-29",
    "name": {
      "en": "Mini Dwarf Crepe Jasmine (Mini Togor) Live Plant",
      "bn": "সাদা মিনি টগর ফুলের চারা (Mini Crepe Jasmine)"
    },
    "slug": "mini-togor-jasmine-plant",
    "description": {
      "en": "Dwarf Crepe Jasmine (Tabernaemontana divaricata) with delicate pinwheel white flowers. Compact growth ideal for table and balcony pots.",
      "bn": "স্নো-হোয়াইট থোকা মিনি টগরের চারা। ছোট টবে সারা বছর প্রচুর সাদা স্নিগ্ধ ফুল ফোটে এবং দেখতে দারুণ পরিপাটি লাগে।"
    },
    "price": 140,
    "compare_at_price": 180,
    "stock": 62,
    "image_url": "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Mini Dwarf Crepe Jasmine (Mini Togor) Live Plant | Aronyok Plant Nursery",
      "bn": "সাদা মিনি টগর ফুলের চারা (Mini Crepe Jasmine) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Dwarf Crepe Jasmine (Tabernaemontana divaricata) with delicate pinwheel white flowers. Compact growth ideal for table and balcony pots.",
      "bn": "স্নো-হোয়াইট থোকা মিনি টগরের চারা। ছোট টবে সারা বছর প্রচুর সাদা স্নিগ্ধ ফুল ফোটে এবং দেখতে দারুণ পরিপাটি লাগে।"
    }
  },
  {
    "id": "prod-30",
    "name": {
      "en": "Aromatic Wood Apple (Kodbel) Live Sapling",
      "bn": "মিষ্টি সুবাসিত কদবেল চারা (Wood Apple / Kodbel)"
    },
    "slug": "kodbel-wood-apple-plant",
    "description": {
      "en": "Native Feronia limonia (Wood Apple) sapling. Highly valued for flavorful tangy-sweet mashes and digestive tonic properties.",
      "bn": "টক-ঝাল-মিষ্টি ভর্তা তৈরির প্রিয় ফল কদবেলের কলম চারা। পেটের সুস্থতা ও হজম রস বাড়াতে দারুণ কার্যকর।"
    },
    "price": 240,
    "compare_at_price": 290,
    "stock": 63,
    "image_url": "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Aromatic Wood Apple (Kodbel) Live Sapling | Aronyok Plant Nursery",
      "bn": "মিষ্টি সুবাসিত কদবেল চারা (Wood Apple / Kodbel) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Native Feronia limonia (Wood Apple) sapling. Highly valued for flavorful tangy-sweet mashes and digestive tonic properties.",
      "bn": "টক-ঝাল-মিষ্টি ভর্তা তৈরির প্রিয় ফল কদবেলের কলম চারা। পেটের সুস্থতা ও হজম রস বাড়াতে দারুণ কার্যকর।"
    }
  },
  {
    "id": "prod-31",
    "name": {
      "en": "Russian Baikonur Sweet Table Grape Vine Plant",
      "bn": "রাশিয়ান বাইকনুর মিষ্টি আঙ্গুর চারা (Baikonur Grape Plant)"
    },
    "slug": "baikonur-grape-plant",
    "description": {
      "en": "Celebrated cold-hardy and heat-tolerant Baikonur dark purple table grape vine. Bears massive, sweet, crunchy elongated berries.",
      "bn": "লম্বাটে মিষ্টি কালো আঙ্গুরের বিশ্বখ্যাত রাশিয়ান বাইকনুর জাত। বাংলাদেশের গরমেও ছাদে মাচায় চমৎকার ফলন দেয়।"
    },
    "price": 420,
    "compare_at_price": 500,
    "stock": 64,
    "image_url": "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Russian Baikonur Sweet Table Grape Vine Plant | Aronyok Plant Nursery",
      "bn": "রাশিয়ান বাইকনুর মিষ্টি আঙ্গুর চারা (Baikonur Grape Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Celebrated cold-hardy and heat-tolerant Baikonur dark purple table grape vine. Bears massive, sweet, crunchy elongated berries.",
      "bn": "লম্বাটে মিষ্টি কালো আঙ্গুরের বিশ্বখ্যাত রাশিয়ান বাইকনুর জাত। বাংলাদেশের গরমেও ছাদে মাচায় চমৎকার ফলন দেয়।"
    }
  },
  {
    "id": "prod-32",
    "name": {
      "en": "Native Acclimatized Green Grape Live Vine",
      "bn": "দেশি সবুজ আঙ্গুর লতা চারা (Native Grape Vine Plant)"
    },
    "slug": "deshi-grape-plant",
    "description": {
      "en": "Robust acclimatized green grape vine. Vigorous climber producing refreshing clusters while providing lush canopy shade.",
      "bn": "বাংলাদেশের আবহাওয়া উপযোগী সবল দেশি আঙ্গুর লতা। ছাদের মাচায় বা গ্রিলে খুব দ্রুত সবুজ শামিয়ানা তৈরি করে।"
    },
    "price": 260,
    "compare_at_price": 320,
    "stock": 40,
    "image_url": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Native Acclimatized Green Grape Live Vine | Aronyok Plant Nursery",
      "bn": "দেশি সবুজ আঙ্গুর লতা চারা (Native Grape Vine Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Robust acclimatized green grape vine. Vigorous climber producing refreshing clusters while providing lush canopy shade.",
      "bn": "বাংলাদেশের আবহাওয়া উপযোগী সবল দেশি আঙ্গুর লতা। ছাদের মাচায় বা গ্রিলে খুব দ্রুত সবুজ শামিয়ানা তৈরি করে।"
    }
  },
  {
    "id": "prod-33",
    "name": {
      "en": "Sweet Sugar Apple (Shorifa / Annona Squamosa) Plant",
      "bn": "থাই মিষ্টি আতা / শরীফা চারা (Thai Sugar Apple / Shorifa)"
    },
    "slug": "shorifa-sugar-apple-plant",
    "description": {
      "en": "Sweet custard-like Sugar Apple (Annona squamosa) plant. Compact tree producing succulent segmented fruits rich in dietary fiber.",
      "bn": "ক্রিমি মিষ্টি থাই জাতের শরীফা বা আতা ফলের চারা। ছাদে বড় টবে অল্প পরিচর্যাতেই দারুণ মিষ্টি ফল দেয়।"
    },
    "price": 290,
    "compare_at_price": 350,
    "stock": 41,
    "image_url": "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Sweet Sugar Apple (Shorifa / Annona Squamosa) Plant | Aronyok Plant Nursery",
      "bn": "থাই মিষ্টি আতা / শরীফা চারা (Thai Sugar Apple / Shorifa) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Sweet custard-like Sugar Apple (Annona squamosa) plant. Compact tree producing succulent segmented fruits rich in dietary fiber.",
      "bn": "ক্রিমি মিষ্টি থাই জাতের শরীফা বা আতা ফলের চারা। ছাদে বড় টবে অল্প পরিচর্যাতেই দারুণ মিষ্টি ফল দেয়।"
    }
  },
  {
    "id": "prod-34",
    "name": {
      "en": "Fragrant White-Yellow Plumeria (Kathgolap) Shrub",
      "bn": "সুগন্ধি সাদা-হলুদ কাঠগোলাপ চারা (Kathgolap / Plumeria)"
    },
    "slug": "kathgolap-plumeria-plant",
    "description": {
      "en": "Aromatic Plumeria rubra (Frangipani) plant. Features velvety fragrant ivory petals with sunny golden centers; exceptionally drought-tolerant.",
      "bn": "অপূর্ব সুবাস ও স্নিগ্ধ সাদা-হলুদ রঙের কাঠগোলাপের চারা। কম পানিতেও চমৎকার বাঁচে এবং ছাদে দারুণ আভিজাত্য আনে।"
    },
    "price": 220,
    "compare_at_price": 280,
    "stock": 42,
    "image_url": "https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Fragrant White-Yellow Plumeria (Kathgolap) Shrub | Aronyok Plant Nursery",
      "bn": "সুগন্ধি সাদা-হলুদ কাঠগোলাপ চারা (Kathgolap / Plumeria) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Aromatic Plumeria rubra (Frangipani) plant. Features velvety fragrant ivory petals with sunny golden centers; exceptionally drought-tolerant.",
      "bn": "অপূর্ব সুবাস ও স্নিগ্ধ সাদা-হলুদ রঙের কাঠগোলাপের চারা। কম পানিতেও চমৎকার বাঁচে এবং ছাদে দারুণ আভিজাত্য আনে।"
    }
  },
  {
    "id": "prod-35",
    "name": {
      "en": "Exotic Pink Flesh Jackfruit Live Grafted Plant",
      "bn": "গোলাপি কোয়ার পিঙ্ক কাঁঠাল চারা (Pink Jackfruit Plant)"
    },
    "slug": "pink-kanthal-jackfruit-plant",
    "description": {
      "en": "Rare grafted Pink Jackfruit (Artocarpus heterophyllus) tree. Produces exquisite rose-pink pods with rich honey sweetness.",
      "bn": "বিরল ও আকর্ষণীয় লালচে-গোলাপি কোয়ার মিষ্টি পিঙ্ক কাঁঠালের কলম চারা। দেখতে যেমন সুন্দর, খেতেও তেমনি সুমিষ্ট।"
    },
    "price": 480,
    "compare_at_price": 600,
    "stock": 43,
    "image_url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Exotic Pink Flesh Jackfruit Live Grafted Plant | Aronyok Plant Nursery",
      "bn": "গোলাপি কোয়ার পিঙ্ক কাঁঠাল চারা (Pink Jackfruit Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Rare grafted Pink Jackfruit (Artocarpus heterophyllus) tree. Produces exquisite rose-pink pods with rich honey sweetness.",
      "bn": "বিরল ও আকর্ষণীয় লালচে-গোলাপি কোয়ার মিষ্টি পিঙ্ক কাঁঠালের কলম চারা। দেখতে যেমন সুন্দর, খেতেও তেমনি সুমিষ্ট।"
    }
  },
  {
    "id": "prod-36",
    "name": {
      "en": "Black Stone Exotic Sweet Mango Live Grafted Plant",
      "bn": "ব্ল্যাকস্টোন মিষ্টি আম কলম চারা (Black Stone Mango Plant)"
    },
    "slug": "blackstone-mango-plant",
    "description": {
      "en": "Prized Black Stone exotic mango variety featuring deep dark purple skin and intensely sweet, fragrant golden pulp.",
      "bn": "অনন্য কালো-বেগুনী রঙের বহিরাবরণ ও সুমিষ্ট হলুদ আঁশের ব্ল্যাকস্টোন জাতের আম চারা। ছাদবাগানে ফলনের এক অনন্য আকর্ষণ।"
    },
    "price": 490,
    "compare_at_price": 600,
    "stock": 44,
    "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Black Stone Exotic Sweet Mango Live Grafted Plant | Aronyok Plant Nursery",
      "bn": "ব্ল্যাকস্টোন মিষ্টি আম কলম চারা (Black Stone Mango Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Prized Black Stone exotic mango variety featuring deep dark purple skin and intensely sweet, fragrant golden pulp.",
      "bn": "অনন্য কালো-বেগুনী রঙের বহিরাবরণ ও সুমিষ্ট হলুদ আঁশের ব্ল্যাকস্টোন জাতের আম চারা। ছাদবাগানে ফলনের এক অনন্য আকর্ষণ।"
    }
  },
  {
    "id": "prod-37",
    "name": {
      "en": "Darjeeling Sweet Mandarin Orange Live Plant",
      "bn": "দার্জিলিং মিষ্টি কমলা কলম চারা (Darjeeling Orange Plant)"
    },
    "slug": "komola-darjeeling-orange-plant",
    "description": {
      "en": "Prolific sweet Darjeeling Mandarin orange plant. Loose easy-peel rinds and aromatic juicy segments thrive in pots.",
      "bn": "সহজে খোসা ছাড়ানো মিষ্টি রসালো দার্জিলিং জাতের কমলার কলম চারা। শীতে সোনালী কমলায় ভরে ওঠে পুরো গাছ।"
    },
    "price": 340,
    "compare_at_price": 420,
    "stock": 45,
    "image_url": "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Darjeeling Sweet Mandarin Orange Live Plant | Aronyok Plant Nursery",
      "bn": "দার্জিলিং মিষ্টি কমলা কলম চারা (Darjeeling Orange Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Prolific sweet Darjeeling Mandarin orange plant. Loose easy-peel rinds and aromatic juicy segments thrive in pots.",
      "bn": "সহজে খোসা ছাড়ানো মিষ্টি রসালো দার্জিলিং জাতের কমলার কলম চারা। শীতে সোনালী কমলায় ভরে ওঠে পুরো গাছ।"
    }
  },
  {
    "id": "prod-38",
    "name": {
      "en": "Alubukhara (Sweet Persian Plum / Prune) Live Plant",
      "bn": "মিষ্টি পোলাও ও আচারের আলুবোখারা চারা (Alubukhara Plant)"
    },
    "slug": "alubokhars-plum-plant",
    "description": {
      "en": "Culinary favorite Alubukhara (Prunus domestica) plum plant. Bears deep purple stone fruits celebrated in gourmet rice dishes and preserves.",
      "bn": "বিরিয়ানি, রোস্ট ও আচারের অপরিহার্য উপাদান মিষ্টি আলুবোখারার কলম চারা। টবে রোপণের ২ বছরেই ফলন দিতে শুরু করে।"
    },
    "price": 380,
    "compare_at_price": 460,
    "stock": 46,
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Alubukhara (Sweet Persian Plum / Prune) Live Plant | Aronyok Plant Nursery",
      "bn": "মিষ্টি পোলাও ও আচারের আলুবোখারা চারা (Alubukhara Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Culinary favorite Alubukhara (Prunus domestica) plum plant. Bears deep purple stone fruits celebrated in gourmet rice dishes and preserves.",
      "bn": "বিরিয়ানি, রোস্ট ও আচারের অপরিহার্য উপাদান মিষ্টি আলুবোখারার কলম চারা। টবে রোপণের ২ বছরেই ফলন দিতে শুরু করে।"
    }
  },
  {
    "id": "prod-39",
    "name": {
      "en": "Golden Pothos (Air Purifying Money Plant) Live Pot",
      "bn": "গোল্ডেন মানি প্ল্যান্ট ইনডোর লতা (Golden Money Plant)"
    },
    "slug": "golden-money-plant",
    "description": {
      "en": "Hardy Golden Pothos (Epipremnum aureum). Renowned NASA-certified indoor air purifier that flourishes in low light and water.",
      "bn": "বাতাস বিশুদ্ধকারী উজ্জ্বল সবুজ পাতার গোল্ডেন মানি প্ল্যান্ট। ঘর বা অফিসের ইনডোরে স্বল্প আলো ও পানিতেও সতেজ থাকে।"
    },
    "price": 150,
    "compare_at_price": 190,
    "stock": 47,
    "image_url": "https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Golden Pothos (Air Purifying Money Plant) Live Pot | Aronyok Plant Nursery",
      "bn": "গোল্ডেন মানি প্ল্যান্ট ইনডোর লতা (Golden Money Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Hardy Golden Pothos (Epipremnum aureum). Renowned NASA-certified indoor air purifier that flourishes in low light and water.",
      "bn": "বাতাস বিশুদ্ধকারী উজ্জ্বল সবুজ পাতার গোল্ডেন মানি প্ল্যান্ট। ঘর বা অফিসের ইনডোরে স্বল্প আলো ও পানিতেও সতেজ থাকে।"
    }
  },
  {
    "id": "prod-40",
    "name": {
      "en": "Aglaonema Lipstick (Chinese Evergreen) Indoor Plant",
      "bn": "অ্যাগলোনিমা লিপস্টিক ইনডোর প্ল্যান্ট (Indoor Foliage Plant)"
    },
    "slug": "indoor-aglaonema-foliage-plant",
    "description": {
      "en": "Lush Aglaonema with striking pink-edged emerald foliage. Low-maintenance air purifier that brightens living rooms and workspaces.",
      "bn": "গোলাপি ও সবুজ রঙের রঙিন পাতার প্রিমিয়াম ইনডোর প্ল্যান্ট। ড্রয়িং রুম বা ডেস্কের সৌন্দর্য বৃদ্ধি করতে দারুণ মানানসই।"
    },
    "price": 260,
    "compare_at_price": 320,
    "stock": 48,
    "image_url": "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Aglaonema Lipstick (Chinese Evergreen) Indoor Plant | Aronyok Plant Nursery",
      "bn": "অ্যাগলোনিমা লিপস্টিক ইনডোর প্ল্যান্ট (Indoor Foliage Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Lush Aglaonema with striking pink-edged emerald foliage. Low-maintenance air purifier that brightens living rooms and workspaces.",
      "bn": "গোলাপি ও সবুজ রঙের রঙিন পাতার প্রিমিয়াম ইনডোর প্ল্যান্ট। ড্রয়িং রুম বা ডেস্কের সৌন্দর্য বৃদ্ধি করতে দারুণ মানানসই।"
    }
  },
  {
    "id": "prod-41",
    "name": {
      "en": "Creeping Fig (Lotabahar / Ficus Pumila) Ornamental Vine",
      "bn": "সবুজ লতাবাহার দেয়াল লতা (Lotabahar / Creeping Fig)"
    },
    "slug": "lotabahar-creeping-fig-plant",
    "description": {
      "en": "Ficus pumila evergreen climbing vine. Climbs vertical trellis and walls with delicate heart-shaped leaves creating a living green wall.",
      "bn": "দেয়াল ও টবের গায়ে সবুজ গালিচা বিছানো সুন্দর লতাবাহার গাছ। কম আলো ও আর্দ্রতায় দ্রুত ছড়িয়ে পড়ে আকর্ষণীয় সবুজ আবরণ তৈরি করে।"
    },
    "price": 130,
    "compare_at_price": 170,
    "stock": 49,
    "image_url": "https://images.unsplash.com/photo-1509783236416-c9ad59bae472?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Creeping Fig (Lotabahar / Ficus Pumila) Ornamental Vine | Aronyok Plant Nursery",
      "bn": "সবুজ লতাবাহার দেয়াল লতা (Lotabahar / Creeping Fig) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Ficus pumila evergreen climbing vine. Climbs vertical trellis and walls with delicate heart-shaped leaves creating a living green wall.",
      "bn": "দেয়াল ও টবের গায়ে সবুজ গালিচা বিছানো সুন্দর লতাবাহার গাছ। কম আলো ও আর্দ্রতায় দ্রুত ছড়িয়ে পড়ে আকর্ষণীয় সবুজ আবরণ তৈরি করে।"
    }
  },
  {
    "id": "prod-42",
    "name": {
      "en": "Mediterranean Sweet Fig (Tin Fol / Anjeer) Live Plant",
      "bn": "পবিত্র ডুমুর / মিষ্টি তিন ফল চারা (Anjeer / Fig Plant)"
    },
    "slug": "tin-fol-fig-anjeer-plant",
    "description": {
      "en": "Revered Ficus carica (Tin Fol / Fig) plant. Yields sweet, nutrient-dense purple-green figs directly on young branches.",
      "bn": "কোরআনে বর্ণিত পবিত্র সুমিষ্ট তিন ফল (আঞ্জির) এর কলম চারা। টবে প্রচুর মিষ্টি ডুমুর ধরে যা পেটের জন্য মহৌষধ।"
    },
    "price": 340,
    "compare_at_price": 420,
    "stock": 50,
    "image_url": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Mediterranean Sweet Fig (Tin Fol / Anjeer) Live Plant | Aronyok Plant Nursery",
      "bn": "পবিত্র ডুমুর / মিষ্টি তিন ফল চারা (Anjeer / Fig Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Revered Ficus carica (Tin Fol / Fig) plant. Yields sweet, nutrient-dense purple-green figs directly on young branches.",
      "bn": "কোরআনে বর্ণিত পবিত্র সুমিষ্ট তিন ফল (আঞ্জির) এর কলম চারা। টবে প্রচুর মিষ্টি ডুমুর ধরে যা পেটের জন্য মহৌষধ।"
    }
  },
  {
    "id": "prod-43",
    "name": {
      "en": "Sansevieria Trifasciata (Snake Plant / Mother-in-Law Tongue)",
      "bn": "স্নেক প্ল্যান্ট - প্রাকৃতিক অক্সিজেন প্ল্যান্ট (Snake Plant)"
    },
    "slug": "snake-plant-sansevieria",
    "description": {
      "en": "Top air-purifying Sansevieria that produces oxygen at night and filters airborne toxins. Virtually indestructible and drought-resistant.",
      "bn": "রাতে অক্সিজেন সরবরাহকারী ও টক্সিন ফিল্টারকারী জনপ্রিয় স্নেক প্ল্যান্ট। পানি খুব কম লাগে এবং শোবার ঘরের জন্য আদর্শ।"
    },
    "price": 180,
    "compare_at_price": 230,
    "stock": 51,
    "image_url": "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "Sansevieria Trifasciata (Snake Plant / Mother-in-Law Tongue) | Aronyok Plant Nursery",
      "bn": "স্নেক প্ল্যান্ট - প্রাকৃতিক অক্সিজেন প্ল্যান্ট (Snake Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Top air-purifying Sansevieria that produces oxygen at night and filters airborne toxins. Virtually indestructible and drought-resistant.",
      "bn": "রাতে অক্সিজেন সরবরাহকারী ও টক্সিন ফিল্টারকারী জনপ্রিয় স্নেক প্ল্যান্ট। পানি খুব কম লাগে এবং শোবার ঘরের জন্য আদর্শ।"
    }
  },
  {
    "id": "prod-44",
    "name": {
      "en": "Crown of Thorns (Euphorbia Milii) Vibrant Red Bloom",
      "bn": "লাল কাটামুকুট ফুল গাছ (Crown of Thorns / Euphorbia)"
    },
    "slug": "katamukut-euphorbia-plant",
    "description": {
      "en": "Euphorbia milii flowering succulent shrub. Features clusters of long-lasting coral-red bracts and excels in intense sunny balconies.",
      "bn": "প্রখর রোদেও সারাবছর লাল টকটকে ফুল ফোটানো কাটামুকুট গাছ। পানি খুব কম লাগে এবং ব্যালকনির জন্য দারুণ উপযোগী।"
    },
    "price": 170,
    "compare_at_price": 220,
    "stock": 52,
    "image_url": "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Crown of Thorns (Euphorbia Milii) Vibrant Red Bloom | Aronyok Plant Nursery",
      "bn": "লাল কাটামুকুট ফুল গাছ (Crown of Thorns / Euphorbia) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Euphorbia milii flowering succulent shrub. Features clusters of long-lasting coral-red bracts and excels in intense sunny balconies.",
      "bn": "প্রখর রোদেও সারাবছর লাল টকটকে ফুল ফোটানো কাটামুকুট গাছ। পানি খুব কম লাগে এবং ব্যালকনির জন্য দারুণ উপযোগী।"
    }
  },
  {
    "id": "prod-45",
    "name": {
      "en": "All-Season Seedless Kagzi Lemon Live Plant",
      "bn": "বারোমাসি কাগজি লেবু কলম চারা (Kagzi Lemon Plant)"
    },
    "slug": "lebu-kagzi-lemon-plant",
    "description": {
      "en": "Fragrant, highly juicy thin-skinned Kagzi lemon plant. Yields constant clusters of refreshing citrus fruit in home containers.",
      "bn": "প্রচুর রস ও তীব্র সুগন্ধযুক্ত বারোমাসি কাগজি লেবুর চারা। টবে প্রচুর লেবু ধরে যা ভিটামিন সি এর প্রতিদিনের জোগান দেয়।"
    },
    "price": 220,
    "compare_at_price": 280,
    "stock": 53,
    "image_url": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": true,
    "seo_title": {
      "en": "All-Season Seedless Kagzi Lemon Live Plant | Aronyok Plant Nursery",
      "bn": "বারোমাসি কাগজি লেবু কলম চারা (Kagzi Lemon Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Fragrant, highly juicy thin-skinned Kagzi lemon plant. Yields constant clusters of refreshing citrus fruit in home containers.",
      "bn": "প্রচুর রস ও তীব্র সুগন্ধযুক্ত বারোমাসি কাগজি লেবুর চারা। টবে প্রচুর লেবু ধরে যা ভিটামিন সি এর প্রতিদিনের জোগান দেয়।"
    }
  },
  {
    "id": "prod-46",
    "name": {
      "en": "Natural Henna (Lawsonia Inermis / Mehendi) Live Shrub",
      "bn": "গাঢ় রঙের দেশি মেহেদি গাছের চারা (Mehendi / Henna Plant)"
    },
    "slug": "mehendi-henna-plant",
    "description": {
      "en": "Authentic Lawsonia inermis (Henna) seedling. Fresh leaves yield dark, organic natural dye for skin ornamentation and scalp conditioning.",
      "bn": "হাত রাঙানো এবং চুলের ভেষজ যত্নের খাঁটি মেহেদি চারা। রাসায়নিকমুক্ত তাজা পাতার প্রাকৃতিক রঙ ও ঠান্ডা অনুভূতি দেয়।"
    },
    "price": 160,
    "compare_at_price": 200,
    "stock": 54,
    "image_url": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Natural Henna (Lawsonia Inermis / Mehendi) Live Shrub | Aronyok Plant Nursery",
      "bn": "গাঢ় রঙের দেশি মেহেদি গাছের চারা (Mehendi / Henna Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Authentic Lawsonia inermis (Henna) seedling. Fresh leaves yield dark, organic natural dye for skin ornamentation and scalp conditioning.",
      "bn": "হাত রাঙানো এবং চুলের ভেষজ যত্নের খাঁটি মেহেদি চারা। রাসায়নিকমুক্ত তাজা পাতার প্রাকৃতিক রঙ ও ঠান্ডা অনুভূতি দেয়।"
    }
  },
  {
    "id": "prod-47",
    "name": {
      "en": "Shatavari (Asparagus Racemosus) Vitality Herb Plant",
      "bn": "ভেষজ শতমূলী ঔষধি চারা (Shatavari / Satamool Plant)"
    },
    "slug": "shatamool-shatavari-plant",
    "description": {
      "en": "Premier Ayurvedic adaptogenic climbing herb (Asparagus racemosus). Revered for hormonal balance, vitality, and cooling rejuvenation.",
      "bn": "আয়ুর্বেদের অন্যতম প্রধান বলবর্ধক ও হরমোন সমতাকারী শতমূলের চারা। সুন্দর কাঁটাযুক্ত পাতা ও শিকড় ভেষজ ওষুধে ব্যবহৃত হয়।"
    },
    "price": 220,
    "compare_at_price": 280,
    "stock": 55,
    "image_url": "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Shatavari (Asparagus Racemosus) Vitality Herb Plant | Aronyok Plant Nursery",
      "bn": "ভেষজ শতমূলী ঔষধি চারা (Shatavari / Satamool Plant) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Premier Ayurvedic adaptogenic climbing herb (Asparagus racemosus). Revered for hormonal balance, vitality, and cooling rejuvenation.",
      "bn": "আয়ুর্বেদের অন্যতম প্রধান বলবর্ধক ও হরমোন সমতাকারী শতমূলের চারা। সুন্দর কাঁটাযুক্ত পাতা ও শিকড় ভেষজ ওষুধে ব্যবহৃত হয়।"
    }
  },
  {
    "id": "prod-48",
    "name": {
      "en": "Areca Palm (Supari / Betel Nut) Slender Seedling",
      "bn": "উন্নত জাতের সুপারি গাছের চারা (Betel Nut / Supari Palm)"
    },
    "slug": "supari-betel-nut-plant",
    "description": {
      "en": "Graceful Areca catechu (Betel Nut Palm) sapling. Adds elegant tropical symmetry while bearing traditional betel nuts.",
      "bn": "ঐতিহ্যবাহী দেশি গোল সুপারি গাছের চারা। বাগানের সীমানায় বা ছাদবাগানে সবুজ পাম গাছের চমৎকার সৌন্দর্য তৈরি করে।"
    },
    "price": 160,
    "compare_at_price": 200,
    "stock": 56,
    "image_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Areca Palm (Supari / Betel Nut) Slender Seedling | Aronyok Plant Nursery",
      "bn": "উন্নত জাতের সুপারি গাছের চারা (Betel Nut / Supari Palm) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Graceful Areca catechu (Betel Nut Palm) sapling. Adds elegant tropical symmetry while bearing traditional betel nuts.",
      "bn": "ঐতিহ্যবাহী দেশি গোল সুপারি গাছের চারা। বাগানের সীমানায় বা ছাদবাগানে সবুজ পাম গাছের চমৎকার সৌন্দর্য তৈরি করে।"
    }
  },
  {
    "id": "prod-49",
    "name": {
      "en": "Black Musli (Curculigo Orchioides / Talmool) Medicinal Plant",
      "bn": "মূল্যবান ঔষধি তালমূল চারা (Talmool / Black Musli)"
    },
    "slug": "talmool-curculigo-plant",
    "description": {
      "en": "Rare Ayurvedic restorative herb (Curculigo orchioides / Kali Musli). Known for stamina tonics, palm-like fronds, and golden blossoms.",
      "bn": "শারীরিক দুর্বলতা ও স্নায়ুর শক্তিবর্ধক বিরল ভেষজ তালমূলের চারা। পামের মতো পাতা ও হলুদ তারা আকৃতির সুন্দর ফুল ফোটে।"
    },
    "price": 260,
    "compare_at_price": 320,
    "stock": 57,
    "image_url": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
    "category": "plants",
    "is_active": true,
    "is_featured": false,
    "seo_title": {
      "en": "Black Musli (Curculigo Orchioides / Talmool) Medicinal Plant | Aronyok Plant Nursery",
      "bn": "মূল্যবান ঔষধি তালমূল চারা (Talmool / Black Musli) | অরণ্যক নার্সারি"
    },
    "seo_description": {
      "en": "Rare Ayurvedic restorative herb (Curculigo orchioides / Kali Musli). Known for stamina tonics, palm-like fronds, and golden blossoms.",
      "bn": "শারীরিক দুর্বলতা ও স্নায়ুর শক্তিবর্ধক বিরল ভেষজ তালমূলের চারা। পামের মতো পাতা ও হলুদ তারা আকৃতির সুন্দর ফুল ফোটে।"
    }
  }
];

export const fallbackBlogPosts: BlogPost[] = [
  {
    "id": "blog-1",
    "title": {
      "en": "7 Miraculous Ayurvedic Herbs Every Household Should Grow",
      "bn": "প্রতিটি ঘরে রোপণ উপযোগী ৭টি অলৌকিক ভেষজ উদ্ভিদ"
    },
    "slug": "7-ayurvedic-herbs-every-household-should-grow",
    "excerpt": {
      "en": "Discover how Tulsi, Neem, Aloe Vera, and Mint can elevate your health and create a green healing oasis at home.",
      "bn": "তুলসী, নিম, ঘৃতকুমারী এবং পুদিনা কীভাবে আপনার ঘরের বাতাস শুদ্ধ করে এবং প্রাকৃতিক চিকিৎসায় সহায়তা করে জানুন।"
    },
    "content": {
      "en": "### Nature as Our First Pharmacy\n\nFor millennia, traditional wellness has looked to the soil for healing. Cultivating herbs indoors or on your urban balcony connects you to the natural rhythms of life.\n\n#### 1. Krishna Tulsi (Holy Basil)\nRevered as the \"Queen of Herbs\", Tulsi strengthens the respiratory tract, lowers stress hormones, and purifies surrounding air.\n\n#### 2. Neem (Indian Lilac)\nThe ultimate defender against microbial threats, neem leaves can be steeped as a tonic or applied topically to calm irritations.\n\n#### 3. Ghritakumari (Aloe Vera)\nNature's moisture miracle, ideal for burns, hydration, and soothing digestion.",
      "bn": "### প্রকৃতির কোলে আরোগ্য সন্ধান\n\nহাজার বছর ধরে ভেষজ উপাদান আমাদের দৈনন্দিন রোগ প্রতিরোধের প্রথম ভরসা। বারান্দায় বা ছাদের এক কোণে কয়েকটি ওষধি গাছ রোপণ করা কেবল সৌন্দর্য বাড়ায় না, সুস্বাস্থ্যও বজায় রাখে।\n\n#### ১. কৃষ্ণ তুলসী\nতুলসীকে বলা হয় ভেষজের রানী। নিয়মিত তুলসী পাতার চা সর্দি-কাশি প্রতিরোধে কার্যকর এবং মানসিক ক্লান্তি কমায়।\n\n#### ২. নিম গাছ\nজীবাণুনাশক হিসেবে নিমের তুলনা নেই। গাছের পোকা দূর করতে বা ত্বকের সুরক্ষায় নিমের ব্যবহার অপরিসীম।\n\n#### ৩. ঘৃতকুমারী (অ্যালোভেরা)\nপ্রাকৃতিক ময়েশ্চারাইজার এবং পেট ঠাণ্ডা রাখার জন্য অ্যালোভেরা অত্যন্ত উপকারী।"
    },
    "image_url": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80",
    "category": "Herbal Living",
    "read_time": "4 min read",
    "status": "published",
    "created_at": "2026-10-25T22:28:53.088Z"
  },
  {
    "id": "blog-2",
    "title": {
      "en": "Urban Balcony Gardening: From Seedling to Harvest",
      "bn": "শহুরে বারান্দায় বাগান: চারা থেকে ফসল তোলার সহজ কৌশল"
    },
    "slug": "urban-balcony-gardening-guide",
    "excerpt": {
      "en": "No yard? No problem. Learn how to optimize sunlight, pick the right terracotta pots, and manage organic soil in small apartments.",
      "bn": "জায়গা কম? সমস্যা নেই। অল্প আলোতে কীভাবে বারান্দায় পুষ্টিকর শাকসবজি ও ভেষজ ফলানো যায় তার বাস্তবসম্মত পরামর্শ।"
    },
    "content": {
      "en": "### Transforming Concrete into Verdant Sanctuaries\n\nUrban spaces often lack greenery, but a single sunny balcony can produce fresh herbs, fragrant blossoms, and calming green views.\n\n- **Sunlight Mapping:** Identify which side of your balcony receives direct morning vs afternoon rays.\n- **Porous Containers:** Choose clay or terracotta pots rather than unbreathable plastic.\n- **Drainage:** Always line bottom drainage holes with broken pottery shards to prevent root rot.",
      "bn": "### ইট-কাঠের খাঁচায় এক টুকরো সবুজ\n\nশহুরে জীবনে এক চিলতে বারান্দাকে সহজেই সাজিয়ে তোলা যায় একটি ছোট্ট সবুজ উদ্যানে।\n\n- **সূর্যালোকের হিসাব:** সকালে রোদ আসে নাকি বিকেলে, সেই অনুযায়ী গাছ নির্বাচন করুন।\n- **মাটির টবের গুরুত্ব:** প্লাস্টিকের চেয়ে মাটির টবে শিকড় সহজে শ্বাস নিতে পারে।\n- **পানি নিষ্কাশন:** টবের নিচে পর্যাপ্ত ছিদ্র নিশ্চিত করুন যাতে পানি জমে শিকড় না পচে।"
    },
    "image_url": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    "category": "Green Living",
    "read_time": "6 min read",
    "status": "published",
    "created_at": "2026-10-25T22:28:53.088Z"
  }
];

export const fallbackDynamicPages: DynamicPage[] = [
  {
    "id": "page-1",
    "page_title": {
      "en": "About Aronyok",
      "bn": "আমাদের সম্পর্কে"
    },
    "slug": "about-us",
    "page_content": {
      "en": "### Welcome to Aronyok (অরণ্যক)\n\nRooted in the ancient riverbeds and verdant forests of Bengal, Aronyok was born out of a desire to rekindle humanity's sacred bond with mother earth. We curate wild, pesticide-free harvests directly from indigenous forest harvesters and organic village artisans.\n\n#### Our Guiding Tenets:\n- **Authenticity:** Zero chemical adulteration, direct farm-to-table sourcing.\n- **Ecological Stewardship:** Biodegradable packaging and carbon-conscious delivery.\n- **Empowerment:** Fair living wages for forest honey hunters and local clay craftspeople.",
      "bn": "### অরণ্যকে আপনাকে স্বাগতম\n\nবাংলার চিরসবুজ প্রকৃতির স্নিগ্ধতা ও ভেষজ ঐতিহ্যের প্রতি গভীর শ্রদ্ধা থেকে অরণ্যকের জন্ম। আমাদের লক্ষ্য রাসায়নিকমুক্ত প্রাকৃতিক জীবনধারাকে সবার নাগালে পৌঁছে দেওয়া।\n\n#### আমাদের মূল দর্শন:\n- **বিশুদ্ধতা:** কোনো কৃত্রিম উপাদান ছাড়া সরাসরি বনাঞ্চল ও কৃষকের থেকে সংগৃহীত।\n- **পরিবেশবান্ধব:** প্লাস্টিকবিহীন প্যাকেজিং ও টেকসই উৎপাদন পদ্ধতি।\n- **সামাজিক দায়বদ্ধতা:** সুন্দরবনের মৌয়াল এবং প্রান্তিক মৃৎশিল্পীদের ন্যায্য অধিকার নিশ্চিতকরণ।"
    },
    "is_published": true,
    "seo_title": {
      "en": "About Aronyok | Nature & Sustainability",
      "bn": "অরণ্যক পরিচিতি | টেকসই জীবন"
    },
    "seo_description": {
      "en": "The story and mission of Aronyok",
      "bn": "অরণ্যকের লক্ষ্য ও পরিচিতি"
    }
  },
  {
    "id": "page-2",
    "page_title": {
      "en": "Sustainability Pledge",
      "bn": "আমাদের টেকসই অঙ্গীকার"
    },
    "slug": "sustainability",
    "page_content": {
      "en": "### Our Eco-Commitment\n\nAt Aronyok, every package sent out uses recycled paper padding, jute twine strings, and terracotta containers wherever possible. We plant 1 native tree seedling for every 10 orders completed.",
      "bn": "### পরিবেশের প্রতি দায়বদ্ধতা\n\nঅরণ্যকের প্রতিটি অর্ডারে আমরা ব্যবহার করি পুনর্ব্যবহারযোগ্য কাগজের বক্স, পাটের সুতলি এবং মাটির পাত্র। এছাড়া প্রতি ১০টি সফল অর্ডারের বিপরীতে আমরা একটি দেশীয় বনজ বা ওষধি চারা রোপণ করি।"
    },
    "is_published": true,
    "seo_title": {
      "en": "Sustainability Pledge | Aronyok",
      "bn": "আমাদের টেকসই অঙ্গীকার | অরণ্যক"
    },
    "seo_description": {
      "en": "How we preserve nature with every order",
      "bn": "পরিবেশ সুরক্ষায় আমাদের প্রতিশ্রুতি"
    }
  }
];

export const fallbackTools: ToolMicroApp[] = [
  {
    "id": "tool-1",
    "tool_name": "Herbal Remedy Explorer",
    "title": {
      "en": "Herbal Remedy Explorer",
      "bn": "ভেষজ নিরাময় নির্দেশক"
    },
    "description": {
      "en": "Search everyday ailments (colds, insomnia, digestion, skin) and get traditional botanical remedies with preparation methods.",
      "bn": "সাধারণ স্বাস্থ্য সমস্যা (সর্দি, অনিদ্রা, হজম, ত্বক) লিখে অনুসন্ধান করুন এবং জানুন সঠিক ভেষজ প্রতিকার ও সেবনবিধি।"
    },
    "endpoint_slug": "herbal-remedy-finder",
    "icon_name": "Sparkles",
    "is_active": true,
    "embed_code_or_config": {
      "type": "interactive_search"
    }
  },
  {
    "id": "tool-2",
    "tool_name": "Plant Sunlight & Water Advisor",
    "title": {
      "en": "Plant Light & Water Advisor",
      "bn": "উদ্ভিদের সূর্যালোক ও পানি ক্যালকুলেটর"
    },
    "description": {
      "en": "Input your plant variety and balcony orientation to get an accurate weekly watering and sun exposure plan.",
      "bn": "আপনার গাছের ধরন ও বারান্দার দিক নির্বাচন করে পান নিখুঁত সেচ ও রোদ পাওয়ার সময়সূচি।"
    },
    "endpoint_slug": "plant-sunlight-advisor",
    "icon_name": "Sun",
    "is_active": true,
    "embed_code_or_config": {
      "type": "calculator"
    }
  },
  {
    "id": "tool-3",
    "tool_name": "Soil & Compost Ratio Mixer",
    "title": {
      "en": "Soil & Compost Ratio Mixer",
      "bn": "মাটির কম্পোস্ট অনুপাত নির্দেশক"
    },
    "description": {
      "en": "Calculate the perfect balance of garden loam, vermicompost, and coco-peat for any pot size.",
      "bn": "টবের আকার অনুযায়ী দোআঁশ মাটি, ভার্মিকম্পোস্ট এবং কোকোপিটের সঠিক অনুপাত নির্ধারণ করুন।"
    },
    "endpoint_slug": "soil-compost-ratio",
    "icon_name": "Sprout",
    "is_active": true,
    "embed_code_or_config": {
      "type": "ratio_calculator"
    }
  }
];
