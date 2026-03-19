import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Terms & Conditions | Sipiteno"
        description="Terms and conditions for Sipiteno's business development and consulting services."
        canonicalUrl="https://sipiteno.com/terms"
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
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-slate max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                These Terms and Conditions govern your use of Sipiteno's business development and consulting services. 
                By engaging our services, you agree to be bound by these terms. Please read them carefully before proceeding.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Services Description</h2>
              <p className="text-muted-foreground mb-3">Sipiteno provides the following professional services:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Business development consulting for emerging tech markets across Europe, Caucasus, and Central Asia</li>
                <li>AI and IT technology implementation and strategy consulting</li>
                <li>Technical advisory and software development</li>
                <li>Market entry strategy and partnership facilitation</li>
                <li>Regulatory navigation and compliance guidance</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                All services are provided on a professional basis and tailored to each client's specific requirements 
                as outlined in individual service agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Client Obligations</h2>
              <p className="text-muted-foreground mb-3">Clients engaging our services agree to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide accurate and complete information necessary for service delivery</li>
                <li>Respond to requests for information and feedback in a timely manner</li>
                <li>Make timely payments as specified in the service agreement</li>
                <li>Maintain confidentiality of proprietary information shared during engagements</li>
                <li>Use deliverables solely for agreed-upon business purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
              <p className="text-muted-foreground">
                Unless otherwise specified in writing, all intellectual property rights in deliverables created 
                specifically for a client shall transfer to the client upon full payment. Sipiteno retains all rights 
                to pre-existing intellectual property, methodologies, and general knowledge used in service delivery. 
                Clients may not use Sipiteno's name, logo, or trademarks without prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Confidentiality</h2>
              <p className="text-muted-foreground">
                Both parties agree to maintain confidentiality of proprietary information shared during the engagement. 
                This obligation continues for three years following the conclusion of services. Confidential information 
                excludes publicly available data or information independently developed by either party.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Sipiteno's liability for any claims arising from services provided shall be limited to the fees paid 
                for the specific services giving rise to the claim. In no event shall Sipiteno be liable for indirect, 
                incidental, consequential, or punitive damages. This limitation applies to the fullest extent permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Payment Terms</h2>
              <p className="text-muted-foreground">
                Payment terms will be specified in individual service agreements. Unless otherwise stated, invoices are 
                due within 30 days of issuance. Late payments may incur interest charges at a rate of 1.5% per month or 
                the maximum rate permitted by law, whichever is lower.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
              <p className="text-muted-foreground">
                Either party may terminate services with 30 days written notice. Upon termination, clients remain 
                responsible for payment of all services rendered up to the termination date. Sipiteno will deliver 
                all completed work and return client materials upon receipt of final payment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms and Conditions shall be governed by and construed in accordance with the laws of Cyprus. 
                Any disputes arising from these terms or services provided shall be subject to the exclusive jurisdiction 
                of the courts of Cyprus.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground">
                Sipiteno reserves the right to modify these Terms and Conditions at any time. Changes will be effective 
                immediately upon posting to our website. Continued use of our services following any changes constitutes 
                acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions regarding these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mt-3">
                <p className="text-foreground"><strong>Sipiteno</strong></p>
                <p className="text-muted-foreground">48 INOMENON ETHNON</p>
                <p className="text-muted-foreground">6042 LARNACA, CYPRUS</p>
                <p className="text-muted-foreground">Phone: +357 24 628 166</p>
                <p className="text-muted-foreground">Email: legal@sipiteno.com</p>
              </div>
            </section>

            <section className="bg-muted/30 p-6 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Last Updated:</strong> November 2024
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                By engaging Sipiteno's services, you acknowledge that you have read, understood, and agree to be bound 
                by these Terms and Conditions.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
