import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Send, ArrowLeft, ArrowRight, User, Stethoscope, Heart, History } from "lucide-react";
import { useLocation } from "wouter";

// --- Tipos de Dados ---
type FormData = {
  name: string;
  email: string;
  phone: string;
  age: string;
  mainComplaint: string;
  painLevel: string;
  painDuration: string;
  toothRegion: string[];
  sensitivity: string[];
  bleeding: "sim" | "nao" | "";
  gumRecession: "sim" | "nao" | "";
  previousTreatments: string;
  medications: string;
  habits: string[];
  additionalInfo: string;
};

// --- Opções de Seleção ---
const toothAreas = [
  { id: "front_top", label: "Dentes superiores frontais" },
  { id: "front_bottom", label: "Dentes inferiores frontais" },
  { id: "molars_top", label: "Molares superiores" },
  { id: "molars_bottom", label: "Molares inferiores" },
  { id: "canines", label: "Caninos" },
  { id: "general", label: "Dor difusa / difícil de localizar" },
];

const sensitivityTypes = [
  "Sensibilidade ao gelado",
  "Sensibilidade ao quente",
  "Sensibilidade ao doce",
  "Sensibilidade ao toque/mordida",
];

const habitTypes = [
  "Ranger os dentes (Bruxismo)",
  "Roer unhas",
  "Morder objetos (tampas, canetas)",
  "Respiração bucal",
  "Consumo frequente de bebidas ácidas",
];

// --- Funções Auxiliares ---
const formatPhone = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const length = phoneNumber.length;

  if (length <= 2) return `(${phoneNumber}`;
  if (length <= 7) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  if (length <= 11)
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
};

