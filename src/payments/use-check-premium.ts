import { client } from "@/lib/hono";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.payments)["check-is-premium"]["$get"]
>;
type RequestType = InferRequestType<
  (typeof client.api.payments)["check-is-premium"]["$get"]
>;

export const useCheckPremium = () => {
  const query = useQuery<ResponseType, Error, RequestType>({
    queryKey: ["isPremium"],
    queryFn: async (json) => {
      const response = await client.api.payments["check-is-premium"].$get(json);
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    },
  });

  return query;
};
