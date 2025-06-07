import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Aucun fichier trouvé" },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      // Convertir le fichier en buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
              folder: "uploads", // Optionnel: organise tes images dans un dossier
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  public_id: result?.public_id,
                  secure_url: result?.secure_url,
                  width: result?.width,
                  height: result?.height,
                });
              }
            }
          )
          .end(buffer);
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    return NextResponse.json({
      message: "Images téléchargées avec succès",
      images: uploadResults,
    });
  } catch (error) {
    console.error("Erreur upload:", error);
    return NextResponse.json(
      { error: "Erreur lors du téléchargement" },
      { status: 500 }
    );
  }
}

// importation en cours
// traitement en cours
