import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import saleDetailService from "../services/saleDetails";

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useTodayDate } from "./useTodayDate";

export const useSaleDetails = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const today = useTodayDate();

  const { all, historyMonthToRetrieve, saleId } = props;

  const filters = JSON.parse(window.localStorage.getItem("filters"));

  const [rangeDateFilter, setRangeDateFilter] = useState({
    startDate: today,
    endDate: today,
  });

  const query = useQuery({
    queryKey: [
      "saleDetails",
      {
        filters: filters
          ? { ...filters, all, historyMonthToRetrieve, saleId }
          : { ...rangeDateFilter, all, historyMonthToRetrieve, saleId },
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
