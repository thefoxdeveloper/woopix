"use client";

import { useState } from "react";
import { InputNumberFormat } from "@react-input/number-format";
import Image from "next/image";
import logo from "./assets/Logo.svg";
import Link from "next/link";

export default function Home() {
  const [currentValue, setCurrentValue] = useState<string>("");
  const [totalValue, setTotalValue] = useState<number>(0);

  const handleValueChange = (event: any) => {
    let formattedNumber = event.target.value.replace(/[^0-9]/g, "");

    if (formattedNumber.length > 0) {
      formattedNumber = formattedNumber.slice(0, -2);
    }

    setCurrentValue(event.target.value);
    setTotalValue(Number(formattedNumber));
  };

  return (
    <main className="flex min-h-screen  flex-col items-center gap-20 p-24 bg-white">
      <div className=" flex flex-col gap-20 items-center w-full sm:w-[450px] ">
        <Image src={logo} alt="Woovi Logo" width={500} height={150} />
        <div className="brutalist-container">
          {/* <input
          type="text"
          id="currentValue"
          className="brutalist-input smooth-type"
          ref={withMask("currency")}
        /> */}
          <InputNumberFormat
            locales="pt-BR"
            format="currency"
            currency="BRL"
            id="currentValue"
            className="brutalist-input smooth-type"
            value={currentValue}
            onChange={handleValueChange}
          />

          <label className="brutalist-label uppercase">Valor da Venda</label>
        </div>
        <Link href={`/payment-method?value=${totalValue}`}>
          <button className="cursor-pointer font-semibold overflow-hidden relative z-100 border border-[#03d69d] group px-8 py-2">
            <span className="relative z-10 text-[#03d69d] group-hover:text-white text-xl duration-500">
              Vender
            </span>
            <span className="absolute w-full h-full bg-[#03d69d] -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-500"></span>
            <span className="absolute w-full h-full bg-[#03d69d] -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-500"></span>
          </button>
        </Link>
      </div>
    </main>
  );
}
