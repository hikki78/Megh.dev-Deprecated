import { GetStaticProps, GetStaticPaths } from "next";
import { useMDXComponent } from "next-contentlayer/hooks"; // eslint-disable-line
import Head from "next/head";
import Link from "next/link";
import { NextSeo } from "next-seo";
// import dynamic from "next/dynamic";

// Components
import Page from "components/page";
import PageHeader from "components/pageheader";
import CustomImage from "components/image";
import Warning from "components/warning";
import Subscribe from "components/subscribe";
import BlogImage from "components/blogimage";
import SegmentedControl from "components/segmentedcontrol";
import Parallax from "components/parallax";
import Tags from "components/tags";
import PostList from "components/postlist";
import Button from "components/button";

// Utils
import { pick } from "@contentlayer/client";
import { allPosts, Post as PostType } from "contentlayer/generated";

import styles from "./post.module.scss";

const CustomLink = (props: { href: string }) => {
	const { href } = props;

	/* eslint-disable */
	if (href?.startsWith("/")) {
		return (
			<Link href={href}>
				<a {...props} />
			</Link>
		);
	}

	if (href.startsWith("#")) {
		return <a {...props} />;
	}

	return <a target="_blank" rel="noopener noreferrer" {...props} />;
	/* eslint-enable */
};

const components = {
	Head,
	a: CustomLink,
	Image: CustomImage,
	Warning,
	Link: CustomLink,
	// NowPlayingIcon,
	SegmentedControl,
	Parallax,
};

type PostProps = {
	post: PostType;
	related: PostType[];
};

const Post = ({ post, related }: PostProps): JSX.Element => {
	const Component = useMDXComponent(post.body.code);

	const formattedPublishDate = new Date(post.publishedAt).toLocaleString(
		"en-UK",
		{
			day: "2-digit",
			month: "short",
			year: "numeric",
		}
	);
	const formattedUpdatedDate = post.updatedAt
		? new Date(post.updatedAt).toLocaleString("en-UK", {
				day: "2-digit",
				month: "short",
				year: "numeric",
		  })
		: null;

	const seoTitle = `${post.title} | Sai Shanmukh`;
	const seoDesc = `${post.summary}`;
	const url = `https://shanmukh.xyz/blog/${post.slug}`;

	return (
		<Page>
			<NextSeo
				title={seoTitle}
				description={seoDesc}
				canonical={url}
				openGraph={{
					title: seoTitle,
					url,
					description: seoDesc,
					images: [
						{
							url: post.og
								? `https://shanmukh.xyz${post.og}`
								: `https://image-og.msshanmukh.vercel.app/${encodeURIComponent(
										post.title
								  )}?desc=${encodeURIComponent(seoDesc)}&theme=dark.png`,
							alt: post.title,
						},
					],
					site_name: "Sai Shanmukh",
					type: "article",
					article: {
						publishedTime: post.publishedAt,
						modifiedTime: post.updatedAt,
						authors: ["https://shanmukh.xyz"],
					},
				}}
				twitter={{
					cardType: "summary_large_image",
				}}
			/>

			{
				<>
					{post.image && (
						<BlogImage
							src={post.image}
							alt={post.title}
							className={styles.image}
						/>
					)}
				</>
			}
			<PageHeader title={post.title} compact>
				<p className={styles.meta}>
					Published on{" "}
					<time dateTime={post.publishedAt}>{formattedPublishDate}</time>
					{post.updatedAt ? ` (Updated ${formattedUpdatedDate})` : ""}{" "}
					<span>&middot;</span> {post.readingTime.text}
				</p>
			</PageHeader>
			<article className={styles.article}>
				<Component components={components} />
			</article>

			<Tags tags={post.tags} />
			<Subscribe className={styles.subscribe} />
			{related.length > 0 && (
				<>
					<h2 className={styles.relatedHeading}>Related Posts</h2>
					<PostList posts={related} />
				</>
			)}
			<div className={styles.buttons}>
				<Button href="/blog">Back to the blog</Button>
			</div>
		</Page>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: allPosts.map((p) => ({ params: { slug: p.slug } })),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const post = allPosts.find((p) => p.slug === params?.slug);
	const related = allPosts
		/* remove current post */
		.filter((p) => p.slug !== params?.slug)
		/* Find other posts where tags are matching */
		.filter((p) => p.tags?.some((tag: any) => post?.tags?.includes(tag)))
		/* return the first three */
		.filter((_, i) => i < 3)
		/* only return what's needed to render the list */
		.map((p) =>
			pick(p, [
				"slug",
				"title",
				"summary",
				"publishedAt",
				"image",
				"readingTime",
			])
		);

	return {
		props: {
			post,
			related,
		},
	};
};

export default Post;
