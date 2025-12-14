"use client";

import React, { useState } from "react";

export default function CheckoutPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"cart" | "payment" | "confirmation">("cart");

  const products = [
    {
      id: 1,
      name: "Premium Plan",
      price: 99.99,
      description: "Annual subscription",
    },
    {
      id: 2,
      name: "Standard Plan",
      price: 49.99,
      description: "Monthly subscription",
    },
  ];

  const cartItems = [products[0]];
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep("confirmation");
  };

  const handleReset = () => {
    setSelectedPaymentMethod(null);
    setStep("cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lado Izquierdo - Resumen de Orden */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            {/* Logo/Header */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">Y</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">CheckOut</h1>
              </div>
              <p className="text-slate-500 text-sm">Pago seguro y rápido</p>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Resumen del Pedido
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Impuestos (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-900">
                    Total
                  </span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-4 font-medium">
                  PROTEGIDO POR
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9l3.293 3.293a1 1 0 01-1.414 1.414l-4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs text-slate-600">PCI DSS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9l3.293 3.293a1 1 0 01-1.414 1.414l-4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs text-slate-600">SSL Seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho - Formulario de Pago */}
        <div className="lg:col-span-1">
          {step === "cart" && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 h-full flex flex-col">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Elige tu método de pago
                </h2>
                <p className="text-slate-600">
                  Selecciona una opción segura para continuar
                </p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4 flex-1">
                {/* Apple Pay */}
                <button
                  onClick={() => {
                    setSelectedPaymentMethod("apple-pay");
                    setStep("payment");
                  }}
                  className="w-full relative group"
                >
                  <div
                    className={`
                    relative px-6 py-5 rounded-xl border-2 transition-all duration-300
                    ${
                      selectedPaymentMethod === "apple-pay"
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                    }
                  `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.05 13.5c-.91 0-1.64.5-1.64 1.23v1.54c0 .73.73 1.23 1.64 1.23.9 0 1.64-.5 1.64-1.23v-1.54c0-.73-.74-1.23-1.64-1.23zm-5.93 0c-.92 0-1.64.5-1.64 1.23v1.54c0 .73.72 1.23 1.64 1.23.91 0 1.64-.5 1.64-1.23v-1.54c0-.73-.73-1.23-1.64-1.23zM9 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm8 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-slate-900">
                            Apple Pay
                          </p>
                          <p className="text-sm text-slate-500">
                            Pago rápido y seguro
                          </p>
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-slate-400 group-hover:text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* PayPal */}
                <button
                  onClick={() => {
                    setSelectedPaymentMethod("paypal");
                    setStep("payment");
                  }}
                  className="w-full relative group"
                >
                  <div
                    className={`
                    relative px-6 py-5 rounded-xl border-2 transition-all duration-300
                    ${
                      selectedPaymentMethod === "paypal"
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                    }
                  `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M9.4 7c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6S7.8 9.5 7.8 8.6 8.5 7 9.4 7zm0 6.4c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6S7.8 15.9 7.8 15s.7-1.6 1.6-1.6zm6.4-6.4c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6.7-1.6 1.6-1.6zm0 6.4c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6.7-1.6 1.6-1.6z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-slate-900">PayPal</p>
                          <p className="text-sm text-slate-500">
                            Cuenta PayPal o tarjeta
                          </p>
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-slate-400 group-hover:text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Tarjeta de Crédito */}
                <button
                  onClick={() => {
                    setSelectedPaymentMethod("card");
                    setStep("payment");
                  }}
                  className="w-full relative group"
                >
                  <div
                    className={`
                    relative px-6 py-5 rounded-xl border-2 transition-all duration-300
                    ${
                      selectedPaymentMethod === "card"
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                    }
                  `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M3 6h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2z"
                              opacity="0.3"
                            />
                            <path
                              d="M3 12h18"
                              stroke="white"
                              strokeWidth="1.5"
                              fill="none"
                            />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-slate-900">
                            Tarjeta de Crédito
                          </p>
                          <p className="text-sm text-slate-500">
                            Visa, Mastercard, Amex
                          </p>
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-slate-400 group-hover:text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>

              {/* Info Footer */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  Tu información está protegida por encriptación SSL 256-bit
                </p>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 h-full flex flex-col">
              <button
                onClick={() => setStep("cart")}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 text-sm font-medium transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Volver
              </button>

              <div className="flex-1">
                {selectedPaymentMethod === "apple-pay" && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-6">
                      Apple Pay
                    </h3>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 text-white mb-6">
                      <p className="text-sm opacity-75 mb-4">
                        Nombre de tarjeta
                      </p>
                      <p className="text-lg font-semibold">Apple Pay</p>
                      <div className="mt-6 flex justify-between items-end">
                        <div className="text-2xl font-bold">●●●●</div>
                        <div className="text-xs opacity-75">Activo</div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-blue-900">
                        🔒 Tu información de pago está protegida. Apple Pay no
                        comparte tus datos de tarjeta con el vendedor.
                      </p>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === "paypal" && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-6">
                      PayPal
                    </h3>
                    <div className="bg-blue-50 rounded-xl p-8 mb-6 text-center">
                      <div className="inline-block w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm6 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm6 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
                        </svg>
                      </div>
                      <p className="text-slate-700 font-medium">
                        Redirigiendo a PayPal...
                      </p>
                      <p className="text-sm text-slate-500 mt-2">
                        Completa tu pago en la siguiente pantalla
                      </p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-900">
                        💡 PayPal es una forma segura de pagar. Tu información
                        bancaria no se compartirá con el vendedor.
                      </p>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === "card" && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-6">
                      Datos de Tarjeta
                    </h3>

                    {/* Card Preview */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-6">
                      <div className="flex justify-between items-start mb-12">
                        <div className="text-2xl font-bold">VISA</div>
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="6" cy="6" r="4" opacity="0.3" />
                          <circle cx="18" cy="6" r="4" opacity="0.5" />
                          <circle cx="18" cy="18" r="4" opacity="0.3" />
                        </svg>
                      </div>
                      <p className="text-lg tracking-widest font-mono">
                        •••• •••• •••• 4242
                      </p>
                      <div className="flex justify-between mt-8 text-xs">
                        <div>
                          <p className="opacity-75">Titular</p>
                          <p className="font-semibold">JOHN DOE</p>
                        </div>
                        <div className="text-right">
                          <p className="opacity-75">Vence</p>
                          <p className="font-semibold">12/26</p>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Número de Tarjeta
                        </label>
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            MM/YY
                          </label>
                          <input
                            type="text"
                            placeholder="12/26"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            CVC
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nombre del Titular
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    isProcessing
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <span>Pagar ${total.toFixed(2)}</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </>
                  )}
                </button>
                <p className="text-xs text-slate-500 text-center mt-4">
                  Al hacer clic en "Pagar", aceptas nuestros términos de
                  servicio
                </p>
              </div>
            </div>
          )}

          {step === "confirmation" && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 h-full flex flex-col items-center justify-center text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  ¡Pago Completado!
                </h2>
                <p className="text-slate-600 mb-6">
                  Tu transacción ha sido procesada exitosamente
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 w-full mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Monto</span>
                    <span className="font-semibold text-slate-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Método</span>
                    <span className="font-semibold text-slate-900 capitalize">
                      {selectedPaymentMethod === "apple-pay" && "Apple Pay"}
                      {selectedPaymentMethod === "paypal" && "PayPal"}
                      {selectedPaymentMethod === "card" && "Tarjeta de Crédito"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">ID de Transacción</span>
                    <span className="font-mono text-sm text-slate-900">
                      TXN-2024-
                      {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Estado</span>
                    <span className="inline-flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">
                        Confirmado
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-4 px-6 rounded-lg font-semibold text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Realizar otro pago
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
