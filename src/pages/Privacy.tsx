import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy | Sipiteno"
        description="Sipiteno's privacy policy covering data collection, GDPR compliance, and user rights."
        canonicalUrl="https://sipiteno.com/privacy"
        noindex
      />
      <div className="container mx-auto px-6 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                Sipiteno ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you use our services or visit our website. 
                We comply with the General Data Protection Regulation (GDPR) and applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Data Collection</h2>
              <p className="text-muted-foreground mb-3">We collect the following types of information:</p>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Contact information (name, email address, phone number, company name)</li>
                <li>Business information (company details, industry, project requirements)</li>
                <li>Communication preferences and inquiry details</li>
                <li>Information provided during consultations and service engagements</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Website usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Data Usage</h2>
              <p className="text-muted-foreground mb-3">We use collected information for the following purposes:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Providing and delivering our business development and consulting services</li>
                <li>Responding to inquiries and communicating about services</li>
                <li>Improving our services and website functionality</li>
                <li>Sending relevant business updates and marketing communications (with consent)</li>
                <li>Complying with legal obligations and enforcing our terms</li>
                <li>Analyzing usage patterns to enhance user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Protection</h2>
              <p className="text-muted-foreground mb-3">
                We implement appropriate technical and organizational measures to protect your personal data:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular security assessments and updates</li>
                <li>Employee training on data protection practices</li>
                <li>Secure data storage and backup procedures</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                While we strive to protect your personal information, no method of transmission over the internet 
                or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
              <p className="text-muted-foreground mb-3">
                We may share your information with trusted third-party service providers who assist us in:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Website hosting and maintenance</li>
                <li>Email communication and marketing platforms</li>
                <li>Analytics and performance monitoring</li>
                <li>Payment processing (when applicable)</li>
                <li>Customer relationship management</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                These third parties are contractually obligated to protect your information and use it only for 
                specified purposes. We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights (GDPR)</h2>
              <p className="text-muted-foreground mb-3">Under GDPR, you have the following rights:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                To exercise any of these rights, please contact us at privacy@sipiteno.com. We will respond to 
                your request within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Cookie Policy</h2>
              <p className="text-muted-foreground mb-3">
                Our website uses cookies and similar technologies to enhance user experience:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with consent)</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                You can control cookies through your browser settings. Note that disabling certain cookies may 
                affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy, 
                unless a longer retention period is required by law. Typically:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
                <li>Contact form data: 2 years from last contact</li>
                <li>Client data: Duration of engagement plus 7 years for legal compliance</li>
                <li>Marketing data: Until consent is withdrawn</li>
                <li>Website analytics: 26 months</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to and processed in countries outside of your country of residence. 
                We ensure appropriate safeguards are in place for such transfers, including standard contractual clauses 
                approved by the European Commission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our services are not directed at individuals under 18 years of age. We do not knowingly collect 
                personal information from children. If we become aware that we have collected data from a child, 
                we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
                We will notify you of material changes by posting the updated policy on our website with a new 
                "Last Updated" date. Your continued use of our services after such changes constitutes acceptance 
                of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground mb-3">
                For questions, concerns, or to exercise your privacy rights, please contact our Data Protection Officer:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-foreground"><strong>Data Protection Officer</strong></p>
                <p className="text-foreground"><strong>Sipiteno</strong></p>
                <p className="text-muted-foreground">48 INOMENON ETHNON</p>
                <p className="text-muted-foreground">6042 LARNACA, CYPRUS</p>
                <p className="text-muted-foreground">Phone: +357 24 628 166</p>
                <p className="text-muted-foreground">Email: privacy@sipiteno.com</p>
              </div>
              <p className="text-muted-foreground mt-3">
                You also have the right to lodge a complaint with your local data protection authority if you believe 
                your privacy rights have been violated.
              </p>
            </section>

            <section className="bg-muted/30 p-6 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Last Updated:</strong> November 2024
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                By using our website and services, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
