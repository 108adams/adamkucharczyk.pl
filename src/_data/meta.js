export const url = process.env.URL || 'http://localhost:8080';
export const siteName = 'Adam Kucharczyk';
export const siteDescription = 'Szkolenia IT';
export const locale = 'pl_PL';
export const lang = 'pl';
export const skipContent = 'Przejdź do zawartości';
export const author = {
  name: 'Adam Kucharczyk',
  fediverse: '@adamkucharczyk@pol.social'
};
export const pathToSvgLogo = 'src/assets/svg/misc/logo.svg'; // used for favicon generation
export const themeColor = '#dd4462'; // used in manifest, for example primary color value
export const themeLight = '#f8f8f8'; // used for meta tag theme-color, if light colors are prefered. best use value set for light bg
export const themeDark = '#2e2e2e'; // used for meta tag theme-color, if dark colors are prefered. best use value set for dark bg
export const opengraph_default = '/assets/images/template/opengraph-default.jpg'; // fallback/default meta image
export const opengraph_default_alt = 'Visible content: Personal Site of IT tutor'; // alt text for default meta image"
export const navigation = {
  ariaTop: 'Główna',
  ariaBottom: 'Uzupełniająca',
  ariaPlatforms: 'Serwisy'
};
export const tests = {
  pa11y: {
    // pages excluded from the sitemap that are still tested
    extraPaths: ['/404.html']
  }
};
