import * as RadioGroup from "@radix-ui/react-radio-group";
import { CheckCircle, Circle, CircleCheck } from "lucide-react";
import { useEffect } from "react";

type PixOneProps = { value: number; cashback: number; isSelected: boolean };

export default function PixOne({ value, cashback, isSelected }: PixOneProps) {
  const valueFormatted = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const totalCashback = (value * cashback) / 100;
  const totalCashbackFormatted = totalCashback.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  useEffect(() => {
    if (isSelected) {
      sessionStorage.setItem(
        "selectedItem",
        JSON.stringify({ total: valueFormatted })
      );
    }

    sessionStorage.setItem("installments", JSON.stringify({ quantity: 0 }));
  }, [isSelected, valueFormatted]);

  return (
    <div
      id="highlightedPix"
      className={`relative ${
        isSelected ? "border-[#03D69D]" : "border-[#E5E5E5]"
      } border-2 rounded-xl flex flex-col p-4 font-nunito gap-0`}
    >
      <div className="absolute -top-4 left-5 bg-[#f0f0f0] text-black font-extrabold text-base rounded-xl px-3">
        Pix
      </div>

      <div className="justify-between flex items-center">
        <span className="flex gap-1 items-center flex-row">
          <span className="text-[#4D4D4D] font-extrabold text-2xl">1x</span>
          <span className="text-[#4D4D4D] font-semibold text-2xl">
            {valueFormatted}
          </span>
        </span>
        <RadioGroup.Item value={"x"}>
          {isSelected ? (
            <CircleCheck className="w-6 h-6 text-white bg-[#03D69D] rounded-full" />
          ) : (
            <Circle className="w-6 h-6 text-gray-200" />
          )}
          <RadioGroup.Indicator className="w-8 h-8 rounded-full">
            {!isSelected ? <Circle className="w-6 h-6 text-gray-500" /> : ""}
          </RadioGroup.Indicator>
        </RadioGroup.Item>
      </div>
      <div className="justify-between flex items-center">
        <span className="text-[#03D69D] font-semibold text-base">
          Ganhe
          <span className="text-[#03D69D] font-semibold"> {cashback}%</span> de
          Cashback
        </span>
      </div>
      <div className="justify-between flex items-center">
        <div className="bg-[#133A6F] rounded-md h-8 w-full flex items-center p-2 mt-2 relative">
          <div className="w-0 h-0 border-t-[20px] border-b-[20px] border-r-[24px] border-transparent border-r-white absolute -right-1"></div>
          <span className="text-white text-xs sm:text-sm font-semibold w-11/12">
            🤑 <span className="font-extrabold">{totalCashbackFormatted} </span>
            de volta no seu Pix na hora
          </span>
        </div>
      </div>
    </div>
  );
}
