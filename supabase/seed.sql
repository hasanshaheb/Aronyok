-- ==============================================================================
-- ARONYOK (অরণ্যক) - SEED DATA FOR BILINGUAL STOREFRONT, BLOG, TOOLS, PAGES
-- ==============================================================================

-- 1. SETTINGS ROW
INSERT INTO public.settings (
  id,
  global_seo_title,
  global_seo_description,
  analytics_script,
  ad_banner_top_html,
  ai_system_prompt,
  contact_email,
  contact_phone
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '{"en": "Aronyok | Pure Living, Organic Herbs & Eco Store", "bn": "অরণ্যক | বিশুদ্ধ জীবনধারা, জৈব ভেষজ ও পরিবেশবান্ধব পণ্য"}',
  '{"en": "Explore wild raw honey, cold-pressed oils, medicinal herbs, and artisanal pottery from Bangladesh with Aronyok.", "bn": "অরণ্যকে আবিষ্কার করুন খাঁটি প্রাকৃতিক মধু, ঘানিতে ভাঙা তেল, ওষধি গাছ এবং পরিবেশবান্ধব মাটির সামগ্রী।"}',
  '<!-- Google tag (gtag.js) sample analytics -->',
  '<div class="bg-forest-800 text-cream-100 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2"><span class="bg-forest-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">Spring Eco Sale</span> <span>Enjoy 15% off all medicinal herbs with code <strong>ARONYOKGREEN</strong> 🌱</span></div>',
  'You are Aronyok (অরণ্যক), an intelligent, gentle, and highly knowledgeable nature expert, herbalist, and eco-living guide. You are fluent in both English and Bengali. If the user asks in Bengali, reply warmly in Bengali. If in English, reply in English. Help users identify therapeutic herbs, offer plant care advice, suggest organic solutions, and guide them through our eco products.',
  'hello@aronyok.com',
  '+880 1711 223344'
) ON CONFLICT (id) DO UPDATE SET
  global_seo_title = EXCLUDED.global_seo_title,
  global_seo_description = EXCLUDED.global_seo_description,
  ai_system_prompt = EXCLUDED.ai_system_prompt;