// --- Componente Principal ---
export default function PreAssessmentDentistaImprovedV3() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    age: "",
    mainComplaint: "",
    painLevel: "5",
    painDuration: "",
    toothRegion: [],
    sensitivity: [],
    bleeding: "",
    gumRecession: "",
    previousTreatments: "",
    medications: "",
    habits: [],
    additionalInfo: "",
  });
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [currentValidationError, setCurrentValidationError] = useState("");

  // --- Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    if (validationAttempted) setCurrentValidationError("");

    if (name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggle = (
    field: "toothRegion" | "sensitivity" | "habits",
    value: string
  ) => {
    setFormData((prev) => {
      const list = prev[field];
      const exists = list.includes(value);
      return { ...prev, [field]: exists ? list.filter((v) => v !== value) : [...list, value] };
    });
  };

  const handleRadioChange = (field: "bleeding" | "gumRecession", value: "sim" | "nao") => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- Validação de Etapas ---
  const validateStep = (currentStep: number): boolean => {
    setCurrentValidationError("");
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          setCurrentValidationError("O campo Nome é obrigatório.");
          return false;
        }
        if (formData.phone.replace(/[^\d]/g, "").length < 10) {
          setCurrentValidationError("O WhatsApp deve ter pelo menos 10 dígitos.");
          return false;
        }
        return true;
      case 2:
        if (!formData.mainComplaint.trim()) {
          setCurrentValidationError("O campo Queixa Principal é obrigatório.");
          return false;
        }
        return true;
      case 3:
        if (!formData.bleeding) {
          setCurrentValidationError("Informe se há sangramento ao escovar.");
          return false;
        }
        if (!formData.gumRecession) {
          setCurrentValidationError("Informe se há retração gengival.");
          return false;
        }
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    setValidationAttempted(true);
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      setValidationAttempted(false);
      setCurrentValidationError("");
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
    setValidationAttempted(false);
  };

  // --- Submissão ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationAttempted(true);

    if (!validateStep(step)) return;

    const toothText =
      formData.toothRegion.length > 0
        ? formData.toothRegion.map((id) => toothAreas.find((t) => t.id === id)?.label).join(", ")
        : "Não informado";

    const sensitivityText =
      formData.sensitivity.length > 0 ? formData.sensitivity.join(", ") : "Nenhuma";

    const habitText = formData.habits.length > 0 ? formData.habits.join(", ") : "Nenhum";

    const message = encodeURIComponent(
      `*PRÉ-AVALIAÇÃO ODONTOLÓGICA*\n\n` +
        `*1. Dados Pessoais:*\n` +
        `Nome: ${formData.name}\n` +
        `Email: ${formData.email || "Não informado"}\n` +
        `Telefone: ${formData.phone}\n` +
        `Idade: ${formData.age || "Não informado"}\n\n` +
        `*2. Sintomas:*\n` +
        `Queixa Principal: ${formData.mainComplaint}\n` +
        `Região: ${toothText}\n` +
        `Dor: ${formData.painLevel}\n` +
        `Duração: ${formData.painDuration || "Não informado"}\n\n` +
        `*3. Saúde Bucal:*\n` +
        `Sensibilidade: ${sensitivityText}\n` +
        `Sangramento: ${formData.bleeding}\n` +
        `Recessão: ${formData.gumRecession}\n\n` +
        `*4. Histórico:*\n` +
        `Hábitos: ${habitText}\n` +
        `Tratamentos: ${formData.previousTreatments || "Nenhum"}\n` +
        `Medicações: ${formData.medications || "Nenhuma"}\n` +
        `Extras: ${formData.additionalInfo || "Nenhuma"}`
    );

    const whatsappNumber = "5522992751826";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setLocation("/");
    }, 3000);
  };

  // --- Renderização de Etapas ---
  const renderStep = () => {
    const error = validationAttempted ? currentValidationError : "";

    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">1. Seus Dados</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input id="age" name="age" value={formData.age} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="phone">WhatsApp *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(99) 99999-9999"
                />
              </div>
            </div>

            {error && <p className="p-3 bg-red-100 text-red-700">{error}</p>}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">2. Sintomas</h2>

            <div>
              <Label htmlFor="mainComplaint">Queixa Principal *</Label>
              <Textarea
                id="mainComplaint"
                name="mainComplaint"
                value={formData.mainComplaint}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label>Região do Incômodo:</Label>
              <div className="grid md:grid-cols-2 gap-3">
                {toothAreas.map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <Checkbox
                      id={t.id}
                      checked={formData.toothRegion.includes(t.id)}
                      onCheckedChange={() => handleToggle("toothRegion", t.id)}
                    />
                    <Label htmlFor={t.id}>{t.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Dor (0-10): {formData.painLevel}</Label>
              <input
                type="range"
                min="0"
                max="10"
                name="painLevel"
                value={formData.painLevel}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="painDuration">Duração</Label>
              <Input
                id="painDuration"
                name="painDuration"
                value={formData.painDuration}
                onChange={handleInputChange}
              />
            </div>

            {error && <p className="p-3 bg-red-100 text-red-700">{error}</p>}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">3. Saúde Bucal</h2>

            <div>
              <Label>Sensibilidade:</Label>
              <div className="grid md:grid-cols-2 gap-3">
                {sensitivityTypes.map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <Checkbox
                      id={s}
                      checked={formData.sensitivity.includes(s)}
                      onCheckedChange={() => handleToggle("sensitivity", s)}
                    />
                    <Label htmlFor={s}>{s}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border rounded">
              <Label>Sangramento ao escovar? *</Label>
              <RadioGroup
                value={formData.bleeding}
                onValueChange={(v: "sim" | "nao") => handleRadioChange("bleeding", v)}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="sim" id="bleeding_sim" />
                  <Label htmlFor="bleeding_sim">Sim</Label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem value="nao" id="bleeding_nao" />
                  <Label htmlFor="bleeding_nao">Não</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="p-4 border rounded">
              <Label>Recessão gengival? *</Label>
              <RadioGroup
                value={formData.gumRecession}
                onValueChange={(v: "sim" | "nao") => handleRadioChange("gumRecession", v)}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="sim"
                    id="gumRecession_sim"
                  />{" "}
                  {/* ALTERAÇÃO */}
                  <Label htmlFor="gumRecession_sim">Sim</Label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="nao"
                    id="gumRecession_nao"
                  />{" "}
                  {/* ALTERAÇÃO */}
                  <Label htmlFor="gumRecession_nao">Não</Label>
                </div>
              </RadioGroup>
            </div>

            {error && <p className="p-3 bg-red-100 text-red-700">{error}</p>}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">4. Histórico e Hábitos</h2>

            <div>
              <Label>Hábitos:</Label>
              <div className="grid md:grid-cols-2 gap-3">
                {habitTypes.map((h) => (
                  <div key={h} className="flex items-center gap-2">
                    <Checkbox
                      id={h}
                      checked={formData.habits.includes(h)}
                      onCheckedChange={() => handleToggle("habits", h)}
                    />
                    <Label htmlFor={h}>{h}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="previousTreatments">Tratamentos recentes</Label>
              <Textarea
                id="previousTreatments"
                name="previousTreatments"
                value={formData.previousTreatments}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="medications">Medicações</Label>
              <Textarea
                id="medications"
                name="medications"
                value={formData.medications}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="additionalInfo">Informações adicionais</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
              />
            </div>

            {error && <p className="p-3 bg-red-100 text-red-700">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">

        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-blue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">Pré-Avaliação Odontológica</h1>

        <form onSubmit={handleSubmit}>
          <div className="p-8 bg-white rounded-xl shadow-lg border">
            {renderStep()}
          </div>

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button type="button" onClick={handleBack} variant="outline">
                <ArrowLeft className="w-5 h-5 mr-2" /> Anterior
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button type="button" onClick={handleNext} className="bg-blue-600">
                Próximo <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button type="submit" className="bg-green-600">
                <Send className="w-5 h-5 mr-2" /> Enviar via WhatsApp
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
