import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Menu, X, Phone, Mail, MapPin, Send, Camera, Calendar, CheckCircle, MessageSquare, Users } from "lucide-react";
import { useLocation } from "wouter";


export default function Home() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const professional = {
    name: "Sâmela Oliveira",
    title: "Dentista",
    phone: "22992751826",
    email: "sameladentista@gmail.com",
    location: "Saquarema, RJ",
    bio: "Transforme seu sorriso e sua saúde bucal — atendimento humanizado e tecnologia de ponta.",
    specialties: [
      "Clínica Geral e Preventiva",
      "Estética Dental (Lentes de Contato)",
      "Implantes e Próteses",
      "Ortodontia Invisível",
    ],
    image: "Samela.png",
  };

  const galleryImages = Array.from({ length: 6 }).map((_, i) => `/gallery/odonto${i + 1}.jpg`);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário enviado:", formData);
    setFormSubmitted(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setFormSubmitted(false), 3500);
  };

  const handleWhatsApp = (prefilled?: string) => {
    const message = encodeURIComponent(
      prefilled ?? "Olá! Gostaria de agendar uma avaliação odontológica."
    );
    window.open(`https://wa.me/${professional.phone}?text=${message}`, "_blank");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-800 bg-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={professional.image}
              alt={`${professional.name} - foto profissional`}
              className="w-12 h-12 rounded-full object-cover border"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/100?text=Foto";
              }}
            />
            <div>
              <div className="text-lg font-semibold text-blue-600">{professional.name}</div>
              <div className="text-sm text-gray-500">{professional.title}</div>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 items-center">
            <button className="text-sm hover:text-blue-600" onClick={() => scrollToSection("home")}>Início</button>
            <button className="text-sm hover:text-blue-600" onClick={() => scrollToSection("about")}>Sobre</button>
            <button className="text-sm hover:text-blue-600" onClick={() => scrollToSection("services")}>Atendimentos</button>
            <button className="text-sm hover:text-blue-600" onClick={() => scrollToSection("gallery")}>Galeria</button>
            <button className="text-sm hover:text-blue-600" onClick={() => scrollToSection("contact")}>Contato</button>
            <Button onClick={() => handleWhatsApp()} className="ml-2">Agendar</Button>
          </nav>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Abrir menu">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <button onClick={() => scrollToSection("home")} className="text-left">Início</button>
              <button onClick={() => scrollToSection("about")} className="text-left">Sobre</button>
              <button onClick={() => scrollToSection("services")} className="text-left">Atendimentos</button>
              <button onClick={() => scrollToSection("gallery")} className="text-left">Galeria</button>
              <button onClick={() => scrollToSection("contact")} className="text-left">Contato</button>
              <Button onClick={() => handleWhatsApp()}>Agendar</Button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="bg-gradient-to-r from-blue-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 mb-3">
                  <CheckCircle className="w-4 h-4" /> Saúde bucal com excelência
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                  {professional.name} — <span className="text-blue-600">{professional.title}</span>
                </h1>
                <p className="text-lg text-gray-700 mb-6">{professional.bio}</p>

                <div className="flex gap-3 flex-wrap">
                  <Button onClick={() => setLocation('/pre-avaliacao')} className="px-5 py-3">Fazer Pré‑Avaliação</Button>
                  <Button onClick={() => handleWhatsApp('Olá Sâmela, quero agendar avaliação.')} className="px-5 py-3 bg-green-600 hover:bg-green-700">Agendar via WhatsApp</Button>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-semibold">Atendimento flexível</div>
                      <div className="text-sm text-gray-500">Horários flexíveis e de emergência</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-semibold">Cuidado e atenção</div>
                      <div className="text-sm text-gray-500">Sorrisos personalizados para cada paciente</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={professional.image}
                    alt={`Foto de ${professional.name}`}
                    className="w-full h-96 object-cover"
                    onError={(e) => {(e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=Foto+Profissional';}}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About / Specialties */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold">Sobre mim</h2>
              <p className="text-gray-600 mt-3">Sou a Sâmela: trabalho com a arte de sorrir há anos, com foco em saúde, estética e bem‑estar.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3">Serviços em Destaque</h3>
                <ul className="space-y-2 text-gray-700">
                  {professional.specialties.map((s, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3">Como funciona</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Consulta inicial para diagnóstico completo.</li>
                  <li>Plano de tratamento detalhado e transparente.</li>
                  <li>Acompanhamento contínuo e preventivo.</li>
                </ol>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3">Credenciais</h3>
                <p className="text-gray-700">CRO / Pós-graduação em Implantodontia e cursos em harmonização orofacial e estética.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits / CTA strip */}
        <section className="py-12 bg-blue-600 text-white">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Pronto para transformar seu sorriso?</h3>
              <p className="text-sm text-blue-100 mt-1">Agende sua consulta e comece seu plano de tratamento.</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setLocation('/pre-avaliacao')} className="bg-white text-blue-600">Pré‑Avaliação</Button>
              <Button onClick={() => handleWhatsApp()} className="bg-green-500 hover:bg-green-600">Agendar WhatsApp</Button>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold mb-8">Galeria</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((img, idx) => (
                <figure key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={img}
                    alt={`Imagem da clínica ${idx + 1}`}
                    className="w-full h-56 object-cover"
                    onError={(e) => {(e.target as HTMLImageElement).src = `https://via.placeholder.com/600x400?text=Imagem+${idx+1}`;}}
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials (placeholders) */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Depoimentos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <blockquote key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-700 mb-4">“Atendimento excelente — meu sorriso está impecável!”</p>
                  <cite className="text-sm text-gray-500">Paciente satisfeita</cite>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">Fale comigo</h2>

            {formSubmitted && (
              <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 rounded-lg">Mensagem enviada com sucesso! Respondo em breve.</div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">Nome</span>
                  <Input name="name" value={formData.name} onChange={handleFormChange} required aria-label="Nome" />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">Email</span>
                  <Input type="email" name="email" value={formData.email} onChange={handleFormChange} required aria-label="Email" />
                </label>
              </div>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">Telefone</span>
                <Input name="phone" value={formData.phone} onChange={handleFormChange} aria-label="Telefone" placeholder="(21) 9xxxx-xxxx" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">Mensagem</span>
                <Textarea name="message" value={formData.message} onChange={handleFormChange} required rows={5} aria-label="Mensagem" />
              </label>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">Enviar mensagem</Button>
                <Button type="button" variant="outline" onClick={() => handleWhatsApp(formData.message || undefined)}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Enviar por WhatsApp
                </Button>
              </div>
            </form>

            <div className="mt-10 grid md:grid-cols-2 gap-6 text-gray-700">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <div className="font-semibold">Telefone</div>
                  <div className="text-sm">{professional.phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <div className="font-semibold">Localização</div>
                  <div className="text-sm">{professional.location}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} {professional.name}. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Feito com foco em resultados — Para customizações, altere o arquivo <code>src/pages/Home.tsx</code>.</p>
        </div>
      </footer>
    </div>
  );
}


