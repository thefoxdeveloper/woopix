"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronUp, Circle, CircleCheck, Copy } from "lucide-react";
import PaymentTerm from "@/components/PaymentTerm";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import logo from "../assets/Logo.svg";
import payment from "../assets/payment.svg";

const schema = z.object({
  nome: z.string().min(1, "Nome completo é obrigatório"),
  cpf: z.string().length(14, "CPF inválido"),
  numeroCartao: z.string().min(16, "Número do cartão inválido"),
  vencimento: z.string().min(4, "Data de vencimento inválida"),
  cvv: z.string().length(3, "CVV inválido"),
  parcelas: z.string(),
});
const normalizeCardNumber = (value: any) => {
  return (
    value
      .replace(/\s/g, "")
      .match(/.{1,4}/g)
      ?.join(" ")
      .substr(0, 19) || ""
  );
};

const normalizeCPF = (value: any): string => {
  return (
    value
      .replace(/\D/g, "")
      .match(/.{1,3}/g)
      ?.join(".")
      .replace(/^(\d{3}\.\d{3}\.\d{3})\.(\d{2}).*/, "$1-$2") || ""
  );
};
const normalizeDate = (value: any): string => {
  return (
    value
      .replace(/\D/g, "") // Remove todos os caracteres que não são dígitos
      .slice(0, 4) // Limita a 4 dígitos
      .match(/.{1,2}/g) // Divide em grupos de 2 dígitos
      ?.join("/") // Junta os grupos com "/"
      .replace(/^(\d{2})(\d{2})/, "$1/$2") || "" // Adiciona o formato DD/MM
  );
};
const normalizeCVV = (value: any): string => {
  return value
    .replace(/\D/g, "") // Remove todos os caracteres que não são dígitos
    .slice(0, 3); // Limita a 3 dígitos
  // Preenche com zeros à esquerda se houver menos de 3 dígitos
};

