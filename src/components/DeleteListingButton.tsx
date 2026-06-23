"use client";

export function DeleteListingButton({ action }: { action: () => void }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("ต้องการลบประกาศนี้ใช่ไหม?")) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-red-200 px-4 py-1.5 font-medium text-red-600 hover:bg-red-50"
      >
        ลบ
      </button>
    </form>
  );
}
