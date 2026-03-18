import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
const countries = ["Albania", "Armenia", "Azerbaijan", "Bosnia", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Estonia", "Ethiopia", "Georgia", "Greece", "Hungary", "India", "Kazakhstan", "Kyrgyzstan", "Latvia", "Lithuania", "Moldova", "Montenegro", "North Macedonia", "Poland", "Romania", "Serbia", "Slovakia", "Slovenia", "Ukraine", "Uzbekistan", "Other"];
const services = ["AI Consulting", "Business Development B2B", "Digital Marketing", "HR / Recruitment", "IT Consulting", "Marketing Sales Funnel Setup", "Project Management"];
const Contact = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    country: "",
    service: "",
    message: "",
    honeypot: "" // Hidden field to catch bots
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validateForm = () => {
    // Honeypot check — bots fill hidden fields, humans don't
    if (formData.honeypot.trim() !== "") return false;

    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.trim().length > 2000) {
      newErrors.message = "Message must be less than 2000 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours."
      });

      // Reset form
      setFormData({
        fullName: "",
        companyName: "",
        email: "",
        phone: "",
        country: "",
        service: "",
        message: "",
        honeypot: ""
      });
      setErrors({});
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };
  return (
    <section id="contact" className="py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary font-semibold text-sm tracking-wide uppercase">
              Get In Touch
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Let's Talk Business
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to expand your business in emerging tech markets? Let's discuss your goals.
          </p>
        </div>

        {/* Contact Form - Centered */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm p-10 rounded-3xl border-2 border-border shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input 
                  id="fullName" 
                  value={formData.fullName} 
                  onChange={e => handleChange("fullName", e.target.value)} 
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  value={formData.companyName} 
                  onChange={e => handleChange("companyName", e.target.value)} 
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={e => handleChange("email", e.target.value)} 
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={e => handleChange("phone", e.target.value)} 
                />
              </div>

              <div>
                <Label htmlFor="country">Country/Market of Interest</Label>
                <Select value={formData.country} onValueChange={value => handleChange("country", value)}>
                  <SelectTrigger aria-label="Select a country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => <SelectItem key={country} value={country}>{country}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="service">Service Interest</Label>
                <Select value={formData.service} onValueChange={value => handleChange("service", value)}>
                  <SelectTrigger aria-label="Select a service">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => <SelectItem key={service} value={service}>{service}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea 
                  id="message" 
                  rows={4} 
                  value={formData.message} 
                  onChange={e => handleChange("message", e.target.value)} 
                  className={errors.message ? "border-destructive" : ""}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.message && <p className="text-destructive text-sm">{errors.message}</p>}
                  <p className={`text-sm ml-auto ${
                    formData.message.length < 10 
                      ? "text-muted-foreground" 
                      : formData.message.length > 2000 
                      ? "text-destructive" 
                      : "text-green-600"
                  }`}>
                    {formData.message.length} / 2000 {formData.message.length < 10 && "(min. 10)"}
                  </p>
                </div>
              </div>

              {/* Honeypot field - hidden from users but visible to bots */}
              <input 
                type="text" 
                name="honeypot" 
                value={formData.honeypot}
                onChange={e => handleChange("honeypot", e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <Button 
                type="submit" 
                size="lg" 
                variant="secondary"
                className="w-full font-semibold text-lg h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;