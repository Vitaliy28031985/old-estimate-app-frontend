import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const apiUrl = process.env.REACT_APP_API_URL;
export const priceApi = createApi({
    reducerPath: 'priceApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${apiUrl}`,
      prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
      },
    }),
    tagTypes: ['Price'],
  endpoints: builder => ({
       middleGetPrice: builder.query({
        query: () => `prices/middle`,
        providesTags: ['Prices'],
      }),
      getPrice: builder.query({
        query: () => `prices`,
        providesTags: ['Prices'],
      }),
      addPrice: builder.mutation({
        query: newPrice => ({
          url: 'prices',
          method: 'POST',
          body: newPrice,
        }),
        invalidatesTags: ['Prices'],
      }),
      deletePrice: builder.mutation({
        query: id => ({
          url: `prices/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Prices'],
      }),
      updatePrice: builder.mutation({
        query: ({ id, newData }) => ({
          url: `prices/${id}`,
          method: 'PUT',
          body: newData,  
        }),
        invalidatesTags: ['Prices'],
      }),
      
    }),
  });

export const {
    useMiddleGetPriceQuery,
    useGetPriceQuery,
    useAddPriceMutation,
    useDeletePriceMutation,
    useUpdatePriceMutation
    
  } = priceApi;

  