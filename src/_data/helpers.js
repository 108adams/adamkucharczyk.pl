/**
 * Returns aria-current for the link to the current page or its parent section.
 *
 * @param {String} itemUrl - The link in question.
 * @param {String} pageUrl - The page context.
 * @returns {String} - The attributes or empty.
 */
export function getLinkActiveState(itemUrl, pageUrl) {
  if (itemUrl.length > 1 && pageUrl.startsWith(itemUrl)) {
    return ' aria-current="page" data-state="active"';
  }
  return itemUrl === pageUrl ? ' aria-current="page"' : '';
}
