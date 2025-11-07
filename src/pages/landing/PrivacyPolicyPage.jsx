import Header from '@/components/landing/Header.jsx'
import {Footer} from '@/components/landing/Footer.jsx'

// It's crucial for a privacy policy to have a fixed "Last Updated" date.
// Update this string whenever you make substantive changes to the policy.
const LAST_UPDATED_DATE = "October 16, 2025"; // Example date

export default function PrivacyPolicyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-cream"> {/* Use theme background */}
            <Header />
            <main className="flex-grow"> {/* Ensure main content takes available space */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                    <div className="text-center py-10 px-6 bg-muted dark:bg-slate-800/60 rounded-xl shadow-lg mb-16">
                        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-3">Privacy Policy</h1>
                        <p className="text-base text-muted-foreground tracking-wide">
                            Last updated: {LAST_UPDATED_DATE}
                        </p>
                    </div>

                    <div className="space-y-10 text-foreground/90"> {/* Use theme foreground with slight opacity */}
                        <section>
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-foreground">Remembered Always</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                At Remembered Always, we believe memories are sacred. We are as committed to protecting your privacy as we are to honouring loved ones' legacy.
                                This policy outlines how we gather, utilise, and protect your data, allowing you to focus on what is most important: preserving cherished memories.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-foreground">1. What We Collect</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                We only gather data essential to creating and managing tributes:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                                <li><strong>Account Information:</strong> Name, email, and phone number (for account creation and communication).</li>
                                <li><strong>Tribute Content:</strong> Photos, videos, stories, event details, and guestbook entries you provide.</li>
                                <li><strong>Payment Details:</strong> Securely processed through third-party providers (e.g., Stripe, Flutterwave). We never store your full card information on our servers.</li>
                                <li><strong>Technical Data:</strong> Device type, IP address, browser information, and usage patterns (to improve user experience and for security purposes).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-foreground">2. How We Use Your Data</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                Your information helps us:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                                <li>Enable you to use the platform to create, post, and manage tributes.</li>
                                <li>Personalize your experience and suggest relevant features.</li>
                                <li>Process payments for premium and corporate plans.</li>
                                <li>Send important updates, security alerts, and support responses.</li>
                                <li>Ensure legal compliance and meet our regulatory duties.</li>
                                <li>Improve our services by analyzing usage trends (anonymized where possible).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-foreground">3. Sharing Your Data</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                We respect your trust and never sell your personal data. Limited sharing occurs only when:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                                <li><strong>You Consent:</strong> Public tributes are, by their nature, visible to anyone with the link. You control the privacy settings for your tributes.</li>
                                <li><strong>Service Providers:</strong> Trusted third-party partners (e.g., cloud hosting, payment processors, email services) assist our operations under strict confidentiality agreements and data processing terms.</li>
                                <li><strong>Legal Requirements:</strong> If required by law, court order, or to protect the rights, property, or safety of Remembered Always, our users, or others.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-foreground">4. Your Rights</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                You have control over your data:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                                <li><strong>Access & Edit:</strong> You can review and update your profile information and tribute content at any time through your account settings.</li>
                                <li><strong>Delete:</strong> You can request the deletion of your account or specific tributes. Please note that some data may be retained for legal or legitimate business purposes.</li>
                                <li><strong>Opt-Out:</strong> You can unsubscribe from non-essential marketing emails via the link provided in the email footer.</li>
                                <li><strong>Data Portability:</strong> You can request a copy of your personal data in a machine-readable format by emailing us at
                                    <a href="mailto:privacy@rememberedalways.org" className="text-primary hover:underline ml-1 font-medium">
                                        privacy@rememberedalways.org
                                    </a>.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-foreground">5. Security</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                We are committed to safeguarding your memories and personal information with appropriate technical and organizational measures, including:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                                <li><strong>Encryption:</strong> Data is encrypted in transit (using HTTPS) and at rest where appropriate.</li>
                                <li><strong>Access Controls:</strong> We implement strict internal permissions and access controls to limit who can access your data.</li>
                                <li><strong>Regular Reviews:</strong> We conduct regular security assessments and audits to identify and address potential vulnerabilities.</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed mt-3">
                                While no system is 100% secure, we strive to implement and maintain security measures that meet or exceed industry standards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-foreground">6. Children’s Privacy</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Our services are not directed to individuals under the age of 16 (or the relevant age of consent in your jurisdiction). We do not knowingly collect personal data from children. If we become aware that a minor’s information has been shared with us without appropriate consent, we will take steps to delete it immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-foreground">7. Changes to This Policy</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last updated" date. We encourage you to review this policy periodically. Your continued use of Remembered Always after any changes implies your acceptance of the new terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-foreground">Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at:
                                <a href="mailto:privacy@rememberedalways.org" className="text-primary hover:underline ml-1 font-medium">
                                    privacy@rememberedalways.org
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}