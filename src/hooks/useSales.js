import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import saleService from "../services/sale";

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useTodayDate } from "./useTodayDate";

export const useSales = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const today = useTodayDate();

  const { all, id } = props;

  const filters = JSON.parse(window.localStorage.getItem("filters"));

  const [rangeDateFilter, setRangeDateFilter] = useState({
    startDate: today,
    endDate: today,
  });

  const query = useQuery({
    queryKey: [
      "sales",
      {
        filters: filters
          ? { ...filters, all, id }
          : { ...rangeDateFilter, all, id },
      },
    ],
    queryFn: async (key) => {
      const filters = key?.queryKey[1]?.filters;
      const { data } = await saleService.getAll({ ...filters }, axiosPrivate);
      return data;
    },
  });

  return { query, setRangeDateFilter };
};
