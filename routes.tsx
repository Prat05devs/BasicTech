import React from 'react';
import type { RouteRecord } from 'vite-react-ssg';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import WorkIndex from './pages/WorkIndex';
import WorkDetail from './pages/WorkDetail';
import Products from './pages/Products';
import Infra from './pages/Infra';
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import Team from './pages/Team';
import Research from './pages/Research';
import ResearchArticle from './pages/ResearchArticle';
import { PROJECTS } from './constants';
import { BLOG } from './data/blog';
import { RESEARCH_ARTICLES } from './data/researchArticles';
import Engagement from './pages/Engagement';
import { ContentPage } from './components/content/ContentPage';

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, Component: Home },
      { path: 'work', Component: WorkIndex },
      {
        path: 'work/:slug',
        Component: WorkDetail,
        getStaticPaths: () => PROJECTS.map(p => `/work/${p.slug}`),
      },
      { path: 'products', Component: Products },
      { path: 'infra', Component: Infra },
      { path: 'blog', Component: BlogIndex },
      { path: 'blog/:slug', Component: BlogPost, getStaticPaths: () => BLOG.map((e) => `/blog/${e.slug}`) },
      { path: 'team', Component: Team },
      { path: 'research', Component: Research },
      { path: 'research/:slug', Component: ResearchArticle, getStaticPaths: () => RESEARCH_ARTICLES.map((e) => `/research/${e.slug}`) },
      { path: 'engagement', Component: Engagement },
      { path: 'gdpr', element: <ContentPage slug="gdpr" /> },
      { path: 'privacy', element: <ContentPage slug="privacy" /> },
      { path: 'terms', element: <ContentPage slug="terms" /> },
      { path: 'cookies', element: <ContentPage slug="cookies" /> },
      { path: '*', Component: NotFound },
    ],
  },
];

export default routes;
