"use client"; // Ensure it's a client component

import { useRouter } from "next/navigation"; // Use router from next/navigation
import { Pagination } from "@nextui-org/react";

type ClientPaginationProps = {
  currentPage: number;
  total: number; // Total number of items
};

const ClientPagination: React.FC<ClientPaginationProps> = ({
  total,
  currentPage,
}) => {
  const router = useRouter(); // Client-side routing

  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}`); // Navigate to the new page
  };

  // Calculate total pages
  const totalPages = Math.ceil(total / 25); // Assuming pageSize is 25

  return (
    <div className="flex justify-center items-center mt-4 mb-4">
      <Pagination
        total={totalPages}
        initialPage={currentPage}
        onChange={handlePageChange}
        showControls
        showShadow
        size="md"
        color="primary"
        variant="bordered"
      />
    </div>
  );
};

export default ClientPagination;
