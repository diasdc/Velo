import { useState } from "react";
import { getOrderByNumber } from "@/hooks/useOrders";
import { Order, formatPrice, ExteriorColor, WheelType } from "@/store/configuratorStore";
import { CircleCheckBig, CircleX, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

import logo from "@/assets/brand.svg";
import glacierBlueAero from "@/assets/glacier-blue-aero-wheels.png";
import glacierBlueSport from "@/assets/glacier-blue-sport-wheels.png";
import lunarWhiteAero from "@/assets/lunar-white-aero-wheels.png";
import lunarWhiteSport from "@/assets/lunar-white-sport-wheels.png";
import midnightBlackAero from "@/assets/midnight-black-aero-wheels.png";
import midnightBlackSport from "@/assets/midnight-black-sport-wheels.png";

const exteriorImages: Record<ExteriorColor, Record<WheelType, string>> = {
  "glacier-blue": {
    aero: glacierBlueAero,
    sport: glacierBlueSport,
  },
  "lunar-white": {
    aero: lunarWhiteAero,
    sport: lunarWhiteSport,
  },
  "midnight-black": {
    aero: midnightBlackAero,
    sport: midnightBlackSport,
  },
};

const colorLabels: Record<ExteriorColor, string> = {
  "glacier-blue": "Glacier Blue",
  "lunar-white": "Lunar White",
  "midnight-black": "Midnight Black",
};

const wheelLabels: Record<WheelType, string> = {
  aero: "aero Wheels",
  sport: "sport Wheels",
};

const OrderLookup = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setOrder(null);

    const { order: foundOrder, error: fetchError } = await getOrderByNumber(
      orderNumber
    );

    setIsLoading(false);

    if (fetchError) {
      setError(fetchError);
      return;
    }

    if (!foundOrder) {
      setError("not_found");
      return;
    }

    setOrder(foundOrder);
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "APROVADO":
        return (
          <CircleCheckBig className="w-5 h-5 lucide-circle-check-big" />
        );
      case "REPROVADO":
        return <CircleX className="w-5 h-5 lucide-circle-x" />;
      case "EM_ANALISE":
        return <Clock className="w-5 h-5 lucide-clock" />;
    }
  };

  const getStatusBadgeClasses = (status: Order["status"]) => {
    switch (status) {
      case "APROVADO":
        return "bg-green-100 text-green-700";
      case "REPROVADO":
        return "bg-red-100 text-red-700";
      case "EM_ANALISE":
        return "bg-amber-100 text-amber-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const getPaymentMethodLabel = (method: "avista" | "financiamento") => {
    return method === "avista" ? "À Vista" : "Financiamento";
  };

  return (
    <main className="container mx-auto max-w-3xl py-10 px-4">
      <header className="mb-8">
        <img src={logo} alt="Velô" className="h-8 mb-4" />
        <h1 className="text-3xl font-semibold">Consultar Pedido</h1>
        <p className="text-muted-foreground mt-2">
          Informe o número do seu pedido para consultar os detalhes.
        </p>
      </header>

      <section aria-label="Consulta de pedido">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="order-number" className="font-medium">
              Número do Pedido
            </label>
            <input
              id="order-number"
              name="order-number"
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="border rounded-md px-3 py-2"
              role="textbox"
              aria-label="Número do Pedido"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            role="button"
            aria-label="Buscar Pedido"
          >
            {isLoading ? "Buscando..." : "Buscar Pedido"}
          </button>
        </form>
      </section>

      {isLoading && (
        <div className="mt-8 text-center text-muted-foreground">
          Buscando pedido...
        </div>
      )}

      {error === "not_found" && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-2">Pedido não encontrado</h3>
          <p>Verifique o número do pedido e tente novamente</p>
        </div>
      )}

      {error && error !== "not_found" && (
        <div className="mt-8 text-destructive">
          <p>Erro ao buscar pedido: {error}</p>
        </div>
      )}

      {order && (
        <div
          className="mt-8 bg-card rounded-lg shadow-lg p-6"
          data-testid={`order-result-${order.id}`}
        >
          <img
            src={
              exteriorImages[order.configuration.exteriorColor][
                order.configuration.wheelType
              ]
            }
            alt="Velô Sprint"
            className="w-32 h-20 object-cover rounded-lg mb-4"
          />
          <p>Pedido</p>
          <p>{order.id}</p>
          <div
            role="status"
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium my-4",
              getStatusBadgeClasses(order.status)
            )}
          >
            {getStatusIcon(order.status)}
            <span>{order.status}</span>
          </div>

          <img
            src={
              exteriorImages[order.configuration.exteriorColor][
                order.configuration.wheelType
              ]
            }
            alt="Velô Sprint"
            className="w-full h-auto rounded-lg mb-4"
          />
          <p>Modelo</p>
          <p>Velô Sprint</p>
          <p>Cor</p>
          <p>{colorLabels[order.configuration.exteriorColor]}</p>
          <p>Interior</p>
          <p>cream</p>
          <p>Rodas</p>
          <p>{wheelLabels[order.configuration.wheelType]}</p>

          <h4 className="text-lg font-semibold mt-6 mb-4">Dados do Cliente</h4>
          <p>Nome</p>
          <p>
            {order.customer.name} {order.customer.surname}
          </p>
          <p>Email</p>
          <p>{order.customer.email}</p>
          <p>Loja de Retirada</p>
          <p>{order.customer.store || ""}</p>
          <p>Data do Pedido</p>
          <p>{formatDate(order.createdAt)}</p>

          <h4 className="text-lg font-semibold mt-6 mb-4">Pagamento</h4>
          <p>{getPaymentMethodLabel(order.paymentMethod)}</p>
          <p>{formatPrice(order.totalPrice)}</p>
        </div>
      )}
    </main>
  );
};

export default OrderLookup;