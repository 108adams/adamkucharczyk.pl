import colors from './designTokens/colors.json' with {type: 'json'};

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
// page background (--color-bg); the site has a single light theme
export const themeColor = colors.items.find(c => c.name === 'Solarized Base3').value;
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
    extraPaths: ['/404.html', '/contact/sent/']
  }
};
