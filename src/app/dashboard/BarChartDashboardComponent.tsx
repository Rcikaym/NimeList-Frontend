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
  const chartData: ChartData<"bar", number[], string> = {
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

  // Opsi untuk Chart.js
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${selectedYear} Income Report`,
      },
    },
  };

  return (
    <div>
      <h2>Select the Year for the Income Report</h2>
      <DatePicker
        picker="year"
        value={dayjs(selectedYear, "YYYY")}
        onChange={handleYearChange}
        style={{ marginBottom: "20px" }}
      />
      {loading ? (
        <div className="h-[460px] w-full flex justify-center items-center">
          <LoadingOutlined />
        </div>
      ) : incomeData.length > 0 ? (
        <div className="h-[460px] w-full">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p>There is no income report for this year.</p>
      )}
    </div>
  );
};

export default IncomeData;
