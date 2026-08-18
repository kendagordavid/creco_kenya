import type { Locale } from "@/lib/i18n/config";

import {
  FAQ_CATEGORIES as EN_FAQ_CATEGORIES,
  FAQ_ITEMS as EN_FAQ_ITEMS,
  getFaqBySlug as enGetFaqBySlug,
  getFaqsByCategory as enGetFaqsByCategory,
} from "@/lib/content/faqs";
import {
  CHECKLIST_SECTIONS as EN_CHECKLIST_SECTIONS,
} from "@/lib/content/checklist";
import {
  ASSESSMENT_QUESTIONS as EN_ASSESSMENT_QUESTIONS,
  scoreAssessment as enScoreAssessment,
} from "@/lib/content/assessment";
import {
  MEDIA_ITEMS as EN_MEDIA_ITEMS,
  TOOLKIT_ITEMS as EN_TOOLKIT_ITEMS,
  getToolkitBySlug as enGetToolkitBySlug,
} from "@/lib/content/knowledge";
import {
  TEMPLATE_ITEMS as EN_TEMPLATE_ITEMS,
  getTemplateBySlug as enGetTemplateBySlug,
} from "@/lib/content/templates";

import {
  FAQ_CATEGORIES as SW_FAQ_CATEGORIES,
  FAQ_ITEMS as SW_FAQ_ITEMS,
  getFaqBySlug as swGetFaqBySlug,
  getFaqsByCategory as swGetFaqsByCategory,
} from "@/lib/content/sw/faqs";
import {
  CHECKLIST_SECTIONS as SW_CHECKLIST_SECTIONS,
} from "@/lib/content/sw/checklist";
import {
  ASSESSMENT_QUESTIONS as SW_ASSESSMENT_QUESTIONS,
  scoreAssessment as swScoreAssessment,
} from "@/lib/content/sw/assessment";
import {
  MEDIA_ITEMS as SW_MEDIA_ITEMS,
  TOOLKIT_ITEMS as SW_TOOLKIT_ITEMS,
  getToolkitBySlug as swGetToolkitBySlug,
} from "@/lib/content/sw/knowledge";
import {
  TEMPLATE_ITEMS as SW_TEMPLATE_ITEMS,
  getTemplateBySlug as swGetTemplateBySlug,
} from "@/lib/content/sw/templates";

export function getFaqCategories(locale: Locale) {
  return locale === "sw" ? SW_FAQ_CATEGORIES : EN_FAQ_CATEGORIES;
}

export function getFaqItems(locale: Locale) {
  return locale === "sw" ? SW_FAQ_ITEMS : EN_FAQ_ITEMS;
}

export function getFaqBySlug(locale: Locale, slug: string) {
  return locale === "sw" ? swGetFaqBySlug(slug) : enGetFaqBySlug(slug);
}

export function getFaqsByCategory(locale: Locale, category: string) {
  return locale === "sw"
    ? swGetFaqsByCategory(category)
    : enGetFaqsByCategory(category);
}

export function getChecklistSections(locale: Locale) {
  return locale === "sw" ? SW_CHECKLIST_SECTIONS : EN_CHECKLIST_SECTIONS;
}

export function getAssessmentQuestions(locale: Locale) {
  return locale === "sw" ? SW_ASSESSMENT_QUESTIONS : EN_ASSESSMENT_QUESTIONS;
}

export function scoreAssessment(locale: Locale, answers: Record<string, number>) {
  return locale === "sw" ? swScoreAssessment(answers) : enScoreAssessment(answers);
}

export function getToolkitItems(locale: Locale) {
  return locale === "sw" ? SW_TOOLKIT_ITEMS : EN_TOOLKIT_ITEMS;
}

export function getToolkitBySlug(locale: Locale, slug: string) {
  return locale === "sw" ? swGetToolkitBySlug(slug) : enGetToolkitBySlug(slug);
}

export function getMediaItems(locale: Locale) {
  return locale === "sw" ? SW_MEDIA_ITEMS : EN_MEDIA_ITEMS;
}

export function getTemplateItems(locale: Locale) {
  return locale === "sw" ? SW_TEMPLATE_ITEMS : EN_TEMPLATE_ITEMS;
}

export function getTemplateBySlug(locale: Locale, slug: string) {
  return locale === "sw" ? swGetTemplateBySlug(slug) : enGetTemplateBySlug(slug);
}
