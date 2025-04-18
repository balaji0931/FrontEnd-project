import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/contact/contact-form";
import { FAQSection } from "@/components/contact/faq-section";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-[#F5F5F5] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-darker mb-4">Contact Us</h1>
            <p className="text-neutral-dark max-w-2xl mx-auto">
              Have questions or suggestions? We'd love to hear from you. Reach out to our team using the form below.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ContactForm />
            <FAQSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