-- 2. PRODUCTS
INSERT INTO public.products (name, slug, description, price, compare_at_price, stock, image_url, category, is_active, is_featured, seo_title, seo_description)
VALUES
(
  '{"en": "Organic Sundarbans Mangrove Raw Honey (500g)", "bn": "সুন্দরবনের প্রাকৃতিক চাকভাঙা খাঁটি মধু (৫০০ গ্রাম)"}',
  'sundarbans-mangrove-raw-honey-500g',
  '{"en": "Harvested ethically by traditional Mawalis from deep Sundarbans mangroves (Khalisa & Keora blooms). 100% raw, unfiltered, and rich in natural antioxidants.", "bn": "সুন্দরবনের গহিন থেকে মৌয়ালদের হাতে সংগ্রহকৃত খলিসা ও কেওড়া ফুলের প্রাকৃতিক চাকভাঙা মধু। কোনো প্রকার প্রক্রিয়াজাতকরণ ছাড়া শতভাগ খাঁটি ও পুষ্টিগুণে ভরপুর।"}',
  850.00,
  950.00,
  60,
  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
  'honey',
  true,
  true,
  '{"en": "Buy Pure Sundarbans Raw Honey Online | Aronyok", "bn": "সুন্দরবনের খাঁটি কাঁচা মধু কিনুন | অরণ্যক"}',
  '{"en": "Unfiltered raw honey harvested directly from the wild mangroves of Sundarbans.", "bn": "সুন্দরবনের প্রাকৃতিক বন থেকে সংগৃহীত শতভাগ খাঁটি কাঁচা মধু।"}'
),
(
  '{"en": "Cold-Pressed Organic Neem Seed Oil (200ml)", "bn": "ঘানিতে ভাঙা খাঁটি নিমের তেল (২০০ মি.লি.)"}',
  'cold-pressed-neem-seed-oil-200ml',
  '{"en": "Pure cold-pressed Azadirachta Indica oil. Highly effective for natural garden pest deterrent and soothing skin & scalp treatments.", "bn": "দেশীয় নিমবীজ থেকে কাঠের ঘানিতে প্রস্তুত বিশুদ্ধ তেল। বাগানের জৈব কীটনাশক হিসেবে এবং ত্বক ও চুলের প্রাকৃতিক যত্নে অনন্য।" }',
  380.00,
  450.00,
  45,
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
  'herbs',
  true,
  true,
  '{"en": "Pure Cold Pressed Neem Oil | Natural Pest & Skin Care", "bn": "ঘানিতে ভাঙা খাঁটি নিম তেল | অরণ্যক"}',
  '{"en": "All-natural cold pressed neem oil for organic gardening and herbal personal care.", "bn": "গাছের যত্ন ও ভেষজ ত্বকের সুরক্ষায় শতভাগ খাঁটি নিম তেল।"}'
),
(
  '{"en": "Artisanal Tulsi & Ashwagandha Herbal Tea (100g)", "bn": "হাতে তৈরি তুলসী ও অশ্বগন্ধা ভেষজ চা (১০০ গ্রাম)"}',
  'tulsi-ashwagandha-herbal-tea-100g',
  '{"en": "A calming, restorative blend of holy basil leaves and wild ashwagandha roots. Promotes deep sleep, eases anxiety, and bolsters innate immunity.", "bn": "কৃষ্ণ তুলসী ও পাহাড়ি অশ্বগন্ধার মেলবন্ধনে তৈরি বিশেষ শান্তিদায়ক ভেষজ চা। মানসিক প্রশান্তি ও দৈনন্দিন ক্লান্তি দূর করতে সহায়ক।" }',
  420.00,
  500.00,
  35,
  'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  'wellness',
  true,
  true,
  '{"en": "Tulsi Ashwagandha Immunity Herbal Tea | Aronyok", "bn": "তুলসী ও অশ্বগন্ধা হারবাল চা | অরণ্যক"}',
  '{"en": "Relaxing organic herbal tea blend with Krishna Tulsi and Ashwagandha.", "bn": "প্রাকৃতিক উপাদানে তৈরি রোগ প্রতিরোধকারী ও মানসিক প্রশান্তিদায়ক হারবাল চা।"}'
),
(
  '{"en": "Handcrafted Terracotta Clay Herb Planter", "bn": "ঐতিহ্যবাহী পোড়ামাটির নান্দনিক ভেষজ টব"}',
  'handcrafted-terracotta-herb-planter',
  '{"en": "Fired with traditional wood-kilns by rural Bengali potters. Breathable natural clay creates optimal root aeration and moisture balance.", "bn": "গ্রাম বাংলার মৃৎশিল্পীদের হাতে গড়া প্রাকৃতিক পোড়ামাটির টব। মাটির প্রাকৃতিক ছিদ্রযুক্ত গঠন গাছের শিকড়ে বাতাস চলাচলে সাহায্য করে।" }',
  290.00,
  350.00,
  80,
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
  'gardening',
  true,
  false,
  '{"en": "Handmade Clay Planters for Plants & Herbs", "bn": "গাছের জন্য পোড়ামাটির নান্দনিক টব"}',
  '{"en": "Porous terracotta planters for healthy root systems.", "bn": "গাছের সুস্থ বৃদ্ধির জন্য প্রাকৃতিক মাটির টব।"}'
),
(
  '{"en": "Krishna Tulsi (Holy Basil) Live Potted Plant", "bn": "কৃষ্ণ তুলসী সতেজ টবসহ চারা গাছ"}',
  'krishna-tulsi-live-potted-plant',
  '{"en": "Vigorous live Krishna Tulsi seedling potted in nutrient-rich organic compost. Known for strong aroma and potent medicinal properties.", "bn": "উন্নত জাতের ঔষধি কৃষ্ণ তুলসীর সতেজ চারা, পুষ্টিকর জৈব মাটিতে টবসহ রোপিত। ঘরের বারান্দা ও ছাদের জন্য উপযুক্ত।" }',
  180.00,
  220.00,
  50,
  'https://images.unsplash.com/photo-1596726694605-648b253b27b4?auto=format&fit=crop&w=800&q=80',
  'plants',
  true,
  true,
  '{"en": "Live Holy Basil Plant Online | Aronyok", "bn": "কৃষ্ণ তুলসীর লাইভ চারা কিনুন | অরণ্যক"}',
  '{"en": "Healthy live Krishna Tulsi plant delivered to your door.", "bn": "ঔষধি গুণসম্পন্ন সতেজ কৃষ্ণ তুলসী চারা।"}'
),
(
  '{"en": "Organic Vermicompost Soil Enrichment (2kg)", "bn": "প্রিমিয়াম প্রাকৃতিক কেঁচো সার - ভার্মিকম্পোস্ট (২ কেজি)"}',
  'organic-vermicompost-2kg',
  '{"en": "100% odourless, slow-release organic earthworm castings packed with beneficial soil microbes and bio-available micro-nutrients.", "bn": "শতভাগ দুর্গন্ধহীন ও জীবাণুমুক্ত জৈব কেঁচো সার। গাছের দ্রুত বৃদ্ধি এবং মাটির উর্বরতা বাড়াতে আদর্শ পুষ্টি উপাদান।" }',
  160.00,
  200.00,
  120,
  'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
  'gardening',
  true,
  false,
  '{"en": "Organic Vermicompost Fertilizer 2kg | Aronyok", "bn": "প্রাকৃতিক ভার্মিকম্পোস্ট জৈব সার | অরণ্যক"}',
  '{"en": "Premium organic vermicompost for potted herbs, vegetables, and flowers.", "bn": "টবের গাছ ও সবজির জন্য সেরা প্রাকৃতিক কেঁচো সার।"}'
);

