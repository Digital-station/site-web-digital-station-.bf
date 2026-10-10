/**
 * Logo marquee data.
 *
 * Every raster logo in /public/logo was converted to a ≤192×192 WebP, so the
 * two rows together now weigh ~140 KB instead of ~1 MB. SVGs were left as-is.
 * Split into two rows — opposite directions for the 3D effect.
 */
export interface Tool {
  name: string;
  src: string;
}

export const TOOLS_ROW_1: Tool[] = [
  { name: 'React', src: '/logo/React.webp' },
  { name: 'TypeScript', src: '/logo/typescript.svg' },
  { name: 'JavaScript', src: '/logo/javascript.webp' },
  { name: 'Go', src: '/logo/Go.svg' },
  { name: 'Java', src: '/logo/Java.svg' },
  { name: 'PHP', src: '/logo/PHP.svg' },
  { name: 'C#', src: '/logo/C_Sharp.svg' },
  { name: 'C++', src: '/logo/ISO_C++_Logo.svg' },
  { name: 'Python', src: '/logo/Python.webp' },
  { name: 'Figma', src: '/logo/Figma.webp' },
  { name: 'Postman', src: '/logo/Postman.webp' },
  { name: 'Docker', src: '/logo/Docker.webp' },
  { name: 'GitLab', src: '/logo/Gitlab.webp' },
  { name: 'Npm', src: '/logo/Npm.svg' },
  { name: 'pnpm', src: '/logo/pnpm.svg' },
  { name: 'Yarn', src: '/logo/Yarn.svg' },
  { name: 'Jest', src: '/logo/Jest.webp' },
  { name: 'Copilot', src: '/logo/Copilot.webp' },
];

export const TOOLS_ROW_2: Tool[] = [
  { name: 'AWS', src: '/logo/Amazon-Web-Services.webp' },
  { name: 'Google', src: '/logo/Google.webp' },
  { name: 'Google Ads', src: '/logo/Google_Ads.svg' },
  { name: 'Meta', src: '/logo/Meta.webp' },
  { name: 'Shopify', src: '/logo/Shopify.svg' },
  { name: 'WooCommerce', src: '/logo/WooCommerce.svg' },
  { name: 'WordPress', src: '/logo/WordPress.webp' },
  { name: 'Drupal', src: '/logo/Drupal.webp' },
  { name: 'Joomla', src: '/logo/Joomla.webp' },
  { name: 'Odoo', src: '/logo/Odoo.webp' },
  { name: 'Salesforce', src: '/logo/Salesforce.webp' },
  { name: 'Oracle', src: '/logo/Oracle.webp' },
  { name: 'Microsoft', src: '/logo/Microsoft.svg' },
  { name: 'Microsoft 365', src: '/logo/Microsoft-Office-365.webp' },
  { name: 'SharePoint', src: '/logo/SharePoint.webp' },
  { name: 'Zoom', src: '/logo/Zoom.webp' },
  { name: 'Slack', src: '/logo/slack.webp' },
  { name: 'Linux', src: '/logo/Linux.svg' },
  { name: 'Ubuntu', src: '/logo/Ubuntu-Logo.webp' },
  { name: 'Nginx', src: '/logo/Nginx.webp' },
];
