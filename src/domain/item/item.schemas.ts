import { z } from "zod";

const idSchema = z.string().min(1, "Required identifier");
const optionalIdSchema = idSchema.optional().nullable();
const decimalStringSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Expected a positive decimal value with up to two decimals");
const optionalDecimalStringSchema = decimalStringSchema.optional().nullable();
const dateStringSchema = z.string().datetime({ offset: true });
const optionalDateStringSchema = dateStringSchema.optional().nullable();

const itemSaleFieldsSchema = z.object({
  isSold: z.boolean().default(false),
  soldPrice: optionalDecimalStringSchema,
  soldCurrencyId: optionalIdSchema,
  soldDate: optionalDateStringSchema
});

function validateSaleState(
  value: {
    isSold?: boolean;
    soldPrice?: string | null;
    soldCurrencyId?: string | null;
    soldDate?: string | null;
  },
  context: z.RefinementCtx
) {
  if (!value.isSold && (value.soldPrice || value.soldCurrencyId || value.soldDate)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Unsold items cannot include sale details",
      path: ["isSold"]
    });
  }

  if (value.isSold && (!value.soldPrice || !value.soldCurrencyId)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Sold items require sale price and sale currency",
      path: ["soldPrice"]
    });
  }
}

const createItemFieldsSchema = z.object({
  collectionId: idSchema,
  brandId: idSchema,
  model: z.string().trim().min(1).max(160),
  manufacturerId: idSchema,
  scaleId: optionalIdSchema,
  countryId: optionalIdSchema,
  companyId: optionalIdSchema,
  purchaseDate: dateStringSchema,
  purchaseValue: optionalDecimalStringSchema,
  purchaseCurrencyId: optionalIdSchema,
  purchaseConditionId: idSchema,
  estimatedValue: optionalDecimalStringSchema,
  estimatedValueCurrencyId: optionalIdSchema,
  estimatedValueDate: optionalDateStringSchema,
  conditionId: optionalIdSchema,
  referenceNumber: z.string().trim().max(120).optional().nullable(),
  locationId: optionalIdSchema,
  notes: z.string().trim().max(4000).optional().nullable()
});

export const itemSaleSchema = itemSaleFieldsSchema.superRefine(validateSaleState);
export const createItemSchema = createItemFieldsSchema
  .merge(itemSaleFieldsSchema)
  .superRefine(validateSaleState);
export const updateItemSchema = createItemFieldsSchema
  .partial()
  .merge(itemSaleFieldsSchema.partial())
  .extend({ id: idSchema })
  .superRefine(validateSaleState);

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;

export type CountrySource = {
  countryId?: string | null;
};

export function deriveDisplayCountryId({
  company,
  brand
}: {
  company?: CountrySource | null;
  brand?: CountrySource | null;
}) {
  return company?.countryId ?? brand?.countryId ?? null;
}
