import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, FileText } from "lucide-react";
const countries = ["Albania", "Armenia", "Azerbaijan", "Bosnia", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Estonia", "Ethiopia", "Georgia", "Greece", "Hungary", "India", "Kazakhstan", "Kyrgyzstan", "Latvia", "Lithuania", "Moldova", "Montenegro", "North Macedonia", "Poland", "Romania", "Serbia", "Slovakia", "Slovenia", "Ukraine", "Uzbekistan", "Other"];
const services = ["AI Consulting", "Business Development B2B", "Digital Marketing", "HR / Recruitment", "IT Consulting", "Marketing Sales Funnel Setup", "MVP Micro SaaS Development", "Project Management"];
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
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive"
      });
      return;
    }

    // Store in localStorage for demo
    const submissions = JSON.parse(localStorage.getItem("contactSubmissions") || "[]");
    submissions.push({
      ...formData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("contactSubmissions", JSON.stringify(submissions));
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
      message: ""
    });
    setErrors({});
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
  return <section id="contact" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to expand your business in emerging tech markets? Let's discuss your goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="text-muted-foreground">48 INOMENON ETHNON<br />6042 LARNACA, CYPRUS</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                  <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="text-muted-foreground">+357 24 628 166</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                  <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Fax</p>
                    <p className="text-muted-foreground">+357 24 628 167</p>
                  </div>
                </div>

                
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-lg border-2 border-primary/20">
              <h4 className="font-semibold text-foreground mb-2">Business Hours</h4>
              <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM (Cyprus Time)</p>
              <p className="text-muted-foreground mt-1">We respond to all inquiries within 24 hours</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card p-8 rounded-2xl border-2 border-border shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" value={formData.fullName} onChange={e => handleChange("fullName", e.target.value)} className={errors.fullName ? "border-destructive" : ""} />
                {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" value={formData.companyName} onChange={e => handleChange("companyName", e.target.value)} />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} className={errors.email ? "border-destructive" : ""} />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} />
              </div>

              <div>
                <Label htmlFor="country">Country/Market of Interest</Label>
                <Select value={formData.country} onValueChange={value => handleChange("country", value)}>
                  <SelectTrigger>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => <SelectItem key={service} value={service}>{service}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" rows={4} value={formData.message} onChange={e => handleChange("message", e.target.value)} className={errors.message ? "border-destructive" : ""} />
                {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
              </div>

              <Button type="submit" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>;
};
export default Contact;