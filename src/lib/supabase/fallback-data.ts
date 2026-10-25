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