-- 3. BLOG POSTS
INSERT INTO public.blog_posts (title, slug, excerpt, content, image_url, category, read_time, status)
VALUES
(
  '{"en": "7 Miraculous Ayurvedic Herbs Every Household Should Grow", "bn": "প্রতিটি ঘরে রোপণ উপযোগী ৭টি অলৌকিক ভেষজ উদ্ভিদ"}',
  '7-ayurvedic-herbs-every-household-should-grow',
  '{"en": "Discover how Tulsi, Neem, Aloe Vera, and Mint can elevate your health and create a green healing oasis at home.", "bn": "তুলসী, নিম, ঘৃতকুমারী এবং পুদিনা কীভাবে আপনার ঘরের বাতাস শুদ্ধ করে এবং প্রাকৃতিক চিকিৎসায় সহায়তা করে জানুন।" }',
  '{"en": "### Nature as Our First Pharmacy\n\nFor millennia, traditional wellness has looked to the soil for healing. Cultivating herbs indoors or on your urban balcony connects you to the natural rhythms of life.\n\n#### 1. Krishna Tulsi (Holy Basil)\nRevered as the \"Queen of Herbs\", Tulsi strengthens the respiratory tract, lowers stress hormones, and purifies surrounding air.\n\n#### 2. Neem (Indian Lilac)\nThe ultimate defender against microbial threats, neem leaves can be steeped as a tonic or applied topically to calm irritations.\n\n#### 3. Ghritakumari (Aloe Vera)\nNature''s moisture miracle, ideal for burns, hydration, and soothing digestion.", "bn": "### প্রকৃতির কোলে আরোগ্য সন্ধান\n\nহাজার বছর ধরে ভেষজ উপাদান আমাদের দৈনন্দিন রোগ প্রতিরোধের প্রথম ভরসা। বারান্দায় বা ছাদের এক কোণে কয়েকটি ওষধি গাছ রোপণ করা কেবল সৌন্দর্য বাড়ায় না, সুস্বাস্থ্যও বজায় রাখে।\n\n#### ১. কৃষ্ণ তুলসী\nতুলসীকে বলা হয় ভেষজের রানী। নিয়মিত তুলসী পাতার চা সর্দি-কাশি প্রতিরোধে কার্যকর এবং মানসিক ক্লান্তি কমায়।\n\n#### ২. নিম গাছ\nজীবাণুনাশক হিসেবে নিমের তুলনা নেই। গাছের পোকা দূর করতে বা ত্বকের সুরক্ষায় নিমের ব্যবহার অপরিসীম।\n\n#### ৩. ঘৃতকুমারী (অ্যালোভেরা)\nপ্রাকৃতিক ময়েশ্চারাইজার এবং পেট ঠাণ্ডা রাখার জন্য অ্যালোভেরা অত্যন্ত উপকারী।" }',
  'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
  'Herbal Living',
  '4 min read',
  'published'
),
(
  '{"en": "Urban Balcony Gardening: From Seedling to Harvest", "bn": "শহুরে বারান্দায় বাগান: চারা থেকে ফসল তোলার সহজ কৌশল"}',
  'urban-balcony-gardening-guide',
  '{"en": "No yard? No problem. Learn how to optimize sunlight, pick the right terracotta pots, and manage organic soil in small apartments.", "bn": "জায়গা কম? সমস্যা নেই। অল্প আলোতে কীভাবে বারান্দায় পুষ্টিকর শাকসবজি ও ভেষজ ফলানো যায় তার বাস্তবসম্মত পরামর্শ।" }',
  '{"en": "### Transforming Concrete into Verdant Sanctuaries\n\nUrban spaces often lack greenery, but a single sunny balcony can produce fresh herbs, fragrant blossoms, and calming green views.\n\n- **Sunlight Mapping:** Identify which side of your balcony receives direct morning vs afternoon rays.\n- **Porous Containers:** Choose clay or terracotta pots rather than unbreathable plastic.\n- **Drainage:** Always line bottom drainage holes with broken pottery shards to prevent root rot.", "bn": "### ইট-কাঠের খাঁচায় এক টুকরো সবুজ\n\nশহুরে জীবনে এক চিলতে বারান্দাকে সহজেই সাজিয়ে তোলা যায় একটি ছোট্ট সবুজ উদ্যানে।\n\n- **সূর্যালোকের হিসাব:** সকালে রোদ আসে নাকি বিকেলে, সেই অনুযায়ী গাছ নির্বাচন করুন।\n- **মাটির টবের গুরুত্ব:** প্লাস্টিকের চেয়ে মাটির টবে শিকড় সহজে শ্বাস নিতে পারে।\n- **পানি নিষ্কাশন:** টবের নিচে পর্যাপ্ত ছিদ্র নিশ্চিত করুন যাতে পানি জমে শিকড় না পচে।" }',
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
  'Green Living',
  '6 min read',
  'published'
);

