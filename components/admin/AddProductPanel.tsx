"use client";

import { useState } from "react";
import ProductForm from "@/components/admin/ProductForm";

export default function AddProductPanel() {
  const [formKey, setFormKey] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Add Products
        </h1>
        <p className="text-sm text-neutral-500">
          Create a product with 1 to 3 images.
        </p>
      </header>

      <ProductForm
        key={formKey}
        onSaved={() => setFormKey((value) => value + 1)}
      />
    </div>
  );
}
