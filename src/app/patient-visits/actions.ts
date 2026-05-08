"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export type StaffActionState = { error?: string; ok?: true };

// helper for auth check and guest user detection
async function getAuthContext(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthenticated");
  return {
    user,
    isGuest: user.email === "guest@rahayumedika.com",
  };
}

// --- function to add new patient ---
export async function createPatient(
  formData: FormData,
): Promise<StaffActionState> {
  // ekstak data
  try {
    // variabel database
    const supabase = await createClient();
    const { isGuest } = await getAuthContext(supabase);
    const data = {
      patient_name: String(formData.get("patient_name")).trim(),
      mr_number: Number(formData.get("mr_number")),
      gender: String(formData.get("gender")),
      birth_date: String(formData.get("birth_date")),
      phone: String(formData.get("phone")).replace(/\D/g, ""),
      address: String(formData.get("address")).trim(),
      is_demo: isGuest,
    };

    // validasi data
    if (!data.patient_name) return { error: "Nama Pasien wajib diisi." };

    // inset data
    const { error: dbError } = await supabase.from("patients").insert(data);

    // error handling
    if (dbError) return { error: dbError.message };

    // revalidasi cache
    revalidatePath("/patient-visits");
    return { ok: true };
  } catch (err: any) {
    console.error("Unexpected Error:", err);
    return {
      error: `Terjadi kesalahan tak terduga. Silakan coba lagi. ${err.message}`,
    };
  }
}
