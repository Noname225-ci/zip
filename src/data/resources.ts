
export const categoryResources: Record<string, any> = {
    "Streaming Video": {
        freeSites: [
            { rank: 1, icon: "📺", name: "Tubi",          desc: "50,000+ movies & shows, 100% free", url: "https://tubitv.com" },
            { rank: 2, icon: "🎬", name: "Pluto TV",      desc: "300+ live channels & on-demand VOD", url: "https://pluto.tv" },
            { rank: 3, icon: "🦚", name: "Peacock (Free)", desc: "Hit shows, live sports clips & news", url: "https://peacocktv.com" },
            { rank: 4, icon: "🎭", name: "Crackle",       desc: "Sony-owned free movies & originals", url: "https://crackle.com" },
            { rank: 5, icon: "📡", name: "The Roku Channel", desc: "Free movies, live TV & news", url: "https://therokuchannel.roku.com" }
        ],
        subreddit: { name: "r/cordcutters", url: "https://www.reddit.com/r/cordcutters/" },
        subredditDesc: "A community of 450k+ people who've ditched cable. They share deals, free streaming tips, and help you set up antennas, streaming sticks, and VPNs.",
        newcomerTip: "New to Reddit? Just click the link. You can read everything without an account. Make a free account to ask questions and get personalized setup advice."
    },
    "Streaming Music": {
        freeSites: [
            { rank: 1, icon: "🎵", name: "Spotify (Free)", desc: "Shuffle mode with ads, still massive library", url: "https://open.spotify.com" },
            { rank: 2, icon: "🎶", name: "YouTube Music (Free)", desc: "Official music videos & auto-generated mixes", url: "https://music.youtube.com" },
            { rank: 3, icon: "🔊", name: "SoundCloud (Free)", desc: "Indie artists & emerging talent, no paywall", url: "https://soundcloud.com" },
            { rank: 4, icon: "💿", name: "Bandcamp",       desc: "Support artists directly, preview any album free", url: "https://bandcamp.com" },
            { rank: 5, icon: "📻", name: "Radio.garden",   desc: "Live radio from any city on Earth", url: "https://radio.garden" }
        ],
        subreddit: { name: "r/spotify", url: "https://www.reddit.com/r/spotify/" },
        subredditDesc: "Tips to maximize the free tier, find new music, and share playlists. Also check r/musichoarder for managing your own local music library.",
        newcomerTip: "Reddit is free to browse. No account needed to read threads packed with tips on getting more out of free music services."
    },
    "Gaming": {
        freeSites: [
            { rank: 1, icon: "🎮", name: "Epic Games Store", desc: "2–3 free AAA games every single week", url: "https://store.epicgames.com/en-US/free-games" },
            { rank: 2, icon: "🕹️", name: "Steam (Free to Play)", desc: "Hundreds of free-to-play PC games", url: "https://store.steampowered.com/genre/Free%20to%20Play/" },
            { rank: 3, icon: "🎲", name: "itch.io (Free games)", desc: "Thousands of indie games, many free", url: "https://itch.io/games/free" },
            { rank: 4, icon: "🏆", name: "GOG Free Games",  desc: "DRM-free classic games given away free", url: "https://www.gog.com/en/games?priceRange=0,0" },
            { rank: 5, icon: "☁️", name: "Xbox Free to Play", desc: "Free-to-play Xbox & PC games, no subscription", url: "https://www.xbox.com/en-US/games/free-to-play" }
        ],
        subreddit: { name: "r/patientgamers", url: "https://www.reddit.com/r/patientgamers/" },
        subredditDesc: "A community that waits for sales and finds incredible value. Threads on the best cheap/free games, deal alerts, and how to backlog smart rather than spend constantly.",
        newcomerTip: "No Reddit account? No problem, browse freely. Once you sign up (it's free), ask for game recommendations based on your exact budget and tastes."
    },
    "News & Magazines": {
        freeSites: [
            { rank: 1, icon: "📰", name: "BBC News",        desc: "World-class journalism, fully free online", url: "https://www.bbc.com/news" },
            { rank: 2, icon: "🌐", name: "Reuters",         desc: "Wire service news without opinion slant", url: "https://www.reuters.com" },
            { rank: 3, icon: "🗞️", name: "The Guardian",    desc: "UK paper, no paywall, donation funded", url: "https://theguardian.com" },
            { rank: 4, icon: "📻", name: "NPR News",         desc: "Balanced US news, podcasts & live radio", url: "https://www.npr.org" },
            { rank: 5, icon: "📖", name: "Libby (Library)",  desc: "Free digital magazines via your library card", url: "https://libbyapp.com" }
        ],
        subreddit: { name: "r/worldnews", url: "https://www.reddit.com/r/worldnews/" },
        subredditDesc: "Millions of readers sharing breaking news, analysis, and links to free articles. Great for bypassing paywalls via free archive tools shared in comments.",
        newcomerTip: "Reddit communities often share gift links and archive links to paywalled articles. Browse the comments. You will find most major news stories are freely accessible."
    },
    "Software & Productivity": {
        freeSites: [
            { rank: 1, icon: "📝", name: "LibreOffice",     desc: "Full Microsoft Office alternative, 100% free", url: "https://www.libreoffice.org" },
            { rank: 2, icon: "🎨", name: "GIMP",            desc: "Professional image editor, free forever", url: "https://www.gimp.org" },
            { rank: 3, icon: "✏️", name: "Canva (Free)",     desc: "Design templates, presentations & graphics", url: "https://www.canva.com" },
            { rank: 4, icon: "📋", name: "Notion (Free)",    desc: "Notes, wikis & project management for personal use", url: "https://www.notion.so" },
            { rank: 5, icon: "🗂️", name: "Google Workspace", desc: "Docs, Sheets, Slides and 15GB Drive, all free", url: "https://workspace.google.com" }
        ],
        subreddit: { name: "r/software", url: "https://www.reddit.com/r/software/" },
        subredditDesc: "Find free, open-source, or one-time-purchase alternatives to expensive subscription software. Also try r/AlternativeTo for crowd-sourced comparisons.",
        newcomerTip: "Search Reddit for 'free alternative to [your software]'. You will almost always find better options than what you are paying for. No account needed to search."
    },
    "Cloud Storage": {
        freeSites: [
            { rank: 1, icon: "☁️", name: "Google Drive",    desc: "15 GB free, works on all devices", url: "https://drive.google.com" },
            { rank: 2, icon: "🍎", name: "iCloud (Free)",    desc: "5 GB free tier, built into Apple devices", url: "https://www.icloud.com" },
            { rank: 3, icon: "🪟", name: "OneDrive (Free)",  desc: "5 GB free, deep Windows & Office integration", url: "https://onedrive.live.com" },
            { rank: 4, icon: "📦", name: "Mega",             desc: "20 GB free with end-to-end encryption", url: "https://mega.nz" },
            { rank: 5, icon: "🔄", name: "Sync.com (Free)",  desc: "5 GB free with zero-knowledge encryption", url: "https://www.sync.com" }
        ],
        subreddit: { name: "r/DataHoarder", url: "https://www.reddit.com/r/DataHoarder/" },
        subredditDesc: "Enthusiasts who optimize storage, run home NAS servers, and find the best cloud deals. Get advice on stacking free tiers from multiple providers.",
        newcomerTip: "Combine free tiers from multiple providers (Google + OneDrive + Mega) to get 40+ GB free. The DataHoarder community on Reddit explains exactly how."
    },
    "VPN": {
        freeSites: [
            { rank: 1, icon: "🔒", name: "ProtonVPN (Free)", desc: "Truly unlimited free tier, no data cap", url: "https://protonvpn.com/free-vpn" },
            { rank: 2, icon: "🛡️", name: "Windscribe (Free)", desc: "10 GB/month free, strong privacy policy", url: "https://windscribe.com" },
            { rank: 3, icon: "🌐", name: "TunnelBear (Free)", desc: "500 MB/month free, very easy to use", url: "https://www.tunnelbear.com" },
            { rank: 4, icon: "🔐", name: "hide.me (Free)",    desc: "10 GB/month free, no logs policy", url: "https://hide.me/en/vpn/free" },
            { rank: 5, icon: "🦊", name: "Mozilla VPN",       desc: "Trusted brand, check for free trial offers", url: "https://www.mozilla.org/products/vpn/" }
        ],
        subreddit: { name: "r/VPN", url: "https://www.reddit.com/r/VPN/" },
        subredditDesc: "Unbiased VPN advice from privacy enthusiasts. They cut through marketing hype and recommend based on actual audit results and privacy policies, not affiliate commissions.",
        newcomerTip: "VPN review sites are often paid affiliates. Reddit's r/VPN community gives honest, commission-free recommendations based on real-world testing."
    },
    "Fitness & Wellness": {
        freeSites: [
            { rank: 1, icon: "🧘", name: "YouTube Fitness",  desc: "Millions of free workouts for every level", url: "https://www.youtube.com/results?search_query=free+workout" },
            { rank: 2, icon: "👟", name: "Nike Training Club", desc: "Free app with 100+ workout plans", url: "https://www.nike.com/ntc-app" },
            { rank: 3, icon: "🏋️", name: "Darebee.com",      desc: "1,000+ free workout plans, no ads, no account", url: "https://darebee.com" },
            { rank: 4, icon: "🧠", name: "Insight Timer",     desc: "Largest free meditation app, over 100k guided sessions", url: "https://insighttimer.com" },
            { rank: 5, icon: "📱", name: "MyFitnessPal (Free)", desc: "Calorie & nutrition tracking, free tier", url: "https://www.myfitnesspal.com" }
        ],
        subreddit: { name: "r/Fitness", url: "https://www.reddit.com/r/Fitness/" },
        subredditDesc: "The definitive fitness community with 10M+ members. Browse the wiki for free beginner programs that outperform most paid apps. Ask questions, get science-backed advice.",
        newcomerTip: "The r/Fitness wiki has free beginner workout programs that are genuinely better than most paid apps. No Reddit account needed. Just read the wiki directly."
    },
    "Meal Kits & Food": {
        freeSites: [
            { rank: 1, icon: "🍳", name: "AllRecipes",       desc: "Millions of free recipes with reviews", url: "https://www.allrecipes.com" },
            { rank: 2, icon: "👨‍🍳", name: "Budget Bytes",    desc: "Cheap, delicious recipes with cost-per-serving", url: "https://www.budgetbytes.com" },
            { rank: 3, icon: "🥗", name: "Mealime (Free)",    desc: "Free weekly meal plans with shopping lists", url: "https://www.mealime.com" },
            { rank: 4, icon: "🛒", name: "Supercook",         desc: "Find recipes based on what you already have", url: "https://www.supercook.com" },
            { rank: 5, icon: "📺", name: "YouTube Cooking",   desc: "Pro chefs teaching for free: Babish, Joshua Weissman", url: "https://www.youtube.com/results?search_query=meal+prep+beginners" }
        ],
        subreddit: { name: "r/mealprep", url: "https://www.reddit.com/r/mealprep/" },
        subredditDesc: "Learn to batch-cook a week's meals for less than a single meal kit. Budget templates, beginner guides, and recipe ideas shared by the community every day.",
        newcomerTip: "r/mealprep shows you how to cook 10+ meals in 2 hours for under $50, far cheaper than any meal kit. The community is welcoming to complete beginners."
    },
    "Subscription Boxes": {
        freeSites: [
            { rank: 1, icon: "💄", name: "Sample Society",    desc: "Free beauty samples from major brands", url: "https://www.ulta.com/free-samples" },
            { rank: 2, icon: "🛍️", name: "PINCHme",          desc: "Free product samples in exchange for reviews", url: "https://www.pinchme.com" },
            { rank: 3, icon: "🧴", name: "Sephora Samples",   desc: "3 free samples with any Sephora order", url: "https://www.sephora.com" },
            { rank: 4, icon: "🛒", name: "ThredUp",           desc: "Secondhand clothing at a fraction of the price", url: "https://www.thredup.com" },
            { rank: 5, icon: "👗", name: "Poshmark",          desc: "Buy/sell secondhand fashion, huge selection", url: "https://www.poshmark.com" }
        ],
        subreddit: { name: "r/BeautyBoxes", url: "https://www.reddit.com/r/BeautyBoxes/" },
        subredditDesc: "Community that reviews subscription boxes, shares spoilers, and crucially, tells you which boxes offer one-time purchases instead of subscriptions.",
        newcomerTip: "The community often identifies when boxes go on sale or when you can get the same products cheaper directly. Browse without an account for instant savings tips."
    },
    "Education & Learning": {
        freeSites: [
            { rank: 1, icon: "🎓", name: "Coursera (Audit)",  desc: "Audit 3,000+ university courses for free", url: "https://www.coursera.org" },
            { rank: 2, icon: "📚", name: "edX (Audit)",       desc: "MIT, Harvard and more, free to audit", url: "https://www.edx.org" },
            { rank: 3, icon: "💻", name: "freeCodeCamp",      desc: "Full coding curriculum, 100% free, certifications", url: "https://www.freecodecamp.org" },
            { rank: 4, icon: "🎨", name: "Khan Academy",      desc: "Math, science and history, free for everyone", url: "https://www.khanacademy.org" },
            { rank: 5, icon: "📖", name: "LinkedIn Learning (Library)", desc: "Free access via many public library cards", url: "https://www.linkedin.com/learning/" }
        ],
        subreddit: { name: "r/learnprogramming", url: "https://www.reddit.com/r/learnprogramming/" },
        subredditDesc: "For coding specifically. Also try r/YouShouldKnow for general life skills. Members share the best free resources and honest reviews of paid platforms.",
        newcomerTip: "Before paying for any online course, check Reddit first. The community often confirms that the free version of a course platform is sufficient for your goals."
    },
    "Audiobooks & Reading": {
        freeSites: [
            { rank: 1, icon: "📖", name: "Librivox",          desc: "20,000+ free public-domain audiobooks, volunteer-read", url: "https://librivox.org" },
            { rank: 2, icon: "📚", name: "Project Gutenberg", desc: "70,000+ free classic ebooks, no account needed", url: "https://www.gutenberg.org" },
            { rank: 3, icon: "✨", name: "Standard Ebooks",   desc: "Public-domain books beautifully reformatted", url: "https://standardebooks.org" },
            { rank: 4, icon: "🏛️", name: "Open Library",      desc: "Borrow digital books free with a free account", url: "https://openlibrary.org" },
            { rank: 5, icon: "📱", name: "Libby / Hoopla",    desc: "Free ebooks & audiobooks with your library card", url: "https://libbyapp.com" }
        ],
        subreddit: { name: "r/audiobooks", url: "https://www.reddit.com/r/audiobooks/" },
        subredditDesc: "The audiobook community shares free sources, deals, and honest reviews. They actively track when Audible titles go free and which libraries have the best digital selections.",
        newcomerTip: "Your public library card is a gold mine. Libby and Hoopla are free apps that connect to your library and give you access to thousands of ebooks and audiobooks at no cost."
    },
    "Language Learning": {
        freeSites: [
            { rank: 1, icon: "🎧", name: "Language Transfer", desc: "Free audio courses, highly rated, builds real fluency", url: "https://languagetransfer.org" },
            { rank: 2, icon: "🦜", name: "Duolingo (Free)",   desc: "Gamified lessons, free tier covers core content", url: "https://duolingo.com" },
            { rank: 3, icon: "🃏", name: "Anki",              desc: "Free spaced-repetition flashcards, best for vocabulary", url: "https://apps.ankiweb.net" },
            { rank: 4, icon: "💬", name: "Tandem",            desc: "Free language exchange with native speakers worldwide", url: "https://tandem.net" },
            { rank: 5, icon: "📻", name: "BBC Languages",     desc: "Free language lessons and audio from the BBC", url: "https://www.bbc.co.uk/languages" }
        ],
        subreddit: { name: "r/languagelearning", url: "https://www.reddit.com/r/languagelearning/" },
        subredditDesc: "A huge community sharing proven free methods, app comparisons, and study schedules. They are very honest about which paid apps are worth it. Most are not.",
        newcomerTip: "Language Transfer is free and consistently outperforms paid apps for building real conversational ability. Start there before spending anything."
    },
    "AI Tools": {
        freeSites: [
            { rank: 1, icon: "🤖", name: "ChatGPT (Free)",    desc: "GPT-4o access on free tier for everyday tasks", url: "https://chat.openai.com" },
            { rank: 2, icon: "🧠", name: "Claude (Free)",     desc: "Strong reasoning and writing on the free tier", url: "https://claude.ai" },
            { rank: 3, icon: "🔍", name: "Perplexity (Free)", desc: "AI-powered web search with cited sources", url: "https://perplexity.ai" },
            { rank: 4, icon: "💎", name: "Gemini (Free)",     desc: "Google's AI, integrated with Google Workspace", url: "https://gemini.google.com" },
            { rank: 5, icon: "🖼️", name: "Adobe Firefly",    desc: "Free AI image generation with monthly credits", url: "https://firefly.adobe.com" }
        ],
        subreddit: { name: "r/ChatGPT", url: "https://www.reddit.com/r/ChatGPT/" },
        subredditDesc: "Tips, prompts, and honest comparisons of AI tools. The community regularly benchmarks free vs. paid tiers and shares workflows that make the free tier go much further.",
        newcomerTip: "Rotate between free tiers of ChatGPT, Claude, and Gemini when you hit rate limits. Most everyday tasks don't require a paid plan."
    },
    "Password & Security": {
        freeSites: [
            { rank: 1, icon: "🔐", name: "Bitwarden (Free)",  desc: "Open-source, audited, unlimited passwords. The best free option.", url: "https://bitwarden.com" },
            { rank: 2, icon: "🗝️", name: "KeePassXC",        desc: "Fully local, no cloud, 100% free and open-source", url: "https://keepassxc.org" },
            { rank: 3, icon: "🍎", name: "iCloud Keychain",   desc: "Built-in password manager for Apple devices, free", url: null },
            { rank: 4, icon: "🔒", name: "Google Password Manager", desc: "Free, syncs across Chrome and Android", url: "https://passwords.google.com" },
            { rank: 5, icon: "🛡️", name: "Have I Been Pwned", desc: "Free service to check if your email was in a data breach", url: "https://haveibeenpwned.com" }
        ],
        subreddit: { name: "r/privacy", url: "https://www.reddit.com/r/privacy/" },
        subredditDesc: "Practical privacy advice without the paranoia. The community maintains a wiki with the best free security tools and regularly recommends Bitwarden over every paid alternative.",
        newcomerTip: "Bitwarden is the community consensus best free password manager: open-source, independently audited, works on every platform. No reason to pay for most password managers."
    },
    "Notes & Productivity": {
        freeSites: [
            { rank: 1, icon: "💎", name: "Obsidian (Free)",   desc: "Local Markdown notes, powerful plugins, no subscription", url: "https://obsidian.md" },
            { rank: 2, icon: "📝", name: "Notion (Free)",     desc: "Generous free tier, unlimited blocks since 2024", url: "https://notion.so" },
            { rank: 3, icon: "🎵", name: "Joplin (Free)",     desc: "Open-source Evernote replacement, end-to-end encrypted", url: "https://joplinapp.org" },
            { rank: 4, icon: "🍎", name: "Apple Notes",       desc: "Surprisingly powerful, syncs via iCloud, completely free", url: null },
            { rank: 5, icon: "📌", name: "Google Keep",       desc: "Simple, fast, syncs everywhere. Great for quick notes.", url: "https://keep.google.com" }
        ],
        subreddit: { name: "r/PKMS", url: "https://www.reddit.com/r/PKMS/" },
        subredditDesc: "Personal Knowledge Management System community. Deep comparisons of every notes app with honest takes on which paid features are worth it (usually none for personal use).",
        newcomerTip: "Obsidian's free version is one of the most powerful notes apps available. Your notes stay as plain text files on your computer. No lock-in, no subscription needed."
    },
    "Food Delivery": {
        freeSites: [
            { rank: 1, icon: "🚗", name: "Store Pickup (Free)", desc: "Curbside pickup at most grocery chains, no fees at all", url: null },
            { rank: 2, icon: "🛒", name: "Walmart Pickup",    desc: "Free grocery pickup, no membership required", url: "https://www.walmart.com/grocery" },
            { rank: 3, icon: "🍕", name: "Restaurant Pick-Up", desc: "Order direct from most restaurants and pick up. Zero delivery fees.", url: null },
            { rank: 4, icon: "🥘", name: "Budget Bytes",      desc: "Free recipes optimised for cost, around $2 to $4 per serving", url: "https://budgetbytes.com" },
            { rank: 5, icon: "📦", name: "Amazon Fresh",      desc: "Free delivery for Prime members near coverage zones", url: "https://www.amazon.com/fresh" }
        ],
        subreddit: { name: "r/personalfinance", url: "https://www.reddit.com/r/personalfinance/" },
        subredditDesc: "The personal finance community regularly breaks down how much delivery memberships actually save vs. just picking up. The answer is usually: not much, unless you order constantly.",
        newcomerTip: "Store pickup is genuinely free at Target, Walmart, Kroger, and most major grocery chains. For restaurants, ordering directly via their website or app almost always beats third-party apps."
    },
    "Dating Apps": {
        freeSites: [
            { rank: 1, icon: "💚", name: "Hinge (Free tier)", desc: "Most generous free dating app, unlimited likes and messaging", url: "https://hinge.co" },
            { rank: 2, icon: "🐝", name: "Bumble (Free tier)", desc: "Women message first, strong free tier", url: "https://bumble.com" },
            { rank: 3, icon: "💙", name: "OkCupid (Free)",    desc: "Detailed profiles, strong free matching algorithm", url: "https://okcupid.com" },
            { rank: 4, icon: "🎯", name: "Coffee Meets Bagel", desc: "Free daily matches, quality over quantity approach", url: "https://coffeemeetsbagel.com" },
            { rank: 5, icon: "🌍", name: "Meetup (Free)",     desc: "Meet people through shared interests, no swiping required", url: "https://meetup.com" }
        ],
        subreddit: { name: "r/OnlineDating", url: "https://www.reddit.com/r/OnlineDating/" },
        subredditDesc: "Honest, unfiltered reviews of every dating app. The community consistently confirms that profile quality matters far more than premium features. Save your money.",
        newcomerTip: "Hinge's free tier is genuinely great and widely considered the best free dating app experience right now. Try it before paying for anything on any platform."
    }
};
