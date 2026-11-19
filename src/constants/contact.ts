export const OFFICIAL_CONTACT = {
  organization: 'สำนักงานพาณิชย์จังหวัดเลย',
  address: '302/9 ถนนเลย-เชียงคาน ตำบลกุดป่อง อำเภอเมืองเลย จังหวัดเลย',
  phones: [
    { display: '042 811 163', tel: '042811163' },
    { display: '042 811 485', tel: '042811485' }
  ],
  phoneDisplay: '042 811 163, 042 811 485',
  websiteUrl: 'https://loei.moc.go.th',
  websiteLabel: 'เว็บไซต์สำนักงานพาณิชย์จังหวัดเลย'
} as const;

export function buildPlaceShareUrl(placeId: string): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('place', placeId);
  return url.toString();
}

export function buildArticleShareUrl(articleId: string): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('article', articleId);
  return url.toString();
}
