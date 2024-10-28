"use client";
import { AiFillStar, AiOutlineTrophy } from "react-icons/ai";
import { Table } from "antd";
import { useEffect, useState } from "react";

interface animeTop {
  title: string;
  total_review: number;
  avg_rating: number;
  weighted_rating: number;
}

// Komponen untuk mendefinisikan kolom
const columnsAnimeTop = [
  {
    title: "No.",
    dataIndex: "no",
    render: (text: string, record: any, index: number) => (
      <span>{index + 1}.</span>
    ),
  },
  {
    title: "Title",
    dataIndex: "title",
  },
  {
    title: "Total Review",
    dataIndex: "total_reviews",
    render: (totalReview: number) => <span>{totalReview} Reviews</span>,
  },
  {
    title: "Average Rating",
    dataIndex: "avg_rating",
    render: (rating: number) => (
      <span className="gap-1 flex items-center">
        {rating}
        <AiFillStar style={{ color: "#fadb14" }} />
      </span>
    ),
  },
  {
    title: "Weighted Rating",
    dataIndex: "weighted_rating",
    render: (rating: number) => (
      <span className="gap-1 flex items-center">
        {rating}
        <AiFillStar style={{ color: "#fadb14" }} />
      </span>
    ),
  },
];

const TableTop10Anime = () => {
  const [data, setData] = useState<animeTop[]>([]);

  useEffect(() => {
    const fetchAnime = async () => {
      const res = await fetch("http://localhost:4321/dashboard/top-10-anime");
      setData(await res.json());
    };

    fetchAnime();
  }, []);

  return (
    <>
      <Table
        dataSource={data}
        columns={columnsAnimeTop}
        pagination={{ position: ["none"] }}
        title={() => (
          <h3 className="text-black font-regular font-semibold text-lg flex items-center gap-2">
            Top 10 Anime of All Time{" "}
            <div className="shadow-sm shadow-gray-400 rounded-md p-1">
              <AiOutlineTrophy
                style={{ fontSize: 20 }}
                className="text-emerald-700"
              />
            </div>
          </h3>
        )}
      />
    </>
  );
};

export default TableTop10Anime;
