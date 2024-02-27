import { DefaultSeo } from 'next-seo'

const config = {
  title: 'Meghadri Mukherjee',
  description: 'I’m a fullstack developer who loves to create stuff!',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://megh.codes',
    site_name: 'Meghadri',
    images: [
      {
        alt: 'Sai Shanmukh',
      },
    ],
  },
}

const SEO = (): JSX.Element => {
  return <DefaultSeo {...config} />
}

export default SEO
