export const Languages = { ar: "ar", en: "en" } as const;

// إذا كنت تحتاج لاستخدام النوع في أماكن أخرى:
export type Languages = (typeof Languages)[keyof typeof Languages];
