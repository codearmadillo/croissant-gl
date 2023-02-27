export function isNullOrUndefined(value: any) {
  return value === null || value === undefined;
}
export function isEmptyOrWhitespace(value: string) {
    if (isNullOrUndefined(value)) {
        return true;
    }
    return value.trim().length === 0;
}
