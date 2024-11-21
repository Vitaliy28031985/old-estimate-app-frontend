import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = process.env.REACT_APP_API_URL;

export const lowPositionApi = createApi({
  reducerPath: 'lowPositionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}low/position`,
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
    addLowPosition: builder.mutation({
      query: param => ({
        url: `/${param.idProj}/${param.idEst}`,
        method: 'POST',
        body: param.position,
      }),
  
      invalidatesTags: ['Positions'],
    }) ,
    updateLowPosition: builder.mutation({
     
      query: ([prjId, estId, posId, newData]) => ({  
        url: `/${prjId}/${estId}/${posId}`,
        method: 'PATCH',
        body: newData, 
      
      }),
      invalidatesTags: ['Positions'],
    }),
    deleteLowPosition: builder.mutation({
      query: param => ({
        url: `/${param.idPro}/${param.idEst}/${param.idPos}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Positions'],
    }),


  }),
});

export const {
  useAddLowPositionMutation,
  useUpdateLowPositionMutation,
  useDeleteLowPositionMutation

} = lowPositionApi;