export const checkIsValidText = (content: any) => {
  return typeof content === 'string' && content.trim().length !== 0
}
