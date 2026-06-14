import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Startup Guides, Articles & Resources — India Startup Knowledge Hub',
  description:
    "India's most comprehensive startup knowledge hub — expert guides, funding insights, founder interviews, ecosystem analysis, legal resources, and actionable articles for entrepreneurs at every stage. Learn how to build, fund, and scale your startup in India.",
  path: '/source',
  section: 'Resources',
  keywords: [
    'startup guides india', 'startup articles india', 'entrepreneur resources india',
    'startup funding guide', 'how to start startup india guide',
    'startup knowledge base india', 'founder resources india',
    'startup incubation resources', 'startup news india',
    'startup tips india', 'startup advice india', 'startup blog india',
    'entrepreneur blog india', 'startup insights india', 'startup analysis india',
    'startup legal guide india', 'startup financial guide india',
    'startup marketing guide india', 'startup growth hacks india',
    'startup ideas india guide', 'startup case studies india',
    'indian founder story', 'startup lessons india', 'startup failure lessons india',
    'how to register startup india article', 'dpiit recognition guide article',
    'startup funding guide india article', 'startup pitch deck guide india',
    'startup valuation guide india', 'esop guide startup india',
    'startup hiring guide india', 'startup scaling guide india',
    'startup operations guide india', 'startup product guide india',
    'startup community guide india', 'startup ecosystem guide india',
    'incubator vs accelerator india', 'angel vs vc india guide',
    'startup india scheme explained', 'startup tax guide india',
  ],
});

export default function SourceLayout({ children }) {
  return children;
}
