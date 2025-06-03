"use client";

import dynamic from "next/dynamic";

const Comments = dynamic(() => import("./Comments/Comments"), { ssr: false });

export default function ClientCommentsWrapper({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return <Comments title={title} description={description} />;
}
