import * as z from 'zod';

export const supplierSchema = z.object({
  id: z.string().optional(),
  namaSupplier: z.string(),
  noTelp: z.string().nullable(),
  alamat: z.string().nullable(),
});

export const barangSchema = z.object({
  id: z.string().optional(),
  namaBarang: z.string(),
  harga: z.string(),
  stok: z.string(),
  supplier: supplierSchema,
});

export const updateSupplierSchema = supplierSchema.extend({
  id: z.string().min(1, { message: 'This field is required' }),
});

export const responseSchema = z.object({
  data: z.array(barangSchema),
  message: z.string(),
  status: z.string(),
  limit: z.number(),
  page: z.number(),
  total_page: z.number(),
  total_record: z.number(),
});

export type ISupplier = z.infer<typeof supplierSchema>;
export type IUpdateSupplier = z.infer<typeof updateSupplierSchema>;
export type IBarang = z.infer<typeof barangSchema>;
export type IResponse = z.infer<typeof responseSchema>;
