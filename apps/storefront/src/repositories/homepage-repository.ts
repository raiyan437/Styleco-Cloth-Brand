import type { HomepageContent, HomepageSection } from "../domain/homepage";

export interface HomepageRepository {
  listSections(): Promise<HomepageSection[]>;
  getContent?(): Promise<HomepageContent>;
}
