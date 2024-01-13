import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Text,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Button,
  CardHeader,
  Heading,
} from "@chakra-ui/react";

// custom hooks
import { useSales } from "../../hooks/useSales";
import { useSaleDetails } from "../../hooks/useSaleDetails";

// components
import Loading from "../common/Loading";
import { useState } from "react";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title
);

const BarChart = () => {
  const { query: querySaleDetails } = useSaleDetails({
    all: false,
    historyMonthToRetrieve: 12,
  });

  const [numberOfMonth, setNumberOfMonth] = useState(6);

  let costObj = {
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
  querySaleDetails?.data?.forEach((saleDetail) => {
    if (costObj.hasOwnProperty(new Date(saleDetail.createdAt).getMonth() + 1)) {
      if (saleDetail.product !== null) {
        costObj[new Date(saleDetail.createdAt).getMonth() + 1].total +=
          saleDetail?.product?.costPrice * saleDetail?.quantity;
      }
    } else {
      if (saleDetail.product !== null) {
        costObj[new Date(saleDetail.createdAt).getMonth() + 1] = {
          total: saleDetail?.product?.costPrice * saleDetail?.quantity,
        };
      }
    }
  });
  const costArr = Object.keys(costObj).map((key) => {
    return {
      ...costObj[key],
      month: Number.parseInt(key),
    };
  });

  const { query: querySales } = useSales({
    all: false,
    historyMonthToRetrieve: 12,
  });

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
  const saleArr = Object.keys(obj).map((key) => {
    return {
      ...obj[key],
      month: Number.parseInt(key),
    };
  });

  const profitArr = [];
  saleArr.forEach((sale) => {
    costArr.forEach((cost) => {
      {
        if (sale.month === cost.month) {
          profitArr.push({ total: sale.total - cost.total, month: sale.month });
        }
      }
    });
  });

  const total = querySales?.data
    ?.map((sale) => sale?.total)
    ?.reduce((acc, currentValue) => acc + currentValue, 0)
    .toFixed(2);

  const options = {
    responsive: true,
    type: "Bar",
    plugins: {
      legend: {
        display: false,
      },
      // title: {
      //   display: true,
      //   text: `Ganancia últimos ${numberOfMonth} meses`,
      // },
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
      .slice(currentMonth - numberOfMonth)
      .concat(months.slice(currentMonth - 1, currentMonth)),
    datasets: [
      {
        data: profitArr
          .slice(currentMonth - numberOfMonth)
          .concat(profitArr.slice(currentMonth - 1, currentMonth))
          .map((current) => current.total),
        backgroundColor: ["#805AD5"],
      },
    ],
  };

  const lastTwelveYears = profitArr
    .slice(currentMonth - numberOfMonth)
    .concat(profitArr.slice(currentMonth - 1, currentMonth))
    .map((current) => {
      return (
        <Card key={current.month} variant="outline" mb={3}>
          <CardBody>
            <Flex direction="row" justifyContent={"space-between"}>
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

  if (querySales?.isLoading) {
    return <Loading />;
  }

  if (!querySales?.isLoading && total?.length === 0) {
    return <Text>No hay datos</Text>;
  }

  if (!querySales?.isLoading && total?.length > 0) {
    return (
      <>
        <Card variant="outline" mb={3}>
          <CardHeader textAlign={"center"}>
            <Heading size={"lg"}>
              Ganancia últimos {numberOfMonth} meses
            </Heading>
          </CardHeader>
          <CardBody>
            <Bar options={options} data={data} />
          </CardBody>
          <Divider />
          <CardFooter justifyContent={"center"}>
            <Flex gap={2}>
              <Button
                onClick={() => setNumberOfMonth(12)}
                colorScheme="purple"
                variant="ghost"
              >
                12 meses
              </Button>
              <Button
                onClick={() => setNumberOfMonth(6)}
                colorScheme="purple"
                variant="ghost"
              >
                6 meses
              </Button>
              <Button
                onClick={() => setNumberOfMonth(3)}
                colorScheme="purple"
                variant="ghost"
              >
                3 meses
              </Button>
            </Flex>
          </CardFooter>
        </Card>
        {lastTwelveYears}
      </>
    );
  }
};

export default BarChart;
