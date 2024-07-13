"use client";

import { createStaticPix, hasError } from "pix-utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUp, ChevronUp, Circle, Copy } from "lucide-react";
import PaymentTerm from "@/components/PaymentTerm";
import Link from "next/link";

export default function PaymentMethod() {
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
  const name = "Joao";
  const city = "Nova Petropolis";
  const key = "03115850000";

  const pix = createStaticPix({
    merchantName: name,
    merchantCity: city,
    pixKey: key,
    transactionAmount: half,
    infoAdicional: "2c1b951f356c4680b13ba1c9fc889c47",
  });

  const brCode = pix.toBRCode();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(brCode).then(() => {
      setCopySuccess("Code copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 bg-white">
      <Image src="/logo.svg" alt="Woovi Logo" width={123} height={36} />
      {totalInstallments > 0 ? (
        <span className="flex flex-row flex-wrap items-center justify-center gap-1 text-2xl font-extrabold text-[#4D4D4D] text-center [text-shadow:_0_4px_4px_rgb(0_0_0_/_40%)] font-nunito">
          João, pague a entrada de
          <span>{formatToCurrencyBR(half)}</span> pelo Pix )
        </span>
      ) : (
        <span className="flex flex-row flex-wrap items-center justify-center gap-1 text-2xl font-extrabold text-[#4D4D4D] text-center [text-shadow:_0_4px_4px_rgb(0_0_0_/_40%)] font-nunito">
          João, pague o valor de
          <span>{formatToCurrencyBR(totalValue)}</span> pelo Pix
        </span>
      )}
      <div className="rounded-lg border-2 border-[#03d69d] p-1">
        <img
          alt="QR Code"
          src={`https://gerarqrcodepix.com.br/api/v1?nome=${name}&cidade=${city}&saida=qr&chave=${key}&valor=${half}`}
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        {copySuccess && <span className="text-green-600">{copySuccess}</span>}
        <button
          onClick={copyToClipboard}
          className="mt-4 p-2 bg-[#133A6F] text-white rounded-lg w-fit flex flex-row text-lg"
        >
          Clique para copiar QR CODE <Copy className="ml-2" />
        </button>
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
                <Circle color="#03d69d" />
              </span>
              <span className="font-semibold text-base">1ª entrada no Pix</span>
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
              <span className="font-semibold text-base">Pagar tudo no pix</span>
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
                <Circle color="#B2B2B2" />
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
          {" "}
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
      {totalInstallments > 1 ? (
        <Link href={`/payment-form`}>
          <button
            className="cursor-pointer transition-all bg-[#03d69d] text-white px-6 py-2 rounded-lg
     border-[#17a17d]
      border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
      active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
          >
            Seguir para o cartão
          </button>
        </Link>
      ) : (
        ""
      )}

      <div className="w-full p-1 flex flex-col justify-between items-center">
        <span className="font-semibold text-sm text-[#B2B2B2]">
          Identificador:{" "}
        </span>
        <span className="font-extrabold text-sm">
          2c1b951f356c4680b13ba1c9fc889c47
        </span>
      </div>
      <Image
        src="/payment.svg"
        alt="Payment Illustration"
        width={250}
        height={36}
        className="my-4"
      />
    </main>
  );
}
