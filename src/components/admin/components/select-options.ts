// types/select-options.ts
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

// constants/select-options.ts

// Types de fichiers
export const FILE_TYPE_OPTIONS: SelectOption[] = [
  //   {
  //     value: "all",
  //     label: "Tous les types",
  //     description: "Afficher tous les types de fichiers",
  //   },
  {
    value: "images",
    label: "Images",
    description: "JPG, PNG, GIF, SVG, WebP",
  },
  {
    value: "videos",
    label: "Vidéos",
    description: "MP4, AVI, MOV, WebM",
  },
  {
    value: "external-videos",
    label: "Vidéos externes",
    description: "YouTube, Vimeo, etc.",
  },
  {
    value: "3d-models",
    label: "Modèles 3D",
    description: "OBJ, FBX, GLB, GLTF",
  },
  //   {
  //     value: "documents",
  //     label: "Documents",
  //     description: "PDF, DOC, DOCX, TXT",
  //   },
  //   {
  //     value: "audio",
  //     label: "Audio",
  //     description: "MP3, WAV, OGG",
  //   },
  //   {
  //     value: "archives",
  //     label: "Archives",
  //     description: "ZIP, RAR, 7Z",
  //   },
];

// Utilisation des fichiers
export const USAGE_OPTIONS: SelectOption[] = [
  {
    value: "all",
    label: "Tous",
    description: "Tous les usages",
  },
  {
    value: "product-media",
    label: "Supports multimédias du produit",
    description: "Images et vidéos produit",
  },
  {
    value: "marketing",
    label: "Marketing",
    description: "Contenus promotionnels",
  },
  {
    value: "documentation",
    label: "Documentation",
    description: "Manuels et guides",
  },
  {
    value: "presentation",
    label: "Présentation",
    description: "Slides et présentations",
  },
  {
    value: "social-media",
    label: "Réseaux sociaux",
    description: "Contenus pour les réseaux sociaux",
  },
  {
    value: "other",
    label: "Autre",
    description: "Autres usages",
  },
];

// Statuts de fichiers
export const STATUS_OPTIONS: SelectOption[] = [
  {
    value: "all",
    label: "Tous les statuts",
  },
  {
    value: "active",
    label: "Actif",
  },
  {
    value: "inactive",
    label: "Inactif",
  },
  {
    value: "pending",
    label: "En attente",
  },
  {
    value: "archived",
    label: "Archivé",
  },
  {
    value: "draft",
    label: "Brouillon",
  },
];

// Tailles de fichiers
export const SIZE_OPTIONS: SelectOption[] = [
  {
    value: "all",
    label: "Toutes les tailles",
  },
  {
    value: "small",
    label: "Petit (< 1 MB)",
  },
  {
    value: "medium",
    label: "Moyen (1-10 MB)",
  },
  {
    value: "large",
    label: "Grand (10-100 MB)",
  },
  {
    value: "xl",
    label: "Très grand (> 100 MB)",
  },
];

// Dates de création
export const DATE_OPTIONS: SelectOption[] = [
  {
    value: "all",
    label: "Toutes les dates",
  },
  {
    value: "today",
    label: "Aujourd'hui",
  },
  {
    value: "week",
    label: "Cette semaine",
  },
  {
    value: "month",
    label: "Ce mois",
  },
  {
    value: "quarter",
    label: "Ce trimestre",
  },
  {
    value: "year",
    label: "Cette année",
  },
  {
    value: "custom",
    label: "Période personnalisée",
  },
];

// Qualité/Résolution pour les médias
export const QUALITY_OPTIONS: SelectOption[] = [
  {
    value: "all",
    label: "Toutes les qualités",
  },
  {
    value: "low",
    label: "Basse (480p)",
  },
  {
    value: "medium",
    label: "Moyenne (720p)",
  },
  {
    value: "high",
    label: "Haute (1080p)",
  },
  {
    value: "ultra",
    label: "Ultra (4K+)",
  },
];

// Propriétaires/Créateurs
export const OWNER_OPTIONS: SelectOption[] = [
  {
    value: "all",
    label: "Tous les propriétaires",
  },
  {
    value: "me",
    label: "Mes fichiers",
  },
  {
    value: "team",
    label: "Équipe",
  },
  {
    value: "shared",
    label: "Partagés avec moi",
  },
  {
    value: "public",
    label: "Public",
  },
];

