import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rtkApi = createApi({
  reducerPath: "rtkApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001",
  }),

  tagTypes: [
    "Catalog",
    "Sections",
    "Goods",
    "Promo",
    "Users",
    "SearchResults",
    "Favorites",
    "Basket",
    "Orders",
    "Brands",
  ],

  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: `users`,
        method: "GET",
        params: { username, password },
      }),
      transformResponse: (response, meta, arg) => {
        const { username, password } = arg;
        const user = response.find(
          (u) => u.username === username && u.password === password
        );
        return user || null;
      },
      invalidatesTags: ["Users"],
    }),

    register: builder.mutation({
      queryFn: async (newUser, _queryApi, _extraOptions, baseQuery) => {
        const existingUsers = await baseQuery({
          url: `users?username=${newUser.username}`,
          method: "GET",
        });

        if (existingUsers.error) {
          return { error: existingUsers.error };
        }

        if (existingUsers.data.length > 0) {
          return {
            error: {
              status: 400,
              data: { message: "Username already exists" },
            },
          };
        }

        const userWithDefaults = {
          ...newUser,
          isCurrent: false,
          favorites: [],
          basket: [],
          orders: [],
          ordersHistory: [],
        };

        return baseQuery({
          url: "users",
          method: "POST",
          body: userWithDefaults,
        });
      },
      invalidatesTags: ["Users"],
    }),

    getCurrentUser: builder.query({
      query: () => `users?isCurrent=true`,
      transformResponse: (response) => response[0] || null,
      providesTags: ["Users"],
    }),

    resetAllUsersIsCurrent: builder.mutation({
      queryFn: async (_arg, _queryApi, _extraOptions, baseQuery) => {
        const users = await baseQuery({ url: "users", method: "GET" });
        if (users.error) return { error: users.error };

        const updates = await Promise.all(
          users.data.map((user) =>
            baseQuery({
              url: `users/${user.id}`,
              method: "PATCH",
              body: { isCurrent: false },
            })
          )
        );

        const errors = updates.filter((result) => result.error);
        if (errors.length) return { error: errors[0].error };

        return { data: "All users updated" };
      },
      invalidatesTags: ["Users"],
    }),

    updateUserIsCurrent: builder.mutation({
      query: ({ id, isCurrent }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body: { isCurrent },
      }),
      invalidatesTags: ["Users"],
    }),

    getCatalog: builder.query({
      query: () => `catalog`,
      providesTags: ["Catalog"],
    }),

    getSections: builder.query({
      query: (params) => `catalog?${new URLSearchParams(params).toString()}`,
      providesTags: (result, error, query) => [{ type: "Sections", id: query }],
    }),

    getGoods: builder.query({
      query: (query) => `goods?${query}`,
      providesTags: (result, error, query) => [{ type: "Goods", id: query }],
    }),

    getPromo: builder.query({
      query: (query) => `promo?${query}`,
      providesTags: (result, error, query) => [{ type: "Promo", id: query }],
    }),

    getBrands: builder.query({
      query: (query) => `brands?${query}`,
      providesTags: (result, error, query) => [{ type: "Brands", id: query }],
    }),

    addGoods: builder.mutation({
      query: (newGoods) => ({
        url: "goods",
        method: "POST",
        body: newGoods,
      }),
      invalidatesTags: ["Goods"],
    }),

    updateGoods: builder.mutation({
      query: ({ id, ...updatedGoods }) => ({
        url: `goods/${id}`,
        method: "PUT",
        body: updatedGoods,
      }),
      invalidatesTags: ["Goods"],
    }),

    deleteGoods: builder.mutation({
      query: (id) => ({
        url: `goods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Goods"],
    }),

    getSearchResults: builder.query({
      query: (params) => `goods?${new URLSearchParams(params).toString()}`,
      providesTags: (result, error, query) => [
        { type: "SearchResults" },
        { type: "SearchResults", id: query },
      ],
    }),

    updateInFavoritesStatus: builder.mutation({
      queryFn: async (
        { userId, productId, inFavorites },
        _queryApi,
        _extraOptions,
        baseQuery
      ) => {
        const goodsResponse = await baseQuery({
          url: `goods/${productId}`,
          method: "PATCH",
          body: { inFavorites },
        });
        if (goodsResponse.error) return { error: goodsResponse.error };

        const userResponse = await baseQuery({
          url: `users/${userId}`,
          method: "GET",
        });
        if (userResponse.error) return { error: userResponse.error };

        const user = userResponse.data;

        const updatedFavorites = inFavorites
          ? [...user.favorites, { productId }]
          : user.favorites.filter((item) => item.productId !== productId);

        const userUpdateResponse = await baseQuery({
          url: `users/${userId}`,
          method: "PATCH",
          body: { favorites: updatedFavorites },
        });

        if (userUpdateResponse.error)
          return { error: userUpdateResponse.error };

        return { data: userUpdateResponse.data };
      },
      invalidatesTags: ["Users", "Favorites", "Goods", "SearchResults"],
    }),

    updateInBasketStatus: builder.mutation({
      queryFn: async (
        { userId, productId, inBasket },
        _queryApi,
        _extraOptions,
        baseQuery
      ) => {
        const goodsResponse = await baseQuery({
          url: `goods/${productId}`,
          method: "PATCH",
          body: { inBasket },
        });
        if (goodsResponse.error) return { error: goodsResponse.error };

        const userResponse = await baseQuery({
          url: `users/${userId}`,
          method: "GET",
        });
        if (userResponse.error) return { error: userResponse.error };

        const user = userResponse.data;

        const updatedBasket = inBasket
          ? [...user.basket, { productId }]
          : user.basket.filter((item) => item.productId !== productId);

        const userUpdateResponse = await baseQuery({
          url: `users/${userId}`,
          method: "PATCH",
          body: { basket: updatedBasket },
        });

        if (userUpdateResponse.error)
          return { error: userUpdateResponse.error };

        return { data: userUpdateResponse.data };
      },
      invalidatesTags: [
        "Users",
        "Favorites",
        "Goods",
        "SearchResults",
        "Basket",
      ],
    }),

    resetAllFavorites: builder.mutation({
      queryFn: async (_arg, _queryApi, _extraOptions, baseQuery) => {
        try {
          const goodsResponse = await baseQuery({
            url: "goods",
            method: "GET",
          });
          if (goodsResponse.error) return { error: goodsResponse.error };

          const goods = goodsResponse.data;

          const updates = await Promise.all(
            goods.map((product) =>
              baseQuery({
                url: `goods/${product.id}`,
                method: "PATCH",
                body: { inFavorites: false },
              })
            )
          );

          const errors = updates.filter((result) => result.error);
          if (errors.length) return { error: errors[0].error };

          return { data: "All favorites reset successfully" };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Goods", "Favorites", "SearchResults", "Basket"],
    }),

    resetAllBasket: builder.mutation({
      queryFn: async (_arg, _queryApi, _extraOptions, baseQuery) => {
        try {
          const goodsResponse = await baseQuery({
            url: "goods",
            method: "GET",
          });
          if (goodsResponse.error) return { error: goodsResponse.error };

          const goods = goodsResponse.data;

          const updates = await Promise.all(
            goods.map((product) =>
              baseQuery({
                url: `goods/${product.id}`,
                method: "PATCH",
                body: { inBasket: false },
              })
            )
          );

          const errors = updates.filter((result) => result.error);
          if (errors.length) return { error: errors[0].error };

          return { data: "All basket reset successfully" };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Goods", "Favorites", "SearchResults", "Basket"],
    }),

    syncFavoritesOnLogin: builder.mutation({
      queryFn: async (userId, _queryApi, _extraOptions, baseQuery) => {
        try {
          const userResponse = await baseQuery({
            url: `users/${userId}`,
            method: "GET",
          });
          if (userResponse.error) return { error: userResponse.error };

          const user = userResponse.data;
          const favoriteProductIds = user.favorites || [];
          const updates = await Promise.all(
            favoriteProductIds.map((productId) =>
              baseQuery({
                url: `goods/${productId.productId}`,

                method: "PATCH",
                body: { inFavorites: true },
              })
            )
          );

          const errors = updates.filter((result) => result.error);
          if (errors.length) return { error: errors[0].error };

          return { data: "Favorites synced successfully" };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Goods", "Favorites", "SearchResults", "Basket"],
    }),

    syncBasketOnLogin: builder.mutation({
      queryFn: async (userId, _queryApi, _extraOptions, baseQuery) => {
        try {
          const userResponse = await baseQuery({
            url: `users/${userId}`,
            method: "GET",
          });
          if (userResponse.error) return { error: userResponse.error };

          const user = userResponse.data;
          const basketProductIds = user.basket || [];
          const updates = await Promise.all(
            basketProductIds.map((productId) =>
              baseQuery({
                url: `goods/${productId.productId}`,

                method: "PATCH",
                body: { inBasket: true },
              })
            )
          );

          const errors = updates.filter((result) => result.error);
          if (errors.length) return { error: errors[0].error };

          return { data: "Basket synced successfully" };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Goods", "Favorites", "SearchResults", "Basket"],
    }),

    updatePlaceOnOrderStatus: builder.mutation({
      queryFn: async (
        { userId, productId, inBasket },
        _queryApi,
        _extraOptions,
        baseQuery
      ) => {
        try {
          const goodsResponse = await baseQuery({
            url: `goods/${productId}`,
            method: "PATCH",
            body: { inBasket },
          });
          if (goodsResponse.error) return { error: goodsResponse.error };

          const userResponse = await baseQuery({
            url: `users/${userId}`,
            method: "GET",
          });
          if (userResponse.error) return { error: userResponse.error };

          const user = userResponse.data;

          const orderId = Math.random().toString(36).substring(2, 15);

          const order = {
            orderId,
            productId,
            productName: `${goodsResponse.data.brand} ${goodsResponse.data.model}`,
            productPrice: goodsResponse.data.price,
            productImg: goodsResponse.data.images[0],
            orderTime: new Date().toISOString(),
          };

          const updatedOrders = [...user.orders, order];

          const userUpdateResponse = await baseQuery({
            url: `users/${userId}`,
            method: "PATCH",
            body: { orders: updatedOrders },
          });

          if (userUpdateResponse.error)
            return { error: userUpdateResponse.error };

          return { data: userUpdateResponse.data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (result, error, { userId }) => [
        { type: "Orders", id: userId },
      ],
    }),

    confirmOrder: builder.mutation({
      queryFn: async (
        { userId, orderId },
        _queryApi,
        _extraOptions,
        baseQuery
      ) => {
        try {
          const userResponse = await baseQuery({
            url: `users/${userId}`,
            method: "GET",
          });
          if (userResponse.error) return { error: userResponse.error };

          const user = userResponse.data;

          const confirmedOrder = user.orders.find(
            (order) => order.orderId === orderId
          );
          if (!confirmedOrder) {
            return { error: { message: "Order not found in user's orders" } };
          }

          const updatedOrders = user.orders.filter(
            (order) => order.orderId !== orderId
          );

          const updatedOrdersHistory = [...user.ordersHistory, confirmedOrder];

          const userUpdateResponse = await baseQuery({
            url: `users/${userId}`,
            method: "PATCH",
            body: {
              orders: updatedOrders,
              ordersHistory: updatedOrdersHistory,
            },
          });

          if (userUpdateResponse.error)
            return { error: userUpdateResponse.error };

          return { data: userUpdateResponse.data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (result, error, { userId }) => [
        { type: "Orders", id: userId },
      ],
    }),

    cancelOrder: builder.mutation({
      queryFn: async (
        { userId, orderId },
        _queryApi,
        _extraOptions,
        baseQuery
      ) => {
        try {
          const userResponse = await baseQuery({
            url: `users/${userId}`,
            method: "GET",
          });
          if (userResponse.error) return { error: userResponse.error };

          const user = userResponse.data;

          const updatedOrders = user.orders.filter(
            (order) => order.orderId !== orderId
          );

          const userUpdateResponse = await baseQuery({
            url: `users/${userId}`,
            method: "PATCH",
            body: { orders: updatedOrders },
          });

          if (userUpdateResponse.error)
            return { error: userUpdateResponse.error };

          return { data: userUpdateResponse.data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (result, error, { userId }) => [
        { type: "Orders", id: userId },
      ],
    }),

    getUserOrders: builder.query({
      query: (userId) => `users/${userId}`,
      providesTags: (result, error, userId) => [{ type: "Orders", id: userId }],
    }),
  }),
});

export const {
  useGetCatalogQuery,
  useGetSectionsQuery,
  useGetGoodsQuery,
  useGetSearchResultsQuery,
  useUpdateInFavoritesStatusMutation,
  useUpdateInBasketStatusMutation,
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useAddGoodsMutation,
  useDeleteGoodsMutation,
  useUpdateGoodsMutation,
  useUpdateUserIsCurrentMutation,
  useResetAllUsersIsCurrentMutation,
  useResetAllFavoritesMutation,
  useSyncFavoritesOnLoginMutation,
  useResetAllBasketMutation,
  useSyncBasketOnLoginMutation,
  useUpdatePlaceOnOrderStatusMutation,
  useConfirmOrderMutation,
  useCancelOrderMutation,
  useGetUserOrdersQuery,
  useGetBrandsQuery,
  useGetPromoQuery,
} = rtkApi;
