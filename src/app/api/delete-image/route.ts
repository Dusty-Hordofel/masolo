// app/api/delete-image/route.ts (Next.js 14 App Router avec TypeScript)

import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Interface pour le body de la requête
interface DeleteImageRequest {
  publicId: string;
}

// Interface pour la réponse Cloudinary
interface CloudinaryDestroyResponse {
  result: "ok" | "not found" | string;
  [key: string]: any;
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body: DeleteImageRequest = await request.json();
    const { publicId } = body;

    // Validation du publicId
    if (!publicId || typeof publicId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Le publicId est requis et doit être une chaîne de caractères.",
        },
        { status: 400 }
      );
    }

    // Vérifier que les variables d'environnement sont configurées
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Variables d'environnement Cloudinary manquantes");
      return NextResponse.json(
        {
          success: false,
          error: "Configuration serveur manquante.",
        },
        { status: 500 }
      );
    }

    console.log(`Tentative de suppression de l'image: ${publicId}`);

    // Supprimer l'image de Cloudinary
    const result: CloudinaryDestroyResponse = await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
        invalidate: true, // Invalide le cache CDN
      }
    );

    console.log("Résultat de la suppression:", result);

    // Vérifier le résultat de la suppression
    if (result.result === "ok") {
      return NextResponse.json({
        success: true,
        message: "Image supprimée avec succès.",
        publicId: publicId,
        cloudinaryResponse: result,
      });
    } else if (result.result === "not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Image non trouvée sur Cloudinary.",
          publicId: publicId,
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Échec de la suppression sur Cloudinary.",
          cloudinaryResponse: result,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Erreur lors de la suppression de l'image:", error);

    // Gestion des erreurs de parsing JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "Format JSON invalide dans la requête.",
        },
        { status: 400 }
      );
    }

    // Gestion des erreurs spécifiques de Cloudinary
    if (error.http_code) {
      return NextResponse.json(
        {
          success: false,
          error: `Erreur Cloudinary: ${error.message}`,
          details: error,
        },
        { status: error.http_code }
      );
    }

    // Erreur générique
    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne du serveur lors de la suppression.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Optionnel: Gérer les autres méthodes HTTP
export async function GET() {
  return NextResponse.json(
    { error: "Méthode GET non supportée. Utilisez DELETE." },
    { status: 405 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Méthode POST non supportée. Utilisez DELETE." },
    { status: 405 }
  );
}
