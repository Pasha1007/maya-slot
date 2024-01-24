export function generateUniqueId(): string {
  const timestamp = new Date().getTime();
  const randomPart = Math.random().toString(36).substring(2, 15);
  const uniqueId = `${timestamp}-${randomPart}`;

  return uniqueId;
}