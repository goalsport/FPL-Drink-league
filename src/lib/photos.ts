export const MANAGER_PHOTO_DIR = "/managers";
export const MANAGER_PHOTO_EXTS = ["jpg", "jpeg", "png", "webp", "jpg.jpg", "png.png"] as const;

export function managerPhotoCandidates(entryId: number): string[] {
  return MANAGER_PHOTO_EXTS.map((ext) => `${MANAGER_PHOTO_DIR}/${entryId}.${ext}`);
}
