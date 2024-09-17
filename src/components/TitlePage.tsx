"use client";

import React, { useEffect } from 'react';

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  useEffect(() => {
    document.title = title; // Mengubah metadata title di client side
  }, [title]); // Akan terpicu setiap kali title berubah

  return null; // Tidak perlu menampilkan apa-apa di halaman
};

export default PageTitle;