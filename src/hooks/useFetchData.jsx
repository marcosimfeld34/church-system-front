import { useQuery } from "react-query";

export const useFetchData = (queryKey, queryFn) => {
  const query = useQuery({
    queryKey,
    queryFn,
  });

  return query;
};
