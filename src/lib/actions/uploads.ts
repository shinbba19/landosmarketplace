"use server";

import { randomUUID } from "crypto";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";

export async function uploadListingImages(files: File[], pathPrefix: string): Promise<string[]> {
  const urls: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${pathPrefix}/${randomUUID()}.${ext}`;

    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) throw new Error(`Image upload failed: ${error.message}`);

    const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}