// Tags/Catégories
export const TAG_OPTIONS: SelectOption[] = [
  {
    value: "all",
    label: "Tous les tags",
  },
  {
    value: "important",
    label: "Important",
  },
  {
    value: "urgent",
    label: "Urgent",
  },
  {
    value: "review",
    label: "À réviser",
  },
  {
    value: "approved",
    label: "Approuvé",
  },
  {
    value: "rejected",
    label: "Rejeté",
  },
];

// Permissions/Visibilité
export const PERMISSION_OPTIONS: SelectOption[] = [
  {
    value: "all",
    label: "Toutes les permissions",
  },
  {
    value: "private",
    label: "Privé",
  },
  {
    value: "team",
    label: "Équipe",
  },
  {
    value: "organization",
    label: "Organisation",
  },
  {
    value: "public",
    label: "Public",
  },
];

// Langues
export const LANGUAGE_OPTIONS: SelectOption[] = [
  {
    value: "all",
    label: "Toutes les langues",
  },
  {
    value: "fr",
    label: "Français",
  },
  {
    value: "en",
    label: "Anglais",
  },
  {
    value: "es",
    label: "Espagnol",
  },
  {
    value: "de",
    label: "Allemand",
  },
  {
    value: "it",
    label: "Italien",
  },
  {
    value: "pt",
    label: "Portugais",
  },
];

// Formats spécifiques pour les images
export const IMAGE_FORMAT_OPTIONS: SelectOption[] = [
  {
    value: "all",
    label: "Tous les formats",
  },
  {
    value: "jpg",
    label: "JPG/JPEG",
  },
  {
    value: "png",
    label: "PNG",
  },
  {
    value: "gif",
    label: "GIF",
  },
  {
    value: "svg",
    label: "SVG",
  },
  {
    value: "webp",
    label: "WebP",
  },
  {
    value: "bmp",
    label: "BMP",
  },
  {
    value: "tiff",
    label: "TIFF",
  },
];

// Formats spécifiques pour les vidéos
export const VIDEO_FORMAT_OPTIONS: SelectOption[] = [
  {
    value: "all",
    label: "Tous les formats",
  },
  {
    value: "mp4",
    label: "MP4",
  },
  {
    value: "avi",
    label: "AVI",
  },
  {
    value: "mov",
    label: "MOV",
  },
  {
    value: "webm",
    label: "WebM",
  },
  {
    value: "mkv",
    label: "MKV",
  },
  {
    value: "wmv",
    label: "WMV",
  },
];

// Groupes d'options pour les selects complexes
export const GROUPED_FILE_OPTIONS: SelectGroup[] = [
  {
    label: "Médias",
    options: [
      { value: "images", label: "Images" },
      { value: "videos", label: "Vidéos" },
      { value: "audio", label: "Audio" },
    ],
  },
  {
    label: "Documents",
    options: [
      { value: "documents", label: "Documents" },
      { value: "presentations", label: "Présentations" },
      { value: "spreadsheets", label: "Tableurs" },
    ],
  },
  {
    label: "Autres",
    options: [
      { value: "3d-models", label: "Modèles 3D" },
      { value: "archives", label: "Archives" },
      { value: "other", label: "Autres" },
    ],
  },
];

// Tri/Ordonnancement
export const SORT_OPTIONS: SelectOption[] = [
  {
    value: "name-asc",
    label: "Nom (A-Z)",
  },
  {
    value: "name-desc",
    label: "Nom (Z-A)",
  },
  {
    value: "date-desc",
    label: "Plus récent",
  },
  {
    value: "date-asc",
    label: "Plus ancien",
  },
  {
    value: "size-desc",
    label: "Plus volumineux",
  },
  {
    value: "size-asc",
    label: "Moins volumineux",
  },
  {
    value: "popular",
    label: "Plus populaire",
  },
];

export const FILE_SORT_OPTIONS: SelectOption[] = [
  {
    value: "date-desc",
    label: "Date d'ajout (le plus récent en premier)",
  },
  {
    value: "date-asc",
    label: "Date d'ajout (le plus ancien en premier)",
  },
  {
    value: "name-asc",
    label: "Nom du fichier (A-Z)",
  },
  {
    value: "name-desc",
    label: "Nom du fichier (Z-A)",
  },
  {
    value: "size-asc",
    label: "Taille du fichier (le plus petit en premier)",
  },
  {
    value: "size-desc",
    label: "Taille du fichier (le plus grand en premier)",
  },
];

