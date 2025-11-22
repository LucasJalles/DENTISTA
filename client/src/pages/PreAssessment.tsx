import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Send, ArrowLeft, ArrowRight, User, Stethoscope, Heart, History, CheckCircle } from "lucide-react";
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
  bodyRegion: string[]; // Alterado de toothRegion para bodyRegion
  additionalSymptoms: string[]; // Alterado de sensitivity para additionalSymptoms
  movementLimitation: "sim" | "nao" | ""; // Alterado de bleeding para movementLimitation
  injuryHistory: "sim" | "nao" | ""; // Alterado de gumRecession para injuryHistory
  previousTreatments: string;
  medications: string;
  lifestyleHabits: string[]; // Alterado de habits para lifestyleHabits
  additionalInfo: string;
};

// --- Opções de Seleção (Contexto Fisioterapia) ---
const bodyAreas = [
  { id: "coluna_cervical", label: "Coluna Cervical (Pescoço)" },
  { id: "coluna_lombar", label: "Coluna Lombar (Costas)" },
  { id: "ombro", label: "Ombro" },
  { id: "joelho", label: "Joelhos" },
  { id: "tornozelo_pe", label: "Tornozelo / Pé" },
  { id: "quadril", label: "Quadril" },
  { id: "dor_difusa", label: "Dor difusa / Várias regiões" },
];

const additionalSymptoms = [
  "Formigamento ou Dormência",
  "Rigidez Matinal",
  "Fraqueza Muscular",
  "Inchaço (Edema)",
  "Dor ao Repouso",
  "Dor ao Movimento",
];

const lifestyleHabits = [
  "Sedentarismo",
  "Postura Inadequada no Trabalho",
  "Prática de Esportes de Alto Impacto",
  "Estresse Elevado",
  "Tabagismo",
];

// --- Funções Auxiliares ---

// Função para formatar o telefone (melhora a UX)
const formatPhone = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const length = phoneNumber.length;

  if (length <= 2) return `(${phoneNumber}`;
  if (length <= 7) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  if (length <= 11)
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
      2,
      7
    )}-${phoneNumber.slice(7, 11)}`;
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
    2,
    7
  )}-${phoneNumber.slice(7, 11)}`;
};

