import { BudgetCategory, BudgetSubCategory } from '@/entities/budget';

export const getCategoryById = (
  cat: string,
): undefined | { key: keyof typeof BudgetCategory; value: BudgetCategory } => {
  const key = Object.keys(BudgetCategory).find(
    (c) => c.toLowerCase() === cat,
  ) as undefined | keyof typeof BudgetCategory;
  // category must be a value of BudgetCategory
  if (key) {
    return {
      key,
      value: BudgetCategory[key],
    };
  }
};

export const getSubById = (
  sb: string,
):
  | undefined
  | { key: keyof typeof BudgetSubCategory; value: BudgetSubCategory } => {
  const key = Object.keys(BudgetSubCategory).find(
    (c) => c.toLowerCase() === sb,
  ) as undefined | keyof typeof BudgetSubCategory;
  if (key) {
    return {
      key,
      value: BudgetSubCategory[key],
    };
  }
};
