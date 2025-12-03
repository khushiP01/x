import { draftMode } from "next/headers";

import { Pump } from "basehub/react-pump";
import { Heading } from "@/common/heading";
import { Section } from "@/common/layout";
import { SearchContent as Search } from "@/common/search";
import { SearchHitsProvider } from "@/context/search-hits-context";
import { type AvatarFragment, avatarFragment } from "@/lib/basehub/fragments";

import { BlogpostCard, blogpostCardFragment } from "./_components/blogpost-card";
import { PageView } from "../_components/page-view";
import type { Metadata } from "next";
import { basehub } from "basehub";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const generateMetadata = async (): Promise<Metadata | undefined> => {
  const data = await basehub({ draft: (await draftMode()).isEnabled }).query({
    site: {
      blog: {
        metadata: {
          title: true,
          description: true,
        },
      },
    },
  });

  return {
    title: data.site.blog.metadata.title ?? undefined,
    description: data.site.blog.metadata.description ?? undefined,
  };
};

export default async function BlogPage() {
  try {
    return (
      <Pump
        queries={[
          {
            _componentInstances: {
              blogPost: {
                _searchKey: true,
              },
            },
            collections: {
              authors: {
                items: {
                  _id: true,
                  image: avatarFragment,
                },
              },
            },
            site: {
              generalEvents: { ingestKey: true },
              blog: {
                _analyticsKey: true,
                mainTitle: true,
                listTitle: true,
                posts: {
                  __args: { orderBy: "publishedAt__DESC" },
                  items: blogpostCardFragment,
                },
              },
            },
          },
        ]}
      >
        {async ([
          {
            _componentInstances: { blogPost },
            site: { blog, generalEvents },
            collections: { authors },
          },
        ]) => {
          "use server";
          const { posts } = blog;

          return (
            <Section className="gap-16">
              <PageView ingestKey={generalEvents.ingestKey} />
              <div className="grid grid-cols-1 gap-5 self-stretch md:grid-cols-2">
                <Heading align="left">
                  <h2>{blog.mainTitle}</h2>
                </Heading>
                <SearchHitsProvider
                  authorsAvatars={authors.items.reduce(
                    (acc: Record<string, AvatarFragment>, author) => {
                      acc[author._id] = author.image;

                      return acc;
                    },
                    {},
                  )}
                >
                  <Search _searchKey={blogPost._searchKey} />
                </SearchHitsProvider>
              </div>
              <div className="w-full space-y-3">
                <Heading align="left">
                  <h3 className="text-xl! lg:text-2xl!">{blog.listTitle}</h3>
                </Heading>
                {posts.items.length > 0 ? (
                  <div className="-mx-4 flex flex-col self-stretch">
                    {posts.items.map((post) => (
                      <BlogpostCard key={post._id} {...post} className="-mx-4" />
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary dark:text-dark-text-secondary">No blog posts yet.</p>
                )}
              </div>
            </Section>
          );
        }}
      </Pump>
    );
  } catch (error) {
    console.error("Error loading blog page:", error);
    notFound();
  }
}
