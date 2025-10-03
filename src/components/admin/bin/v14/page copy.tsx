"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Check,
  User,
  Mail,
  Settings,
  Globe,
  Palette,
  Calendar,
  Star,
  Shield,
  Zap,
} from "lucide-react";

// Types pour les options
interface Option {
  value: string;
  label: string;
}

// Props pour le composant Popover
interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Props pour le composant Select
interface SelectProps {
  placeholder: string;
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Composant Popover personnalisé
const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  open,
  onOpenChange,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={popoverRef} className="relative">
      <div onClick={() => onOpenChange(!open)}>{trigger}</div>
      {open && (
        <div className="absolute z-50 mt-2 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
};

// Composant Select/Dropdown personnalisé
const Select: React.FC<SelectProps> = ({
  placeholder,
  options,
  value,
  onValueChange,
  open,
  onOpenChange,
}) => {
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange]);

  const displayValue = value
    ? options.find((option) => option.value === value)?.label
    : placeholder;

  return (
    <div ref={selectRef} className="relative">
      <button
        onClick={() => onOpenChange(!open)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {displayValue}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onValueChange(option.value);
                onOpenChange(false);
              }}
              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            >
              <Check
                className={`mr-2 h-4 w-4 ${
                  value === option.value ? "opacity-100" : "opacity-0"
                }`}
              />
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Type pour les composants ouverts
type OpenComponent =
  | "country"
  | "language"
  | "theme"
  | "currency"
  | "priority"
  | "status"
  | null;

const SelectComponents: React.FC = () => {
  const [openComponent, setOpenComponent] = useState<OpenComponent>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleOpenChange = (
    componentName: OpenComponent,
    isOpen: boolean
  ): void => {
    if (isOpen) {
      setOpenComponent(componentName);
    } else {
      setOpenComponent(null);
    }
  };

  const countries: Option[] = [
    { value: "fr", label: "France" },
    { value: "us", label: "États-Unis" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "Royaume-Uni" },
    { value: "de", label: "Allemagne" },
  ];

  const languages: Option[] = [
    { value: "fr", label: "Français" },
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "de", label: "Deutsch" },
    { value: "it", label: "Italiano" },
  ];

  const themes: Option[] = [
    { value: "light", label: "Clair" },
    { value: "dark", label: "Sombre" },
    { value: "system", label: "Système" },
  ];

  const currencies: Option[] = [
    { value: "eur", label: "Euro (€)" },
    { value: "usd", label: "Dollar US ($)" },
    { value: "gbp", label: "Livre Sterling (£)" },
    { value: "jpy", label: "Yen (¥)" },
    { value: "cad", label: "Dollar Canadien (C$)" },
  ];

  const priorities: Option[] = [
    { value: "low", label: "Faible" },
    { value: "medium", label: "Moyenne" },
    { value: "high", label: "Élevée" },
    { value: "urgent", label: "Urgente" },
  ];

  const statuses: Option[] = [
    { value: "pending", label: "En attente" },
    { value: "in-progress", label: "En cours" },
    { value: "completed", label: "Terminé" },
    { value: "cancelled", label: "Annulé" },
  ];

  const getSelectedLabel = (value: string, options: Option[]): string => {
    return value
      ? options.find((option) => option.value === value)?.label || "Aucun"
      : "Aucun";
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Composants de sélection
          </h1>
          <p className="mt-2 text-muted-foreground">
            6 composants : 2 popovers, 1 dropdown et 3 selects - Seul un peut
            être ouvert à la fois
          </p>
        </div>

        <div className="space-y-6">
          {/* Popover 1 - Sélection de pays */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Pays (Popover)</label>
            <Popover
              open={openComponent === "country"}
              onOpenChange={(open) => handleOpenChange("country", open)}
              trigger={
                <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span
                      className={
                        selectedCountry
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {getSelectedLabel(selectedCountry, countries) !== "Aucun"
                        ? getSelectedLabel(selectedCountry, countries)
                        : "Sélectionner un pays"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              }
            >
              <div className="space-y-1">
                {countries.map((country) => (
                  <div
                    key={country.value}
                    onClick={() => {
                      setSelectedCountry(country.value);
                      handleOpenChange("country", false);
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <Check
                      className={`h-4 w-4 ${
                        selectedCountry === country.value
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {country.label}
                  </div>
                ))}
              </div>
            </Popover>
          </div>

          {/* Popover 2 - Sélection de langue */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Langue (Popover)</label>
            <Popover
              open={openComponent === "language"}
              onOpenChange={(open) => handleOpenChange("language", open)}
              trigger={
                <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span
                      className={
                        selectedLanguage
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {getSelectedLabel(selectedLanguage, languages) !== "Aucun"
                        ? getSelectedLabel(selectedLanguage, languages)
                        : "Sélectionner une langue"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              }
            >
              <div className="space-y-1">
                {languages.map((language) => (
                  <div
                    key={language.value}
                    onClick={() => {
                      setSelectedLanguage(language.value);
                      handleOpenChange("language", false);
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <Check
                      className={`h-4 w-4 ${
                        selectedLanguage === language.value
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {language.label}
                  </div>
                ))}
              </div>
            </Popover>
          </div>

          {/* Dropdown - Sélection de thème */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Thème (Dropdown)</label>
            <Select
              placeholder="Sélectionner un thème"
              options={themes}
              value={selectedTheme}
              onValueChange={setSelectedTheme}
              open={openComponent === "theme"}
              onOpenChange={(open) => handleOpenChange("theme", open)}
            />
          </div>

          {/* Select 1 - Sélection de devise */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Devise (Select)</label>
            <Select
              placeholder="Sélectionner une devise"
              options={currencies}
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
              open={openComponent === "currency"}
              onOpenChange={(open) => handleOpenChange("currency", open)}
            />
          </div>

          {/* Select 2 - Sélection de priorité */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Priorité (Select)</label>
            <Select
              placeholder="Sélectionner une priorité"
              options={priorities}
              value={selectedPriority}
              onValueChange={setSelectedPriority}
              open={openComponent === "priority"}
              onOpenChange={(open) => handleOpenChange("priority", open)}
            />
          </div>

          {/* Select 3 - Sélection de statut */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Statut (Select)</label>
            <Select
              placeholder="Sélectionner un statut"
              options={statuses}
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              open={openComponent === "status"}
              onOpenChange={(open) => handleOpenChange("status", open)}
            />
          </div>

          {/* Affichage des valeurs sélectionnées */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="font-medium mb-3">Valeurs sélectionnées :</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>
                  Pays : {getSelectedLabel(selectedCountry, countries)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>
                  Langue : {getSelectedLabel(selectedLanguage, languages)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Thème : {getSelectedLabel(selectedTheme, themes)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>
                  Devise : {getSelectedLabel(selectedCurrency, currencies)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>
                  Priorité : {getSelectedLabel(selectedPriority, priorities)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>
                  Statut : {getSelectedLabel(selectedStatus, statuses)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectComponents;
