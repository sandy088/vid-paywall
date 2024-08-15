import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.video)["get-signed-url"]["$get"]
>;
type RequestType = InferRequestType<
  (typeof client.api.video)["get-signed-url"]["$get"]
>["query"];

export const useSignedUrl = (iFrameUrl:string) => {
  const query = useQuery<ResponseType, Error, RequestType>({
    queryKey: ["signedUrl"],
    queryFn: async () => {
      const response = await client.api.video["get-signed-url"].$get({
        query:{
            iFrameUrl:iFrameUrl
        }
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    },
  });

  return query;
};
