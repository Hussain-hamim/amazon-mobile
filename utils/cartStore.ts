// import { Article } from '@/utils/api';
// import {   } from '@/utils/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Article } from './api';

export interface CartState {
  articles: (Article & { quantity: number })[];
  addArticle: (article: Article) => void;
  reduceArticle: (article: Article) => void;
  removeArticle: (article: Article) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const INITIAL_STATE = {
  articles: [],
  total: 0,
  count: 0,
};

function recalculate(articles: (Article & { quantity: number })[]) {
  const total = articles.reduce((sum, a) => sum + a.price * a.quantity, 0);
  const count = articles.reduce((sum, a) => sum + a.quantity, 0);
  return { total, count };
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      addArticle: (article) => {
        set((state) => {
          let found = false;
          const articles = state.articles.map((a) => {
            if (a.id === article.id) {
              found = true;
              return { ...a, quantity: a.quantity + 1 };
            }
            return a;
          });

          // if its found then just update the quantity otherwise add one quantity for this article spread the rest
          const newArticles = found
            ? articles
            : [...state.articles, { ...article, quantity: 1 }];
          const { total, count } = recalculate(newArticles);
          return { articles: newArticles, total, count };
        });
      },
      reduceArticle: (article) => {
        set((state) => {
          const newArticles = state.articles
            .map((a) =>
              a.id === article.id ? { ...a, quantity: a.quantity - 1 } : a
            )
            .filter((a) => a.quantity > 0);

          const { total, count } = recalculate(newArticles);
          return { articles: newArticles, count, total };
        });
      },
      removeArticle: (article) => {
        set((state) => {
          const newArticles = state.articles.filter((a) => a.id !== article.id);
          const { total, count } = recalculate(newArticles);
          return { articles: newArticles, count, total };
        });
      },
      clearCart: () => {
        set(INITIAL_STATE);
      },
    }),
    {
      name: 'cart',
      // storage: createJSONStorage(() => zustandStorage),
    }
  )
);

// export const useCartStore = create<CartState>()(
//   persist(
//     (set) => ({
//       ...INITIAL_STATE,
//       addArticle: (article) => {
//         set((state) => {
//           let found = false;
//           const articles = state.articles.map((a) => {
//             if (a.id === article.id) {
//               found = true;
//               return { ...a, quantity: a.quantity + 1 };
//             }
//             return a;
//           });
//           const newArticles = found ? articles : [...state.articles, { ...article, quantity: 1 }];
//           const { total, count } = recalculate(newArticles);
//           return { articles: newArticles, total, count };
//         });
//       },
//       reduceArticle: (article) => {
//         set((state) => {
//           const articles = state.articles
//             .map((a) => (a.id === article.id ? { ...a, quantity: a.quantity - 1 } : a))
//             .filter((a) => a.quantity > 0);
//           const { total, count } = recalculate(articles);
//           return { articles, total, count };
//         });
//       },
//       removeArticle: (article) => {
//         set((state) => {
//           const articles = state.articles.filter((a) => a.id !== article.id);
//           const { total, count } = recalculate(articles);
//           return { articles, total, count };
//         });
//       },
//       clearCart: () => {
//         set(INITIAL_STATE);
//       },
//     }),
//     {
//       name: 'cart',
//       storage: createJSONStorage(() => zustandStorage),
//     }
//   )
// );
