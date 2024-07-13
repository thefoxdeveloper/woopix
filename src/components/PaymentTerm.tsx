export default function PaymentTerm() {
  // Obter a data e hora atual
  const agora = new Date();

  // Adicionar 15 minutos
  agora.setMinutes(agora.getMinutes() + 15);

  // Formatar a data e hora no formato desejado (opcional)
  const dia = agora.getDate().toString().padStart(2, "0");
  const mes = (agora.getMonth() + 1).toString().padStart(2, "0"); // Janeiro é 0!
  const ano = agora.getFullYear();
  const horas = agora.getHours().toString().padStart(2, "0");
  const minutos = agora.getMinutes().toString().padStart(2, "0");
  const segundos = agora.getSeconds().toString().padStart(2, "0");

  const dataHoraFutura = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;

  // Exibe a data e hora com 15 minutos à frente

  return dataHoraFutura;
}
