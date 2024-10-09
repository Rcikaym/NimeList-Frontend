// File: components/SalesData.tsx
import React, { useState, useEffect } from "react";
import { DatePicker, message, Spin } from "antd";
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
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesItem {
  month: string;
  income: number;
}

const SalesData: React.FC = () => {
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [salesData, setSalesData] = useState<SalesItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch data penjualan berdasarkan tahun yang dipilih
  const fetchSalesData = async (year: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4321/dashboard/bar-chart?year=${year}`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      const data: SalesItem[] = await response.data;
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      message.error("Gagal mengambil data penjualan.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data penjualan saat component pertama kali di-load
  useEffect(() => {
    fetchSalesData(currentYear); // Default ke tahun saat ini
  }, [currentYear]);

  // Handle ketika tahun dipilih menggunakan DatePicker
  const handleYearChange = (date: dayjs.Dayjs) => {
    if (date) {
      setSelectedYear(date.year().toString());
      fetchSalesData(date.year());
    }
  };

  // Menyiapkan data untuk Chart.js
  const chartData: ChartData<"bar", number[], string> = {
    labels: salesData.map((item) => item.month),
    datasets: [
      {
        label: `Income (Rp)`,
        data: salesData.map((item) => item.income),
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
        onChange={handleYearChange}
        style={{ marginBottom: "20px" }}
      />

      {loading ? (
        <Spin tip="Loading..." />
      ) : salesData.length > 0 ? (
        <div className="h-[460px] w-full">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p>There is no income report for this year.</p>
      )}
    </div>
  );
};

export default SalesData;
