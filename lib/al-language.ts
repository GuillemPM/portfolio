import alGrammar from "@/lib/syntax/al.tmLanguage.json";

/** Microsoft AL TextMate grammar for Shiki (blog ```al fences). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TextMate JSON is looser than Shiki LanguageRegistration
export const alLanguage: any = {
  ...alGrammar,
  name: "al",
  displayName: "AL",
  aliases: ["businesscentral"],
};
