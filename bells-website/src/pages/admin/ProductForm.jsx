import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, CATEGORY_LIST } from "../../schemas/productSchema.js";
import { categoryLabel } from "../../data/categories.js";

export default function ProductForm({ defaultValues, onSubmit, submitLabel }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      slug: "",
      name: "",
      category: CATEGORY_LIST[0],
      brand: "",
      price: 0,
      salePrice: "",
      onSale: false,
      isNewArrival: false,
      stock: 0,
      image: "",
      description: "",
    },
  });

  const onSale = watch("onSale");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field-row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" {...register("name")} aria-invalid={Boolean(errors.name)} />
          {errors.name && <span className="field-error">{errors.name.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="slug">Slug</label>
          <input id="slug" {...register("slug")} aria-invalid={Boolean(errors.slug)} />
          {errors.slug && <span className="field-error">{errors.slug.message}</span>}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" {...register("category")}>
            {CATEGORY_LIST.map((c) => (
              <option key={c} value={c}>{categoryLabel(c)}</option>
            ))}
          </select>
          {errors.category && <span className="field-error">{errors.category.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="brand">Brand</label>
          <input id="brand" {...register("brand")} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="price">Price ($)</label>
          <input id="price" type="number" step="0.01" {...register("price")} aria-invalid={Boolean(errors.price)} />
          {errors.price && <span className="field-error">{errors.price.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="stock">Stock</label>
          <input id="stock" type="number" {...register("stock")} aria-invalid={Boolean(errors.stock)} />
          {errors.stock && <span className="field-error">{errors.stock.message}</span>}
        </div>
      </div>

      <div className="admin-checkbox-field">
        <input id="onSale" type="checkbox" {...register("onSale")} />
        <label htmlFor="onSale">On sale</label>
      </div>

      {onSale && (
        <div className="field">
          <label htmlFor="salePrice">Sale price ($)</label>
          <input id="salePrice" type="number" step="0.01" {...register("salePrice")} aria-invalid={Boolean(errors.salePrice)} />
          {errors.salePrice && <span className="field-error">{errors.salePrice.message}</span>}
        </div>
      )}

      <div className="admin-checkbox-field">
        <input id="isNewArrival" type="checkbox" {...register("isNewArrival")} />
        <label htmlFor="isNewArrival">New arrival</label>
      </div>

      <div className="field">
        {/* Plain URL field for now — swap this for a Cloudinary upload widget later */}
        <label htmlFor="image">Main image URL</label>
        <input id="image" {...register("image")} aria-invalid={Boolean(errors.image)} />
        {errors.image && <span className="field-error">{errors.image.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" rows={5} {...register("description")} />
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
