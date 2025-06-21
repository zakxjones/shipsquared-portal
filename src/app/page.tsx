"use client";
import Image from "next/image";
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    window.location.href = "/dashboard";
  }, []);

  return null;
}
