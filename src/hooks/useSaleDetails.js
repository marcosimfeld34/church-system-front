import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import saleDetailService from "../services/saleDetails";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useSaleDetails = (props) => {
  const axiosPrivate = useAxiosPrivate();

  const { all } = props;

  const filters = JSON.parse(window.localStorage.getItem("filters"));

  const today = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  const [rangeDateFilter, setRangeDateFilter] = useState({
    startDate: today,
    endDate: today,
  });

  const query = useQuery({
    queryKey: [
      "saleDetails",
      {
        filters: filters ? { ...filters, all } : { ...rangeDateFilter, all },
      },
    ],
    queryFn: async (key) => {
      const filters = key?.queryKey[1]?.filters;

      const { data } = await saleDetailService.getAll(
        { ...filters },
        axiosPrivate
      );
      return data;
    },
  });

  return { query, setRangeDateFilter };
};
