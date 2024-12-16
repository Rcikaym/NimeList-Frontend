"use client";

// File: components/SalesData.tsx
import React, { useState, useEffect } from "react";
import { DatePicker, message } from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { LoadingOutlined } from "@ant-design/icons";
import apiUrl from "@/hooks/api";
import { BiErrorAlt } from "react-icons/bi";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface IncomeItem {
  month: string;
  income: number;
  total_success_transactions: number;
  total_failed_transactions: number;
}

const IncomeData: React.FC = () => {
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [incomeData, setIncomeData] = useState<IncomeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch data penjualan berdasarkan tahun yang dipilih
  const fetchIncomeData = async (year: number) => {
    setLoading(true);
    try {
      const response = await apiUrl.get(
        `http://localhost:4321/dashboard/income-data?year=${year}`
      );
      const data: IncomeItem[] = await response.data;
      setIncomeData(data);
      setLoading(false);
    } catch (error) {
      message.error("Gagal mengambil data penjualan.");
    }
  };

  // Fetch data penjualan saat component pertama kali di-load
  useEffect(() => {
    fetchIncomeData(currentYear); // Default ke tahun saat ini
  }, [currentYear]);

  // Handle ketika tahun dipilih menggunakan DatePicker
  const handleYearChange = (date: dayjs.Dayjs) => {
    if (date) {
      setSelectedYear(date.year().toString());
      fetchIncomeData(date.year());
    }
  };

  // Menyiapkan data untuk Chart.js
  const incomeChartData: ChartData<"bar", number[], string> = {
    labels: incomeData.map((item) => item.month),
    datasets: [
      {
        label: `Income (Rp)`,
        data: incomeData.map((item) => item.income),
        backgroundColor: "#047857",
        borderColor: "#047857",
        borderWidth: 1,
      },
    ],
  };

  const transactionsChartData: ChartData<"bar", number[], string> = {
    labels: incomeData.map((item) => item.month),
    datasets: [
      {
        label: `Success Transaction`,
        data: incomeData.map((item) => item.total_success_transactions),
        backgroundColor: "#047857",
        borderColor: "#047857",
        borderWidth: 1,
      },
      {
        label: `Failed Transaction`,
        data: incomeData.map((item) => item.total_failed_transactions),
        backgroundColor: "#ad0707",
        borderColor: "#ad0707",
        borderWidth: 1,
      },
    ],
  };

  // Opsi untuk Chart.js
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <>
      <h2>Select the Year for the Report</h2>
      <DatePicker
        picker="year"
        value={dayjs(selectedYear, "YYYY")}
        onChange={handleYearChange}
        disabledDate={(current) => {
          // Disable all dates after the current year
          return current && current.year() > dayjs().year();
        }}
      />
      <div className="w-full h-full my-7">
        {loading ? (
          <div className="flex justify-center items-center">
            <LoadingOutlined />
          </div>
        ) : incomeData.length > 0 ? (
          <>
            <div className="flex flex-col gap-8">
              <div className="w-full h-[37.5rem]">
                <Bar data={incomeChartData} options={options} />
              </div>
              <div className="w-full h-[37.5rem]">
                <Bar data={transactionsChartData} options={options} />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full font-bold flex gap-2 justify-center h-full items-center">
            <BiErrorAlt size={60} />
            <span>No data found</span>
          </div>
        )}
      </div>
    </>
  );
};

export default IncomeData;