export default function PaymentForm() {
  const [installments, setInstallments] = useState<number | null>(null);
  const [value, setValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [totalInstallments, setTotalInstallments] = useState(0);
  const [copySuccess, setCopySuccess] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    // Function to get installments and selected item from sessionStorage
    const fetchSessionData = () => {
      const storedInstallments = sessionStorage.getItem("installments");
      const storedValue = sessionStorage.getItem("selectedItem");

      if (storedInstallments) {
        const data = JSON.parse(storedInstallments);
        setTotalInstallments(data.quantity);
      }

      if (storedValue) {
        const data = JSON.parse(storedValue);
        setTotalValue(parseCurrencyBR(data.total));
      }
      setDeadline(PaymentTerm());
    };

    fetchSessionData();
  }, []);

  function parseCurrencyBR(formattedValue: string) {
    let unformattedValue = formattedValue
      .replace(/\s+/g, "")
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".");

    return parseFloat(unformattedValue);
  }

  function formatToCurrencyBR(number: number | bigint) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(number);
  }

  const half = totalValue / 2;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);

    // Seleciona os elementos pelo ID
    const notPaidElement = document.getElementById("notpaid");
    const paidElement = document.getElementById("paid");
    const successElement = document.getElementById("sucess");
    const successMsgElement = document.getElementById("sucessMsg");

    // Verifica se os elementos existem antes de tentar modificar suas classes
    if (notPaidElement) {
      notPaidElement.style.display = "none";
    }
    if (paidElement) {
      paidElement.style.display = "flex";
    }
    if (successElement) {
      successElement.style.display = "flex";
    }
    if (successMsgElement) {
      successMsgElement.style.display = "flex";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 bg-white relative">
      <div className=" flex flex-col gap-8 items-center w-full sm:w-[450px] ">
        <div
          id="sucess"
          style={{ display: "none" }}
          className="w-full h-full bg-black/60 absolute z-20 flex justify-center items-center"
        >
          <div className="p-3 -mt-60 sm:mt-0 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-48 md:h-48 h-32 w-32 aspect-square rounded-full">
            <div className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"></div>
          </div>
        </div>
        <div
          id="sucessMsg"
          style={{ display: "none" }}
          className="w-full h-full bg-black/40 absolute  z-40 text-white flex justify-center items-center "
        >
          <div className="text-base"> PAGO COM SUCESSO</div>
        </div>
        <Image src={logo} alt="Woovi Logo" width={123} height={36} />
        {totalInstallments > 0 ? (
          <span className="flex flex-row flex-wrap items-center justify-center gap-1 text-2xl font-extrabold text-[#4D4D4D] text-center [text-shadow:_0_4px_4px_rgb(0_0_0_/_40%)] font-nunito">
            João, pague a segunda parte de
            <span>{formatToCurrencyBR(half)}</span> no cartão
          </span>
        ) : (
          <span className="flex flex-row flex-wrap items-center justify-center gap-1 text-2xl font-extrabold text-[#4D4D4D] text-center [text-shadow:_0_4px_4px_rgb(0_0_0_/_40%)] font-nunito"></span>
        )}
        <div className="flex flex-col w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input flex flex-col w-full static">
              <label className="text-gray-900 text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-white w-fit">
                Nome Completo
              </label>
              <input
                className="border-gray-200 input px-[10px] py-[11px] text-xs bg-white border-2 rounded-[5px] focus:outline-none placeholder:text-black/25"
                {...register("nome")}
              />
              {errors.nome && (
                <p className="text-red-500 text-xs">
                  {(errors.nome.message as string) ||
                    "Error message not available"}
                </p>
              )}
            </div>
            <div className="input flex flex-col w-full static">
              <label className="text-gray-900 text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-white w-fit">
                CPF
              </label>
              <input
                className="border-gray-200 input px-[10px] py-[11px] text-xs bg-white border-2 rounded-[5px] focus:outline-none placeholder:text-black/25"
                {...register("cpf")}
                onChange={(event) => {
                  const { value } = event.target;
                  event.target.value = normalizeCPF(value);
                }}
              />
              {errors.cpf && (
                <p className="text-red-500 text-xs">
                  {(errors.cpf.message as string) ||
                    "Error message not available"}
                </p>
              )}
            </div>
            <div className="input flex flex-col w-full static">
              <label className="text-gray-900 text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-white  w-fit">
                Número do Cartão
              </label>
              <input
                className="border-gray-200 input px-[10px] py-[11px] text-xs bg-white border-2 rounded-[5px] focus:outline-none placeholder:text-black/25"
                {...register("numeroCartao")}
                onChange={(event) => {
                  const { value } = event.target;
                  event.target.value = normalizeCardNumber(value);
                }}
              />
              {errors.numeroCartao && (
                <p className="text-red-500 text-xs">
                  {(errors.numeroCartao.message as string) ||
                    "Error message not available"}
                </p>
              )}
            </div>
            <div className="flex flex-row gap-1 w-full">
              <div className="input flex flex-col w-1/2 static">
                <label className="text-gray-900 text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-white w-fit">
                  Vencimento
                </label>
                <input
                  className="border-gray-200 input px-[10px] py-[11px] text-xs bg-white border-2 rounded-[5px] focus:outline-none placeholder:text-black/25"
                  {...register("vencimento")}
                  onChange={(event) => {
                    const { value } = event.target;
                    event.target.value = normalizeDate(value);
                  }}
                />
                {errors.vencimento && (
                  <p className="text-red-500 text-xs">
                    {(errors.vencimento.message as string) ||
                      "Error message not available"}
                  </p>
                )}
              </div>
              <div className="input flex flex-col w-1/2 static">
                <label className="text-gray-900 text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-white after:bg-transparent w-fit">
                  CVV
                </label>
                <input
                  className="border-gray-200 input px-[10px] py-[11px] text-xs bg-white border-2 rounded-[5px] focus:outline-none placeholder:text-black/25"
                  {...register("cvv")}
                  onChange={(event) => {
                    const { value } = event.target;
                    event.target.value = normalizeCVV(value);
                  }}
                />
                {errors.cvv && (
                  <p className="text-red-500 text-xs">
                    {(errors.cvv.message as string) ||
                      "Error message not available"}
                  </p>
                )}
              </div>
            </div>
            <div className="input flex flex-col w-full static">
              <label className="text-gray-900 text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-white w-fit">
                Parcelas
              </label>
              <select
                className="border-gray-200 input px-[10px] py-[11px] text-xs bg-white border-2 rounded-[5px] focus:outline-none"
                {...register("parcelas")}
              >
                <option value="1">1x de {formatToCurrencyBR(half)}</option>
                <option value="2">2x de {formatToCurrencyBR(half / 2)}</option>
                <option value="3">3x de {formatToCurrencyBR(half / 3)}</option>
                <option value="4">4x de {formatToCurrencyBR(half / 4)}</option>
                <option value="5">5x de {formatToCurrencyBR(half / 5)}</option>
                <option value="6">6x de {formatToCurrencyBR(half / 6)}</option>
                <option value="7">7x de {formatToCurrencyBR(half / 7)}</option>
                <option value="8">8x de {formatToCurrencyBR(half / 8)}</option>
                <option value="9">9x de {formatToCurrencyBR(half / 9)}</option>
                <option value="10">
                  10x de {formatToCurrencyBR(half / 10)}
                </option>
                <option value="11">
                  11x de {formatToCurrencyBR(half / 11)}
                </option>
                <option value="12">
                  12x de {formatToCurrencyBR(half / 12)}
                </option>
              </select>
              {errors.parcelas && (
                <p className="text-red-500 text-xs">
                  {(errors.parcelas.message as string) ||
                    "Error message not available"}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-[5px] w-full    mt-4 hover:bg-blue-600 focus:outline-none"
            >
              Enviar
            </button>
          </form>
        </div>
        <div className="flex flex-col items-center gap-2">
          {copySuccess && <span className="text-green-600">{copySuccess}</span>}

          <div className="flex flex-col justify-center items-center">
            <span className="font-semibold text-base text-[#B2B2B2]">
              Prazo de pagamento:
            </span>
            <span className="font-semibold text-base">{deadline}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-full">
          {totalInstallments > 1 ? (
            <div className="flex flex-row justify-between w-full">
              <div className="flex flex-row items-center gap-2">
                <span>
                  <CircleCheck className="w-6 h-6 text-white bg-[#03D69D] rounded-full" />
                </span>
                <span className="font-semibold text-base">
                  1ª entrada no Pix
                </span>
              </div>
              <div>
                <span className="font-extrabold text-base">
                  {formatToCurrencyBR(half)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-row justify-between w-full">
              <div className="flex flex-row items-center gap-2">
                <span>
                  <Circle color="#03d69d" />
                </span>
                <span className="font-semibold text-base">
                  Pagar tudo no pix
                </span>
              </div>
              <div>
                <span className="font-extrabold text-base">
                  {formatToCurrencyBR(totalValue)}
                </span>
              </div>
            </div>
          )}
          {totalInstallments > 1 && (
            <div className="flex flex-row justify-between w-full">
              <div className="flex flex-row items-center gap-2">
                <span>
                  <Circle id="notpaid" color="#B2B2B2" />
                  <CircleCheck
                    id="paid"
                    className="w-6 h-6 text-white bg-[#03D69D] rounded-full"
                    style={{ display: "none" }}
                  />
                </span>
                <span className="font-semibold text-base">
                  Restante no cartão
                </span>
              </div>
              <div>
                <span className="font-extrabold text-base">
                  {formatToCurrencyBR(half)}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="w-full rounded-lg h-[2px] bg-[#E5E5E5]"></div>
        {totalInstallments > 1 && (
          <>
            <div className="w-full p-1 flex flex-row justify-between items-center">
              <span className="font-semibold text-xs">CET: 0.5%</span>
              <span className="font-semibold text-base">
                Total: {formatToCurrencyBR(totalValue)}
              </span>
            </div>
            <div className="w-full rounded-lg h-[2px] bg-[#E5E5E5]"></div>
          </>
        )}

        <div className="w-full p-1 flex flex-row justify-between items-center">
          <span className="font-extrabold text-base">Como funciona?</span>
          <span className="font-semibold text-base">
            <ChevronUp />
          </span>
        </div>
        <div className="w-full rounded-lg h-[2px] bg-[#E5E5E5]"></div>
        <div className="w-full p-1 flex flex-col justify-between items-center">
          <span className="font-semibold text-sm text-[#B2B2B2]">
            Identificador:{" "}
          </span>
          <span className="font-extrabold text-sm">
            2c1b951f356c4680b13ba1c9fc889c47
          </span>
        </div>
        <Image
          src={payment}
          alt="Payment Illustration"
          width={250}
          height={36}
          className="my-4"
        />
      </div>
    </main>
  );
}
