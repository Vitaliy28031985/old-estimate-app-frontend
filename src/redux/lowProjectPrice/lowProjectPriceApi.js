import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = process.env.REACT_APP_API_URL;

export const lowProjectPriceApi = createApi({
    reducerPath: 'lowProjectPriceApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${apiUrl}low/project/price`,
      prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
      },
    }),
    tagTypes: ['Project'],
    endpoints: builder => ({
      addLowProjectPrice: builder.mutation({
         query:({id, newPrice}) => ({
          url: `/${id}`,
          method: 'POST',
          body: newPrice,
        }),
     
        invalidatesTags: ['Project'],
      }),
      deleteLowProjectPrice: builder.mutation({
        query: ({ idPro, idPrice }) => ({
          url: `/${idPro}/${idPrice}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Project'],
      }),
      updateLowProjectPrice: builder.mutation({
        query: ({ idPro, idPrice, newData }) => ({
          url: `/${idPro}/${idPrice}`,
          method: 'PATCH',
          body: newData,  
        }),
        invalidatesTags: ['Project'],
      }),
      
    }),
  });

  export const {
    useAddLowProjectPriceMutation,
    useDeleteLowProjectPriceMutation,
    useUpdateLowProjectPriceMutation
    
  } = lowProjectPriceApi;