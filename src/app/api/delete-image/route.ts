import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface DeleteImageRequest {
  publicId: string;
}

interface CloudinaryDestroyResponse {
  result: "ok" | "not found" | string;
  [key: string]: unknown;
}

// ✅ Helper pour typer les erreurs Cloudinary
function isCloudinaryError(
  error: unknown
): error is { http_code: number; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "http_code" in error &&
    "message" in error
  );
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body: DeleteImageRequest = await request.json();
    const { publicId } = body;

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

    const result: CloudinaryDestroyResponse = await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
        invalidate: true,
      }
    );

    console.log("Résultat de la suppression:", result);

    if (result.result === "ok") {
      return NextResponse.json({
        success: true,
        message: "Image supprimée avec succès.",
        publicId,
        cloudinaryResponse: result,
      });
    } else if (result.result === "not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Image non trouvée sur Cloudinary.",
          publicId,
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
  } catch (error: unknown) {
    console.error("Erreur lors de la suppression de l'image:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "Format JSON invalide dans la requête.",
        },
        { status: 400 }
      );
    }

    if (isCloudinaryError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: `Erreur Cloudinary: ${error.message}`,
          details: error,
        },
        { status: error.http_code }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne du serveur lors de la suppression.",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}

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