// --- Componente Principal ---
export default function PreAssessmentFisioterapia() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    age: "",
    mainComplaint: "",
    painLevel: "5",
    painDuration: "",
    bodyRegion: [],
    additionalSymptoms: [],
    movementLimitation: "",
    injuryHistory: "",
    previousTreatments: "",
    medications: "",
    lifestyleHabits: [],
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
    if (validationAttempted) {
        setCurrentValidationError("");
    }

    if (name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggle = (
    field: "bodyRegion" | "additionalSymptoms" | "lifestyleHabits",
    value: string
  ) => {
    setFormData((prev) => {
      const list = prev[field];
      const exists = list.includes(value);
      return {
        ...prev,
        [field]: exists ? list.filter((v) => v !== value) : [...list, value],
      } as FormData;
    });
  };

  const handleRadioChange = (field: "movementLimitation" | "injuryHistory", value: "sim" | "nao") => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- Validação de Etapas ---
  const validateStep = (currentStep: number): boolean => {
    setCurrentValidationError("");
    switch (currentStep) {
      case 1: // Dados Pessoais: Nome e WhatsApp obrigatórios
        if (!formData.name.trim()) {
          setCurrentValidationError("O campo Nome é obrigatório.");
          return false;
        }
        if (formData.phone.replace(/[^\d]/g, "").length < 10) {
          setCurrentValidationError("O campo WhatsApp é obrigatório e deve ter pelo menos 10 dígitos.");
          return false;
        }
        return true;
      case 2: // Sintomas e Dor: Queixa Principal obrigatória
        if (!formData.mainComplaint.trim()) {
          setCurrentValidationError("O campo Queixa Principal é obrigatório.");
          return false;
        }
        return true;
      case 3: // Saúde Bucal -> Funcionalidade: Limitação e Histórico obrigatórios
        if (!formData.movementLimitation) {
          setCurrentValidationError("Por favor, informe sobre Limitação de Movimento.");
          return false;
        }
        if (!formData.injuryHistory) {
          setCurrentValidationError("Por favor, informe sobre Histórico de Lesão.");
          return false;
        }
        return true;
      case 4: // Histórico e Hábitos: Não há campos obrigatórios nesta etapa
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
    setCurrentValidationError("");
  };

  // --- Submissão (WhatsApp) ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationAttempted(true);

    if (!validateStep(step)) return;

    // Prepara o texto para o WhatsApp
    const bodyText = formData.bodyRegion.length > 0 ? formData.bodyRegion.map(id => bodyAreas.find(t => t.id === id)?.label || id).join(", ") : "Não informado";
    const symptomsText = formData.additionalSymptoms.length > 0 ? formData.additionalSymptoms.join(", ") : "Nenhum";
    const habitsText = formData.lifestyleHabits.length > 0 ? formData.lifestyleHabits.join(", ") : "Nenhum";

    const message = encodeURIComponent(
      `*PRÉ-AVALIAÇÃO FISIOTERAPIA (Fabiana Rodrigues)*\n\n` +
      `*1. Dados Pessoais:*\n` +
      `Nome: ${formData.name}\n` +
      `Email: ${formData.email || "Não informado"}\n` +
      `Telefone: ${formData.phone}\n` +
      `Idade: ${formData.age || "Não informado"}\n\n` +
      `*2. Sintomas e Dor:*\n` +
      `Queixa Principal: ${formData.mainComplaint}\n` +
      `Região afetada: ${bodyText}\n` +
      `Intensidade da dor (0-10): ${formData.painLevel}\n` +
      `Duração da dor: ${formData.painDuration || "Não informado"}\n\n` +
      `*3. Funcionalidade e Histórico:*\n` +
      `Sintomas Adicionais: ${symptomsText}\n` +
      `Limitação de Movimento: ${formData.movementLimitation === "sim" ? "Sim" : "Não"}\n` +
      `Histórico de Lesão/Cirurgia: ${formData.injuryHistory === "sim" ? "Sim" : "Não"}\n\n` +
      `*4. Contexto e Hábitos:*\n` +
      `Hábitos de Vida: ${habitsText}\n` +
      `Tratamentos anteriores (Fisio/Médico): ${formData.previousTreatments || "Nenhum informado"}\n` +
      `Medicações: ${formData.medications || "Nenhuma"}\n` +
      `Informações adicionais: ${formData.additionalInfo || "Nenhuma"}`
    );

    const whatsappNumber = "5522992751826"; 
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setLocation("/");
    }, 3000);
  };

  // --- Componente de Indicador de Etapa ---
  const StepIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = [
      { id: 1, title: "Seus Dados", icon: User },
      { id: 2, title: "Sintomas", icon: Stethoscope },
      { id: 3, title: "Funcionalidade", icon: CheckCircle }, // Ícone alterado
      { id: 4, title: "Histórico", icon: History },
    ];

    return (
      <div className="flex justify-between items-center mb-10 p-4 bg-white rounded-xl shadow-md">
        {steps.map((s) => {
          const isActive = s.id === currentStep;
          const isCompleted = s.id < currentStep;
          const ringColor = isCompleted ? "ring-green-500" : isActive ? "ring-blue-600" : "ring-gray-300";
          const bgColor = isCompleted ? "bg-green-500" : isActive ? "bg-blue-600" : "bg-white";
          const textColor = isActive ? "font-semibold text-blue-600" : "text-gray-600";

          return (
            <div key={s.id} className="flex flex-col items-center flex-1 relative">
              {/* Linha de Conexão (apenas para etapas intermediárias) */}
              {s.id > 1 && (
                <div className={`absolute top-4 left-0 w-1/2 h-0.5 ${isCompleted ? "bg-green-500" : "bg-gray-300"} -translate-x-full`}></div>
              )}
              
              {/* Círculo e Ícone */}
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ring-2 ${ringColor} ${bgColor} transition-all duration-300 z-10`}>
                <s.icon className={`w-5 h-5 ${isCompleted ? "text-white" : isActive ? "text-white" : "text-gray-400"}`} />
              </div>

              {/* Título */}
              <span className={`mt-2 text-xs md:text-sm text-center ${textColor} transition-colors duration-300 hidden sm:block`}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // --- Renderização de Etapas ---
  const renderStep = () => {
    const error = validationAttempted ? currentValidationError : "";

    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">1. Seus Dados</h2>
            <p className="text-gray-600">Precisamos de suas informações de contato para dar seguimento à avaliação.</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="name">Nome Completo <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required aria-required="true" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="age">Idade</Label>
                <Input id="age" type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Opcional" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Opcional" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">WhatsApp <span className="text-red-500">*</span></Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required aria-required="true" placeholder="(99) 99999-9999" />
              </div>
            </div>
            
            {error && step === 1 && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg" role="alert" aria-live="assertive">
                {error}
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">2. Sintomas e Dor</h2>
            <p className="text-gray-600">Descreva o que está sentindo e onde.</p>

            <div className="space-y-1">
              <Label htmlFor="mainComplaint">Descreva seu principal incômodo <span className="text-red-500">*</span></Label>
              <Textarea id="mainComplaint" name="mainComplaint" rows={3} value={formData.mainComplaint} onChange={handleInputChange} required aria-required="true" placeholder="Ex: Dor no joelho ao subir escadas, dor no ombro ao levantar o braço, etc." />
            </div>

            <div>
              <Label className="mb-3 block font-medium text-gray-700">Região do Incômodo (Selecione uma ou mais):</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bodyAreas.map((t) => (
                  <div key={t.id} className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 transition-colors">
                    <Checkbox id={t.id} checked={formData.bodyRegion.includes(t.id)} onCheckedChange={() => handleToggle("bodyRegion", t.id)} />
                    <Label htmlFor={t.id} className="cursor-pointer">{t.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Label className="block font-medium text-gray-700">Intensidade da Dor (0-10): <span className="font-bold text-blue-600 text-xl">{formData.painLevel}</span></Label>
              <input type="range" min="0" max="10" name="painLevel" value={formData.painLevel} onChange={handleInputChange} className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer range-lg accent-blue-600" aria-valuetext={`Nível de dor: ${formData.painLevel}`} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="painDuration">Há quanto tempo sente o incômodo?</Label>
              <Input id="painDuration" name="painDuration" value={formData.painDuration} onChange={handleInputChange} placeholder="Ex: 2 semanas, 3 meses, 1 ano..." />
            </div>
            
            {error && step === 2 && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg" role="alert" aria-live="assertive">
                {error}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">3. Funcionalidade e Histórico</h2>
            <p className="text-gray-600">Detalhes sobre sua mobilidade e histórico de lesões.</p>

            <div>
              <Label className="mb-3 block font-medium text-gray-700">Sintomas Adicionais (Selecione um ou mais):</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionalSymptoms.map((s) => (
                  <div key={s} className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 transition-colors">
                    <Checkbox id={s} checked={formData.additionalSymptoms.includes(s)} onCheckedChange={() => handleToggle("additionalSymptoms", s)} />
                    <Label htmlFor={s} className="cursor-pointer">{s}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 p-4 bg-white rounded-lg border border-gray-200">
              <Label className="mb-3 block font-medium text-gray-700">Sente limitação ou dificuldade ao realizar movimentos? <span className="text-red-500">*</span></Label>
              <RadioGroup value={formData.movementLimitation} onValueChange={(value: "sim" | "nao") => handleRadioChange("movementLimitation", value)} className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="movement_sim" />
                  <Label htmlFor="movement_sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="movement_nao" />
                  <Label htmlFor="movement_nao">Não</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <Label className="mb-3 block font-medium text-gray-700">Já teve lesões ou cirurgias na região afetada? <span className="text-red-500">*</span></Label>
              <RadioGroup value={formData.injuryHistory} onValueChange={(value: "sim" | "nao") => handleRadioChange("injuryHistory", value)} className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="injury_sim" />
                  <Label htmlFor="injury_sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="injury_nao" />
                  <Label htmlFor="injury_nao">Não</Label>
                </div>
              </RadioGroup>
            </div>
            
            {error && step === 3 && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg" role="alert" aria-live="assertive">
                {error}
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">4. Contexto e Hábitos</h2>
            <p className="text-gray-600">Informações importantes sobre seu histórico e estilo de vida.</p>

            <div className="mb-4">
              <Label className="mb-3 block font-medium text-gray-700">Hábitos de Vida que podem influenciar sua saúde:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lifestyleHabits.map((h) => (
                  <div key={h} className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 transition-colors">
                    <Checkbox id={h} checked={formData.lifestyleHabits.includes(h)} onCheckedChange={() => handleToggle("lifestyleHabits", h)} />
                    <Label htmlFor={h} className="cursor-pointer">{h}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="previousTreatments">Já realizou algum tratamento de Fisioterapia ou Médico recente?</Label>
              <Textarea id="previousTreatments" name="previousTreatments" rows={3} value={formData.previousTreatments} onChange={handleInputChange} placeholder="Ex: sessões de acupuntura, cirurgia de menisco, uso de colete... (Opcional)" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="medications">Toma alguma medicação atualmente?</Label>
              <Textarea id="medications" name="medications" rows={3} value={formData.medications} onChange={handleInputChange} placeholder="Liste as medicações (Opcional)" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="additionalInfo">Deseja informar mais alguma coisa à Fisioterapeuta?</Label>
              <Textarea id="additionalInfo" name="additionalInfo" rows={4} value={formData.additionalInfo} onChange={handleInputChange} placeholder="Informações extras (Opcional)" />
            </div>
            
            {error && step === 4 && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg" role="alert" aria-live="assertive">
                {error}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // --- Renderização Principal ---
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>

          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Pré-Avaliação de Fisioterapia</h1>
            <p className="text-gray-600">Preencha para que a Fisioterapeuta Fabiana Rodrigues possa entender sua queixa e direcionar o atendimento.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {/* Indicador de Progresso Aprimorado */}
          <StepIndicator currentStep={step} />

          {submitted && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-md" role="alert" aria-live="assertive">
              Dados enviados via WhatsApp para Fabiana Rodrigues! Ela entrará em contato.
            </div>
          )}

          {/* Conteúdo da Etapa */}
          <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100">
            {renderStep()}
          </div>

          {/* Ações de Navegação */}
          <div className="flex justify-between gap-4 pt-6">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handleBack} className="flex items-center px-6 py-3 text-lg">
                <ArrowLeft className="w-5 h-5 mr-2" /> Anterior
              </Button>
            ) : (
              <div /> // Espaçador para manter o alinhamento
            )}

            {step < 4 ? (
              <Button type="button" onClick={handleNext} className="flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-3 text-lg shadow-md">
                Próximo <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button type="submit" className="flex items-center bg-green-600 hover:bg-green-700 px-6 py-3 text-lg shadow-md">
                <Send className="w-5 h-5 mr-2" /> Enviar via WhatsApp
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
