"use client";

import PixOne from "@/components/PixOne";
import PixInstallments from "@/components/PixParcelado";
import * as RadioGroup from "@radix-ui/react-radio-group";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import logo from "../assets/Logo.svg";
import payment from "../assets/payment.svg";
import { useToast } from "@/components/ui/use-toast";

export default function PaymentMethod() {
  const [totalValue, setTotalValue] = useState<number>(0);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const getValueFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get("value"));
  };

  useEffect(() => {
    setTotalValue(getValueFromURL());
  }, []);

  const installments = 11;
  const installmentDiscount = {
    installment: 3,
    discount: 10,
  };

  const cardsData = Array.from({ length: installments }, (_, index) => {
    const valuePerInstallment = totalValue / (index + 2);
    return {
      value: valuePerInstallment,
      discount:
        index + 1 === installmentDiscount.installment
          ? installmentDiscount.discount
          : -1 + -index,
    };
  });

  const { toast } = useToast();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 bg-white">
      <div className=" flex flex-col gap-20 items-center w-full sm:w-[450px] ">
        <Image src={logo} alt="Woovi Logo" width={123} height={36} />

        <span className="text-2xl font-extrabold text-[#4D4D4D] text-center    font-nunito">
          João, como você quer pagar?
        </span>
        <RadioGroup.Root
          onValueChange={(value) => setSelectedValue(value)}
          className="flex flex-col w-full"
        >
          <div className="mb-8">
            <PixOne
              value={totalValue}
              cashback={3}
              isSelected={selectedValue === "x"}
            />
          </div>

          {cardsData.map((data, index) => (
            <PixInstallments
              key={index}
              value={data.value}
              discount={data.discount}
              index={index}
              isFirst={index === 0}
              isLast={index === cardsData.length - 1}
              isSelected={selectedValue === index.toString()}
              installments={index + 2}
            />
          ))}
        </RadioGroup.Root>

        <Link
          href={`/pix-credit-card`}
          onClick={(e) => {
            if (!selectedValue) {
              e.preventDefault();

              toast({
                variant: "destructive",

                description: "Selecione um meio de pagamento!",
              });
            }
          }}
        >
          <button
            className="cursor-pointer transition-all bg-[#03d69d] text-white px-6 py-2 rounded-lg
        border-[#17a17d]
         border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
         active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
          >
            Ir para o pagamento
          </button>
        </Link>

        <Image src={payment} alt="Woovi Logo" width={250} height={36} />
      </div>
    </main>
  );
}
