import { describe, expect, it } from "vitest";
import { createItemSchema, deriveDisplayCountryId } from "@/domain/item";

const baseItemInput = {
  collectionId: "collection-id",
  brandId: "brand-id",
  model: "R 500",
  manufacturerId: "manufacturer-id",
  purchaseDate: "2026-05-12T00:00:00.000Z",
  purchaseConditionId: "purchase-condition-id"
};

describe("createItemSchema", () => {
  it("accepts the required initial item fields", () => {
    const result = createItemSchema.safeParse(baseItemInput);

    expect(result.success).toBe(true);
  });

  it("rejects sale details when the item is not sold", () => {
    const result = createItemSchema.safeParse({
      ...baseItemInput,
      isSold: false,
      soldPrice: "120.00",
      soldCurrencyId: "currency-id"
    });

    expect(result.success).toBe(false);
  });

  it("requires sale price and sale currency for sold items", () => {
    const result = createItemSchema.safeParse({
      ...baseItemInput,
      isSold: true
    });

    expect(result.success).toBe(false);
  });

  it("accepts complete sale details for sold items", () => {
    const result = createItemSchema.safeParse({
      ...baseItemInput,
      isSold: true,
      soldPrice: "120.00",
      soldCurrencyId: "currency-id",
      soldDate: "2026-05-12T00:00:00.000Z"
    });

    expect(result.success).toBe(true);
  });
});

describe("deriveDisplayCountryId", () => {
  it("uses the decoration company country before the brand country", () => {
    const countryId = deriveDisplayCountryId({
      company: { countryId: "decoration-country" },
      brand: { countryId: "brand-country" }
    });

    expect(countryId).toBe("decoration-country");
  });

  it("falls back to the brand country when no decoration company country exists", () => {
    const countryId = deriveDisplayCountryId({
      company: null,
      brand: { countryId: "brand-country" }
    });

    expect(countryId).toBe("brand-country");
  });

  it("returns null when no country source exists", () => {
    const countryId = deriveDisplayCountryId({
      company: null,
      brand: null
    });

    expect(countryId).toBeNull();
  });
});
