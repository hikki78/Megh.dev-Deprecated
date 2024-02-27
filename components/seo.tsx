import { DefaultSeo } from 'next-seo'

const config = {
  title: 'Megh.codes',
  description: 'I’m a fullstack developer who loves to create stuff!',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://megh.codes',
    site_name: 'Meghadri',
    images: [
      {
        url: 'https://megh.codes',
        alt: 'megh',
      },
    ],
  },
  twitter: {
    handle: '@hikki78',
    site: '@hikki78',
    cardType: 'summary_large_image',
  },
}

const SEO = (): JSX.Element => {
  return <DefaultSeo {...config} />
}

export default SEO