export const MEDIA_USAGE_FILTER_OPTIONS = [
  {
    value: "all",
    label: "Tous",
  },
  {
    value: "Supports multimédias du produit",
    label: "Supports multimédias du produit",
  },
  {
    value: "Autre",
    label: "Autre",
  },
];
export const PRODUCT_OPTIONS: SelectOption[] = [
  {
    value: "all",
    label: "Tous les produits",
    description: "Afficher tous les produits disponibles",
  },
  {
    value: "ocean-blue-shirt",
    label: "Ocean Blue Shirt",
    description: "Chemise bleue océan",
  },
  {
    value: "classic-varsity-top",
    label: "Classic Varsity Top",
    description: "Haut varsity classique",
  },
  {
    value: "yellow-wool-jumper",
    label: "Yellow Wool Jumper",
    description: "Pull en laine jaune",
  },
  {
    value: "floral-white-top",
    label: "Floral White Top",
    description: "Haut blanc à motifs floraux",
  },
  {
    value: "striped-silk-blouse",
    label: "Striped Silk Blouse",
    description: "Blouse en soie rayée",
  },
  {
    value: "classic-leather-jacket",
    label: "Classic Leather Jacket",
    description: "Veste en cuir classique",
  },
  {
    value: "dark-denim-top",
    label: "Dark Denim Top",
    description: "Haut en denim foncé",
  },
  {
    value: "navy-sports-jacket",
    label: "Navy Sports Jacket",
    description: "Veste de sport marine",
  },
  {
    value: "soft-winter-jacket",
    label: "Soft Winter Jacket",
    description: "Veste d'hiver douce",
  },
  {
    value: "black-leather-bag",
    label: "Black Leather Bag",
    description: "Sac en cuir noir",
  },
  {
    value: "zipped-jacket",
    label: "Zipped Jacket",
    description: "Veste à fermeture éclair",
  },
  {
    value: "silk-summer-top",
    label: "Silk Summer Top",
    description: "Haut d'été en soie",
  },
  {
    value: "long-sleeve-cotton-top",
    label: "Long Sleeve Cotton Top",
    description: "Haut en coton à manches longues",
  },
  {
    value: "chequered-red-shirt",
    label: "Chequered Red Shirt",
    description: "Chemise à carreaux rouge",
  },
  {
    value: "white-cotton-shirt",
    label: "White Cotton Shirt",
    description: "Chemise en coton blanc",
  },
  {
    value: "olive-green-jacket",
    label: "Olive Green Jacket",
    description: "Veste vert olive",
  },
  {
    value: "blue-silk-tuxedo",
    label: "Blue Silk Tuxedo",
    description: "Smoking en soie bleue",
  },
  {
    value: "red-sports-tee",
    label: "Red Sports Tee",
    description: "T-shirt de sport rouge",
  },
  {
    value: "striped-skirt-and-top",
    label: "Striped Skirt and Top",
    description: "Ensemble jupe et haut rayé",
  },
  {
    value: "led-high-tops",
    label: "LED High Tops",
    description: "Baskets montantes à LED",
  },
];
// Fonction utilitaire pour trouver une option par sa valeur
export const findOptionByValue = (
  options: SelectOption[],
  value: string
): SelectOption | undefined => {
  return options.find((option) => option.value === value);
};

// Fonction utilitaire pour obtenir le label d'une option
export const getOptionLabel = (
  options: SelectOption[],
  value: string
): string => {
  const option = findOptionByValue(options, value);
  return option ? option.label : value;
};

// Fonction utilitaire pour filtrer les options
export const filterOptions = (
  options: SelectOption[],
  searchTerm: string
): SelectOption[] => {
  if (!searchTerm) return options;

  const term = searchTerm.toLowerCase();
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(term) ||
      option.description?.toLowerCase().includes(term)
  );
};

// Types pour TypeScript
export type FileType = (typeof FILE_TYPE_OPTIONS)[number]["value"];
export type UsageType = (typeof USAGE_OPTIONS)[number]["value"];
export type StatusType = (typeof STATUS_OPTIONS)[number]["value"];
export type SizeType = (typeof SIZE_OPTIONS)[number]["value"];
export type DateType = (typeof DATE_OPTIONS)[number]["value"];
export type QualityType = (typeof QUALITY_OPTIONS)[number]["value"];
export type OwnerType = (typeof OWNER_OPTIONS)[number]["value"];
export type TagType = (typeof TAG_OPTIONS)[number]["value"];
export type PermissionType = (typeof PERMISSION_OPTIONS)[number]["value"];
export type LanguageType = (typeof LANGUAGE_OPTIONS)[number]["value"];
export type SortType = (typeof SORT_OPTIONS)[number]["value"];
