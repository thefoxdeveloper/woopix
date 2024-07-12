"use client";

import Image from "next/image";

export default function Home() {
  const handleSubmit = (event: any) => {
    event.preventDefault();

    console.log("Form submitted");
  };
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <Image src="/logo.svg" alt="Woovi Logo" width={500} height={150} />
    </main>
  );
}