-- 4. DYNAMIC PAGES
INSERT INTO public.dynamic_pages (page_title, slug, page_content, is_published, seo_title, seo_description)
VALUES
(
  '{"en": "About Aronyok", "bn": "আমাদের সম্পর্কে"}',
  'about-us',
  '{"en": "### Welcome to Aronyok (অরণ্যক)\n\nRooted in the ancient riverbeds and verdant forests of Bengal, Aronyok was born out of a desire to rekindle humanity''s sacred bond with mother earth. We curate wild, pesticide-free harvest directly from indigenous forest harvesters and organic village artisans.\n\n#### Our Guiding Tenets:\n- **Authenticity:** Zero chemical adulteration, direct farm-to-table sourcing.\n- **Ecological Stewardship:** Biodegradable packaging and carbon-conscious delivery.\n- **Empowerment:** Fair living wages for forest honey hunters and local clay craftspeople.", "bn": "### অরণ্যকে আপনাকে স্বাগতম\n\nবাংলার চিরসবুজ প্রকৃতির স্নিগ্ধতা ও ভেষজ ঐতিহ্যের প্রতি গভীর শ্রদ্ধা থেকে অরণ্যকের জন্ম। আমাদের লক্ষ্য রাসায়নিকমুক্ত প্রাকৃতিক জীবনধারাকে সবার নাগালে পৌঁছে দেওয়া।\n\n#### আমাদের মূল দর্শন:\n- **বিশুদ্ধতা:** কোনো কৃত্রিম উপাদান ছাড়া সরাসরি বনাঞ্চল ও কৃষকের থেকে সংগৃহীত।\n- **পরিবেশবান্ধব:** প্লাস্টিকবিহীন প্যাকেজিং ও টেকসই উৎপাদন পদ্ধতি।\n- **সামাজিক দায়বদ্ধতা:** সুন্দরবনের মৌয়াল এবং প্রান্তিক মৃৎশিল্পীদের ন্যায্য অধিকার নিশ্চিতকরণ।" }',
  true,
  '{"en": "About Aronyok | Nature, Herbs & Sustainability", "bn": "অরণ্যক পরিচিতি | প্রকৃতি ও টেকসই জীবনধারা"}',
  '{"en": "Learn the story behind Aronyok and our dedication to organic living.", "bn": "জানুন অরণ্যকের পেছনের গল্প এবং বিশুদ্ধ প্রকৃতির প্রতি আমাদের অঙ্গীকার।"}'
),
(
  '{"en": "Sustainability Pledge", "bn": "আমাদের টেকসই অঙ্গীকার"}',
  'sustainability',
  '{"en": "### Our Eco-Commitment\n\nAt Aronyok, every package sent out uses recycled paper padding, jute twine strings, and terracotta containers wherever possible. We plant 1 native tree seedling for every 10 orders completed.", "bn": "### পরিবেশের প্রতি দায়বদ্ধতা\n\nঅরণ্যকের প্রতিটি অর্ডারে আমরা ব্যবহার করি পুনর্ব্যবহারযোগ্য কাগজের বক্স, পাটের সুতলি এবং মাটির পাত্র। এছাড়া প্রতি ১০টি সফল অর্ডারের বিপরীতে আমরা একটি দেশীয় বনজ বা ওষধি চারা রোপণ করি।" }',
  true,
  '{"en": "Our Sustainability Pledge | Aronyok Eco Mission", "bn": "আমাদের টেকসই অঙ্গীকার | অরণ্যক"}',
  '{"en": "How Aronyok ensures zero-waste, eco-friendly sourcing and packaging.", "bn": "কীভাবে অরণ্যক পরিবেশের ভারসাম্য বজায় রেখে কাজ করে।"}'
);

