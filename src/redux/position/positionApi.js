import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = process.env.REACT_APP_API_URL;

export const positionApi = createApi({
  reducerPath: 'positionApi',
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
  tagTypes: ['Positions'],
  endpoints: builder => ({
    addPosition: builder.mutation({
      query: param => ({
        url: `positions/${param.idProj}/${param.idEst}`,
        method: 'POST',
        body: param.position,
      }),
  
      invalidatesTags: ['Positions'],
    }) ,
    updatePosition: builder.mutation({
     
      query: ([prjId, estId, posId, newData]) => ({  
        url: `positions/${prjId}/${estId}/${posId}`,
        method: 'PATCH',
        body: newData, 
      
      }),
      invalidatesTags: ['Positions'],
    }),
    deletePosition: builder.mutation({
      query: param => ({
        url: `positions/${param.idPro}/${param.idEst}/${param.idPos}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Positions'],
    }),


  }),
});

export const {
  useAddPositionMutation,
  useUpdatePositionMutation,
  useDeletePositionMutation

} = positionApi;