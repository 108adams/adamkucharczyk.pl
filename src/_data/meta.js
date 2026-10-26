export const url = process.env.URL || 'http://localhost:8080';
// Extract domain from `url`
export const domain = new URL(url).hostname;
export const siteName = 'Adam Kucharczyk';
export const siteDescription = 'Szkolenia IT';
export const siteType = 'Person'; // schema
export const locale = 'pl_PL';
export const lang = 'pl';
export const skipContent = 'Przejdź do zawartości';
export const author = {
  name: 'Adam Kucharczyk',
  avatar: '/icon-512x512.png', // path to the author's avatar. In this case just using a favicon.
  email: 'me@adamkucharczyk.pl',
  website: 'https://www.adamkucharczyk.pl',
  fediverse: '@adamkucharczyk@pol.social'
  // used for highlighting journalism on the fediverse.
  // Can be Mastodon, Flipboard, Threads, WordPress
  // (with the ActivityPub plugin installed), PeerTube, Pixelfed, etc.
  // https://blog.joinmastodon.org/2024/07/highlighting-journalism-on-mastodon/
};
export const pathToSvgLogo = 'src/assets/svg/misc/logo.svg'; // used for favicon generation
export const themeColor = '#dd4462'; // used in manifest, for example primary color value
export const themeLight = '#f8f8f8'; // used for meta tag theme-color, if light colors are prefered. best use value set for light bg
export const themeDark = '#2e2e2e'; // used for meta tag theme-color, if dark colors are prefered. best use value set for dark bg
export const opengraph_default = '/assets/images/template/opengraph-default.jpg'; // fallback/default meta image
export const opengraph_default_alt = 'Visible content: Personal Site of IT tutor'; // alt text for default meta image"
export const details = {
  aria: 'section controls',
  expand: 'expand all',
  collapse: 'collapse all'
};
export const dialog = {
  close: 'Close',
  next: 'Next',
  previous: 'Previous'
};
export const navigation = {
  navLabel: 'Menu',
  ariaTop: 'Główna',
  ariaBottom: 'Uzupełniająca',
  ariaPlatforms: 'Serwisy',
  drawerNav: false,
  subMenu: false
};
export const themeSwitch = {
  title: 'Wygląd',
  light: 'jasny',
  dark: 'ciemny'
};
export const tests = {
  pa11y: {
    // keep customPaths empty if you want to test all pages
    customPaths: ['/', '/about/', '/blog/', '/styleguide/'],
    globalIgnore: []
  }
};
export const easteregg = false;
