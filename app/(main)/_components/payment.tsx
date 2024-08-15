import { Button } from "@/components/ui/button";
import { loadScript } from "@/lib/load-script";
import { useCreateOrder } from "@/src/payments/use-create-order";
import { useVerifyOrder } from "@/src/payments/use-verify-order";
import React, { useEffect } from "react";

export const PaymentButton = () => {
  const createOrderMutation = useCreateOrder();
  const verifyOrderMutation = useVerifyOrder();

  const verifyPayment = async (orderData: any) => {
    console.log("In verify payment: ", orderData);
    verifyOrderMutation.mutate(
      {
        raz_signature: `${(orderData as any).razorpay_signature}`,
        raz_payment_id: `${(orderData as any).razorpay_payment_id}`,
        raz_oid: `${(orderData as any).razorpay_order_id}`,
      },
      {
        onSuccess: (data) => {
          alert("Payment successful");
          console.log(data);
        },
        onError: (error) => {
          alert("Payment failed");
          console.log(error);
        },
      }
    );
  };
  const onPayment = async () => {
    let orderData;
    await createOrderMutation.mutate(
      {
        planId: "plan_H9t8zXQ4jvH9p5",
      },
      {
        onSuccess: async (data) => {
          console.log("Here is createOrder data: ", data);
          const paymentObject = new (window as any).Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            order_id: (data as any).data?.id,
            ...(data as any).data,
            handler: async function (response: any) {
              console.log("Here is the response",response);

              orderData = response;
              await verifyPayment(orderData);
            },
          });

          await paymentObject.open();
        },
      }
    );
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);
  return (
    <div className="flex w-full justify-center pt-3">
      <Button onClick={onPayment} variant={"secondary"}>
        Upgrade to premium
      </Button>
    </div>
  );
};
