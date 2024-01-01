import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Text, Card, CardBody, Flex } from "@chakra-ui/react";

// custom hooks
import { useSales } from "../../hooks/useSales";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

const BarChart = () => {
  const { query: querySales } = useSales({ all: true });

  let obj = {
    1: { total: 0 },
    2: { total: 0 },
    3: { total: 0 },
    4: { total: 0 },
    5: { total: 0 },
    6: { total: 0 },
    7: { total: 0 },
    8: { total: 0 },
    9: { total: 0 },
    10: { total: 0 },
    11: { total: 0 },
    12: { total: 0 },
  };
  querySales?.data?.forEach((sale) => {
    if (obj.hasOwnProperty(new Date(sale.createdAt).getMonth() + 1)) {
      obj[new Date(sale.createdAt).getMonth() + 1].total += sale.total;
    } else {
      obj[new Date(sale.createdAt).getMonth() + 1] = {
        total: sale.total,
      };
    }
  });
  const arr = Object.keys(obj).map((key) => {
    return {
      ...obj[key],
      month: Number.parseInt(key),
    };
  });

  const total = querySales?.data
    ?.map((sale) => sale?.total)
    ?.reduce((acc, currentValue) => acc + currentValue, 0)
    .toFixed(2);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Facturación últimos 12 meses",
      },
    },
  };

  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const monthsLong = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  let currentMonth = new Date().getMonth() + 1;

  const data = {
    labels: months
      .slice(currentMonth - 12)
      .concat(months.slice(currentMonth, currentMonth)),
    datasets: [
      {
        data: arr
          .slice(currentMonth - 12)
          .concat(arr.slice(currentMonth, currentMonth))
          .map((current) => current.total),
        backgroundColor: ["#805AD5"],
      },
    ],
  };

  const lastTwelveYears = arr
    .slice(currentMonth - 12)
    .concat(arr.slice(currentMonth, currentMonth))
    .map((current) => {
      return (
        <Card key={current.month} variant="outline" mb={3}>
          <CardBody>
            <Flex mb={2} direction="row" justifyContent={"space-between"}>
              <Text>{monthsLong[current.month - 1]}:</Text>
              <Text as={"span"} fontWeight={"bold"}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  minimumFractionDigits: 2,
                  currency: "USD",
                }).format(current.total)}
              </Text>
            </Flex>
          </CardBody>
        </Card>
      );
    })
    .reverse();

  if (!querySales?.isLoading && total?.length === 0) {
    return <Text>No hay datos</Text>;
  }

  if (!querySales?.isLoading && total?.length > 0) {
    return (
      <>
        <Card variant="outline" mb={3}>
          <CardBody>
            <Bar options={options} data={data} />
          </CardBody>
        </Card>
        {lastTwelveYears}
      </>
    );
  }
};

export default BarChart;
