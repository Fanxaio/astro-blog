import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { marked } from 'marked';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_AUTHOR } from '../consts';

// 配置 marked
marked.setOptions({
	breaks: true,
	gfm: true,
});

export async function GET(context) {
	// 获取 blog 和 weekly 两个集合的文章
	const blogPosts = await getCollection('blog', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
	const weeklyPosts = await getCollection('weekly', ({ data }) => (import.meta.env.PROD ? !data.draft : true));

	// 合并两个集合，并添加集合类型标识
	const allPosts = [
		...blogPosts.map((post) => ({ ...post, collectionType: 'blog' })),
		...weeklyPosts.map((post) => ({ ...post, collectionType: 'weekly' })),
	];

	// 按发布日期排序
	allPosts.sort((a, b) => b.data.pubDate - a.data.pubDate);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: allPosts.map((post) => ({
			title: post.data.title,
			author: SITE_AUTHOR,
			link: `/${post.collectionType}/${post.id}.html`,
			pubDate: post.data.pubDate,
			description: post.summary,
			content: marked.parse(post.body),
		})),
	});
}