-- 5. TOOLS & MICRO-APPS
INSERT INTO public.tools (tool_name, title, description, endpoint_slug, icon_name, is_active, embed_code_or_config)
VALUES
(
  'Herbal Remedy Explorer',
  '{"en": "Herbal Remedy Explorer", "bn": "ভেষজ নিরাময় নির্দেশক"}',
  '{"en": "Search everyday ailments (colds, insomnia, digestion, skin) and get traditional botanical remedies with preparation methods.", "bn": "সাধারণ স্বাস্থ্য সমস্যা (সর্দি, অনিদ্রা, হজম, ত্বক) লিখে অনুসন্ধান করুন এবং জানুন সঠিক ভেষজ প্রতিকার ও সেবনবিধি।"}',
  'herbal-remedy-finder',
  'Sparkles',
  true,
  '{"type": "interactive_search", "tags": ["cold", "digestion", "skin", "sleep", "immunity"]}'
),
(
  'Plant Sunlight & Water Advisor',
  '{"en": "Plant Light & Water Advisor", "bn": "উদ্ভিদের সূর্যালোক ও পানি ক্যালকুলেটর"}',
  '{"en": "Input your plant variety and balcony orientation to get an accurate weekly watering and sun exposure plan.", "bn": "আপনার গাছের ধরন ও বারান্দার দিক নির্বাচন করে পান নিখুঁত সেচ ও রোদ পাওয়ার সময়সূচি।"}',
  'plant-sunlight-advisor',
  'Sun',
  true,
  '{"type": "calculator", "modes": ["balcony_facing", "plant_type"]}'
),
(
  'Soil & Compost Ratio Mixer',
  '{"en": "Soil & Compost Ratio Mixer", "bn": "মাটির কম্পোস্ট অনুপাত নির্দেশক"}',
  '{"en": "Calculate the perfect balance of garden loam, vermicompost, and coco-peat for any pot size.", "bn": "টবের আকার অনুযায়ী দোআঁশ মাটি, ভার্মিকম্পোস্ট এবং কোকোপিটের সঠিক অনুপাত নির্ধারণ করুন।"}',
  'soil-compost-ratio',
  'Sprout',
  true,
  '{"type": "ratio_calculator"}'
);
