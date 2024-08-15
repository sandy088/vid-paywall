import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.payments)["create-order"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.payments)["create-order"]["$post"]
>["json"];

export const useCreateOrder = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.payments["create-order"].$post({ json });
      console.log("response", response);
      if (!response.ok) {
        throw new Error("Failed to create order ");
      }

      return response.json();
    },
    onError: (error) => {
      console.log("Something went wrong", error);
    },
    onSuccess: (data) => {
      console.log("Order created", data);
    },
  });

  return mutation;
};
