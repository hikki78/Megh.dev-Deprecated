import Link from 'next/link'

// Components
import BlogImage from 'components/blogimage'

// Utils
import { formatDate } from 'lib/formatdate'
import type { Post } from 'contentlayer/generated'

import styles from './postlist.module.scss'

type PostListProps = {
  posts: Post[]
}

const PostList = ({ posts }: PostListProps): JSX.Element => {
  console.log(posts)

  return (
    <ul className={styles.list}>
      {posts.length === 0 && <p className={styles.noResults}>🧐 No posts found</p>}
      {posts.map(post => {
        const { summary, title, readingTime: readTime, publishedAt, image, slug } = post
        return (
          <li key={slug}>
            <>
              {
                <>
                  {image && (
                    <Link as={`/blog/${slug}`} href="/blog/[slug]">
                      <a aria-label={title}>
                        <BlogImage src={image} alt={title} />
                      </a>
                    </Link>
                  )}
                </>
              }
              <Link as={`/blog/${slug}`} href="/blog/[slug]">
                <a className={styles.title}>{title}</a>
              </Link>
              {console.log(slug)}
              <p className={styles.summary}>{summary}</p>
              <p className={styles.meta}>
                Published on <time dateTime={publishedAt}>{formatDate(publishedAt)}</time> &middot; {readTime.text}
              </p>
              {post.tags?.map((tag: string, idx: number) => {
                let clsName = 'tag' + idx.toString()
                return (
                  <a className={`${styles.postTags}  ${styles[clsName]}`} key={tag}>
                    {tag}
                  </a>
                )
              })}
            </>
          </li>
        )
      })}
    </ul>
  )
}

export default PostList
