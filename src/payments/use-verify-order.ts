import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.payments)["verify-payment"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.payments)["verify-payment"]["$post"]
>["json"];

export const useVerifyOrder = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      console.log("In verify order: ", json);
      const response = await client.api.payments["verify-payment"].$post({
        json,
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    },
    onError: (error) => {
      console.log("Something went wrong", error);
    },
    onSuccess: (data) => {
      console.log("Order verified", data);

      //invalidate the query
    },
  });

  return mutation;
};
