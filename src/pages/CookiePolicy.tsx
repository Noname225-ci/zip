import { Cookie, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-[#0a1628] text-slate-100 font-sans selection:bg-teal-500 selection:text-white pb-20 pt-24">
            <SEO
                title="Cookie Policy"
                description="Information about how Wasted or Worth It? uses cookies and third-party advertising partners."
                keywords="cookie policy, advertising cookies, tracking preferences, ad transparency"
                canonical="https://wastedorworthit.com/cookies"
            />
            <div className="container mx-auto px-4 max-w-3xl">
                <Link to="/" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-8 font-bold transition-colors">
                    <ArrowLeft size={20} /> Back to Calculator
                </Link>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl">
                    <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-8">
                        <div className="bg-teal-500/20 p-4 rounded-2xl text-teal-400">
                            <Cookie size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-white">Cookie Policy</h1>
                    </div>

                    <div className="space-y-8 text-slate-300 leading-relaxed">
                        <p><strong>Last Updated:</strong> March 2026</p>
                        <p className="text-lg">This Cookie Policy explains how <strong>Wasted or Worth It?</strong> uses cookies and similar technologies to recognize you when you visit our website.</p>

                        <section>
                            <h2 className="text-2xl font-display font-bold text-white mb-4">1. What are cookies?</h2>
                            <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
                            <p className="mt-2">Note: Our calculators themselves strictly use <code>localStorage</code> (not cookies) to temporarily save your inputs securely on your device, ensuring your financial data remains private and local.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-display font-bold text-white mb-4">2. Why do we use cookies?</h2>
                            <p>We do not use our own first-party cookies for tracking. However, we use third-party cookies served through our website for advertising and analytical purposes. This primarily includes:</p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li><strong>Advertising Cookies:</strong> We partner with third-party ad networks, specifically Google AdSense, to display advertising on our website. These partners use cookies to gather information about your activities on this and other websites in order to provide you targeted advertising based upon your interests.</li>
                                <li><strong>Analytics Cookies:</strong> We may use third-party analytics services to analyze how users interact with our website to improve user experience.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-display font-bold text-white mb-4">3. Managing and Opting Out of Cookies</h2>
                            <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your web browser controls.</p>
                            <p className="mt-4"><strong>To opt out of personalized advertising by Google:</strong></p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Visit <a href="https://myadcenter.google.com/" className="text-teal-400 hover:text-teal-300 underline" target="_blank" rel="noopener noreferrer">Google's Ads Settings</a>.</li>
                                <li>Visit <a href="http://www.aboutads.info/choices/" className="text-teal-400 hover:text-teal-300 underline" target="_blank" rel="noopener noreferrer">AboutAds.info</a> to opt out of a broader range of third-party vendor's use of cookies for personalized advertising.</li>
                            </ul>
                            <p className="mt-4">If you choose to reject cookies, you may still use our website, including the calculators, though some functionality or areas of our website might be restricted or display less relevant advertising.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
