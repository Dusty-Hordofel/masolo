import React, { useState, useTransition } from "react";
import { Check, ChevronDown, Filter, X, Search } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Option {
  value: string;
  label: string;
}

interface ListItem {
  id: string;
  name: string;
  framework: string;
  language: string;
  description: string;
  popularity: number;
}

interface MultiSelectProps {
  options: Option[];
  placeholder?: string;
  onSelectionChange?: (selectedValues: string[]) => void;
  selectedValues: string[];
}

function MultiSelect2({
  options,
  placeholder = "Sélectionnez des options...",
  onSelectionChange,
  selectedValues,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSelect = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];

    onSelectionChange?.(newSelected);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange?.([]);
    setOpen(false);
  };

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 p-2"
        >
          <div className="flex flex-wrap gap-1 flex-1 text-left">
            {selectedValues.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.slice(0, 3).map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="text-xs"
                  >
                    {option.label}
                  </Badge>
                ))}
                {selectedOptions.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedOptions.length - 3} autres
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedValues.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            {selectedValues.length === 0 && (
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" side="bottom">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div className="max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              Aucune option trouvée.
            </div>
          ) : (
            <div className="p-1">
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSelect(option.value)}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                      selectedValues.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50"
                    }`}
                  >
                    {selectedValues.includes(option.value) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <span className="flex-1">{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface SingleSelectProps {
  options: Option[];
  placeholder?: string;
  onSelectionChange?: (value: string) => void;
  selectedValue: string;
}

function SingleSelect({
  options,
  placeholder = "Sélectionnez une option...",
  onSelectionChange,
  selectedValue,
}: SingleSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelectionChange?.(value);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange?.("");
    setOpen(false);
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex-1 text-left">
            {selectedValue ? (
              <span className="text-sm">{selectedOption?.label}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedValue ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              Aucune option disponible.
            </div>
          ) : (
            <div className="p-1">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                    selectedValue === option.value
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border border-primary ${
                      selectedValue === option.value
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50"
                    }`}
                  >
                    {selectedValue === option.value && (
                      <div className="h-2 w-2 bg-primary-foreground rounded-full" />
                    )}
                  </div>
                  <span className="flex-1">{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const Index = () => {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  //   const [filteredItems, setFilteredItems] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const frameworks = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue.js" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte" },
    { value: "solid", label: "SolidJS" },
    { value: "qwik", label: "Qwik" },
    { value: "alpine", label: "Alpine.js" },
    { value: "lit", label: "Lit" },
    { value: "nextjs", label: "Next.js" },
    { value: "nuxt", label: "Nuxt.js" },
    { value: "gatsby", label: "Gatsby" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "kotlin", label: "Kotlin" },
  ];

  const allItems: ListItem[] = [
    {
      id: "1",
      name: "Application E-commerce",
      framework: "react",
      language: "typescript",
      description: "Boutique en ligne moderne avec panier d'achat",
      popularity: 95,
    },
    {
      id: "2",
      name: "Dashboard Analytics",
      framework: "vue",
      language: "javascript",
      description: "Tableau de bord pour analyser les données",
      popularity: 88,
    },
    {
      id: "3",
      name: "CRM System",
      framework: "angular",
      language: "typescript",
      description: "Système de gestion de la relation client",
      popularity: 82,
    },
    {
      id: "4",
      name: "Blog Personnel",
      framework: "nextjs",
      language: "javascript",
      description: "Site de blog avec SSG",
      popularity: 76,
    },
    {
      id: "5",
      name: "API REST",
      framework: "react",
      language: "python",
      description: "API backend pour applications mobiles",
      popularity: 91,
    },
    {
      id: "6",
      name: "Jeu en ligne",
      framework: "svelte",
      language: "typescript",
      description: "Jeu multijoueur en temps réel",
      popularity: 79,
    },
    {
      id: "7",
      name: "Portfolio",
      framework: "astro",
      language: "typescript",
      description: "Site portfolio statique",
      popularity: 73,
    },
    {
      id: "8",
      name: "Chat App",
      framework: "vue",
      language: "javascript",
      description: "Application de messagerie instantanée",
      popularity: 85,
    },
    {
      id: "9",
      name: "Gestion de tâches",
      framework: "react",
      language: "javascript",
      description: "Application de productivité",
      popularity: 87,
    },
    {
      id: "10",
      name: "Plateforme LMS",
      framework: "angular",
      language: "typescript",
      description: "Système de gestion d'apprentissage",
      popularity: 80,
    },
    {
      id: "11",
      name: "Boutique mobile",
      framework: "solid",
      language: "typescript",
      description: "Application e-commerce mobile",
      popularity: 72,
    },
    {
      id: "12",
      name: "Système de réservation",
      framework: "nuxt",
      language: "typescript",
      description: "Réservation d'hôtels et vols",
      popularity: 78,
    },
    {
      id: "13",
      name: "Calculatrice scientifique",
      framework: "lit",
      language: "javascript",
      description: "Calculatrice avancée pour étudiants",
      popularity: 71,
    },
    {
      id: "14",
      name: "Réseau social",
      framework: "remix",
      language: "typescript",
      description: "Plateforme sociale moderne",
      popularity: 83,
    },
    {
      id: "15",
      name: "Éditeur de code",
      framework: "qwik",
      language: "typescript",
      description: "IDE en ligne collaboratif",
      popularity: 75,
    },
    {
      id: "16",
      name: "Gestion d'inventaire",
      framework: "alpine",
      language: "javascript",
      description: "Suivi des stocks en temps réel",
      popularity: 77,
    },
    {
      id: "17",
      name: "Plateforme de streaming",
      framework: "gatsby",
      language: "javascript",
      description: "Service de streaming vidéo",
      popularity: 89,
    },
    {
      id: "18",
      name: "Application bancaire",
      framework: "react",
      language: "java",
      description: "Gestion de comptes bancaires",
      popularity: 93,
    },
    {
      id: "19",
      name: "Système de vote",
      framework: "vue",
      language: "python",
      description: "Plateforme de vote électronique",
      popularity: 74,
    },
    {
      id: "20",
      name: "Gestionnaire de mot de passe",
      framework: "svelte",
      language: "rust",
      description: "Sécurisation des mots de passe",
      popularity: 86,
    },
  ];

  const filteredItems = allItems.filter((item) => {
    const frameworkMatch =
      selectedFrameworks.length === 0 ||
      selectedFrameworks.includes(item.framework);
    const languageMatch =
      !selectedLanguage || item.language === selectedLanguage;
    return frameworkMatch && languageMatch;
  });

  const handleClearAllFilters = () => {
    setSelectedFrameworks([]);
    setSelectedLanguage("");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Composants de Sélection avec Popover
          </h1>
          <p className="text-xl text-muted-foreground">
            Multi-sélection et sélection unique avec shadcn/ui Popover
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recherche</CardTitle>
            <CardDescription>
              Recherchez par nom ou description de projet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des projets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Multi-Select */}
          <Card>
            <CardHeader>
              <CardTitle>Multi-Select Frameworks</CardTitle>
              <CardDescription>
                Sélectionnez plusieurs frameworks avec Popover
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Frameworks</Label>
                <MultiSelect
                  options={frameworks}
                  placeholder="Choisissez des frameworks..."
                  onSelectionChange={setSelectedFrameworks}
                  selectedValues={selectedFrameworks}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Sélectionné: {selectedFrameworks.length} élément(s)
                </Label>
                {selectedFrameworks.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedFrameworks.map((value) => {
                      const framework = frameworks.find(
                        (f) => f.value === value
                      );
                      return framework ? (
                        <Badge key={value} variant="outline">
                          {framework.label}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Single Select */}
          <Card>
            <CardHeader>
              <CardTitle>Select Langage</CardTitle>
              <CardDescription>
                Sélectionnez un langage avec Popover
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Langage</Label>
                <SingleSelect
                  options={languages}
                  placeholder="Choisissez un langage..."
                  onSelectionChange={setSelectedLanguage}
                  selectedValue={selectedLanguage}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Sélectionné:{" "}
                  {selectedLanguage
                    ? languages.find((l) => l.value === selectedLanguage)?.label
                    : "Aucun"}
                </Label>
                {selectedLanguage && (
                  <Badge variant="outline">
                    {languages.find((l) => l.value === selectedLanguage)?.label}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres actifs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <CardTitle>Filtres actifs</CardTitle>
              </div>

              {(selectedFrameworks.length > 0 || selectedLanguage) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAllFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Effacer tout
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="font-medium">Frameworks sélectionnés:</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedFrameworks.length > 0
                    ? selectedFrameworks.length
                    : "Tous"}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="font-medium">Langage sélectionné:</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedLanguage
                    ? languages.find((l) => l.value === selectedLanguage)?.label
                    : "Tous"}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="font-medium">Résultats:</Label>
                <p className="text-sm text-primary font-semibold">
                  {filteredItems.length} projets
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste filtrée */}
        <Card>
          <CardHeader>
            <CardTitle>Projets filtrés ({filteredItems.length})</CardTitle>
            <CardDescription>
              {selectedFrameworks.length > 0 || selectedLanguage
                ? "Résultats filtrés selon vos critères"
                : "Tous les projets disponibles"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    Aucun projet ne correspond à vos critères
                  </p>
                  <p className="text-sm mt-2">
                    Essayez de modifier vos filtres
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>

                          <div className="flex items-center gap-2">
                            <Badge variant="default">
                              {
                                frameworks.find(
                                  (f) => f.value === item.framework
                                )?.label
                              }
                            </Badge>
                            <Badge variant="secondary">
                              {
                                languages.find((l) => l.value === item.language)
                                  ?.label
                              }
                            </Badge>
                          </div>
                        </div>

                        <div className="text-right space-y-2 min-w-20">
                          <div className="text-sm font-medium">
                            {item.popularity}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Popularité
                          </div>
                          <Progress value={item.popularity} className="w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
