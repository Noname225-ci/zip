import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    schema?: object;
}

export default function SEO({
    title = "Freedom Runway & Subscription Value Calculator",
    description = "Calculate your financial freedom runway and the true cost-per-use of your subscriptions. Are they worth it? Find out with our free tools.",
    canonical = "https://wastedorworthit.com/",
    keywords = "financial freedom, freedom runway calculator, financial independence, FIRE, subscription calculator, cost per use, subscription tracker, wasted money, budget optimization, personal finance tools, money management, save money on subscriptions, recurring expenses",
    ogTitle,
    ogDescription,
    ogImage = "https://wastedorworthit.com/og-image.png",
    ogType = "website",
    schema
}: SEOProps) {
    const siteTitle = "Wasted or Worth It?";
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

    // Base Schema for Organization and Social
    const baseSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Wasted or Worth It?",
        "url": "https://wastedorworthit.com/",
        "logo": "https://wastedorworthit.com/logo.png",
        "sameAs": [
            "https://www.facebook.com/profile.php?id=61552394056042"
        ]
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Wasted or Worth It?" />
            <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            <link rel="canonical" href={canonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={ogTitle || fullTitle} />
            <meta property="og:description" content={ogDescription || description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="Wasted or Worth It?" />


            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(baseSchema)}
            </script>
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
}
