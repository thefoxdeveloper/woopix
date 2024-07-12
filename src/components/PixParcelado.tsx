import * as RadioGroup from "@radix-ui/react-radio-group";
import { CheckCircle, Circle, CircleCheck } from "lucide-react";

type PixParceladoProps = {
  value: number;
  desconto: number;
  isFirst: boolean;
  isLast: boolean;
  index: number;
  isSelected: boolean;
};

export default function PixParcelado({
  value,
  desconto,
  isFirst,
  isLast,
  index,
  isSelected,
}: PixParceladoProps) {
  const valueFormated = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const valueAfterDiscount = value - (value * (desconto ?? 0)) / 100;
  const valueAfterDiscountFormated = valueAfterDiscount.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );
  const totalDesconto = valueAfterDiscount * (index + 2);
  const totalDescontoFormated = totalDesconto.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  if (isSelected) {
    sessionStorage.setItem(
      "selectedItem",
      JSON.stringify({ total: totalDescontoFormated })
    );
    console.log("Item salvo no sessionStorage.");
  } else {
    console.log("Item não selecionado, nada foi salvo.");
  }
  return (
    <div
      id="pixDestacado"
      className={`relative  ${
        isSelected ? "border-[#03D69D]" : "border-[#E5E5E5]"
      }  border-2 flex flex-col p-4 font-nunito gap-0 ${
        isFirst ? "rounded-t-xl" : ""
      } ${isLast ? "rounded-b-xl" : ""} ${
        !isFirst && !isLast ? "rounded-none" : ""
      }`}
    >
      {isFirst && (
        <div className="absolute -top-4 left-5 bg-[#f0f0f0] text-black font-extrabold text-base  rounded-xl px-3  ">
          Pix Parcelado
        </div>
      )}
      <div className="w-full h-full justify-between flex items-center ">
        <span className="flex gap-1 items-center flex-row">
          <span className="text-[#4D4D4D] font-extrabold text-2xl">
            {index + 2}x
          </span>
          <span className="text-[#4D4D4D] font-semibold text-2xl">
            {valueAfterDiscount === 0 ? (
              <div>{valueFormated}</div>
            ) : (
              <div>{valueAfterDiscountFormated}</div>
            )}
          </span>
        </span>{" "}
        <RadioGroup.Item value={index.toString()} id={totalDescontoFormated}>
          {!isSelected === true ? (
            <Circle className="w-6 h-6 text-gray-200" />
          ) : (
            ""
          )}
          <RadioGroup.Indicator className="w-8 h-8 rounded-full">
            {isSelected === true ? (
              <CircleCheck className="w-6 h-6 text-white bg-[#03D69D] rounded-full" />
            ) : (
              <Circle className="w-6 h-6 text-gray-500" />
            )}
          </RadioGroup.Indicator>
        </RadioGroup.Item>
      </div>
      <div className="w-full h-full justify-between flex items-center ">
        <span className="text-[#AFAFAF] font-semibold text-base flex flex-row gap-1">
          Total
          <span className="text-[#AFAFAF] font-semibold">
            {totalDescontoFormated}
          </span>
        </span>
      </div>
      {desconto > 0 ? (
        <div className="justify-between flex items-center ">
          <div className="bg-[#133A6F] rounded-md h-8 w-full flex items-center p-2 mt-2 relative">
            <div className="w-0 h-0 border-t-[20px] border-b-[20px] border-r-[24px] border-transparent border-r-white absolute -right-1"></div>
            <span className="text-white text-xs sm:text-sm font-semibold w-11/12 ">
              <span className="font-extrabold">-{desconto}% de juros: </span>
              Melhor opção de parcelamento
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
