"use client";

import { useCheckPremium } from "@/src/payments/use-check-premium";
import { PaymentButton } from "./payment";
import { useSignedUrl } from "@/src/video/use-signed-url";

export const VideoPlayer = () => {
  const { data: isPremium, isPending, isError, error } = useCheckPremium();

  const {
    data: signedUrl,
    isPending: isSignedUrlPending,
    error: signedUrlError,
  } = useSignedUrl(
    "https://iframe.mediadelivery.net/embed/288439/d1b2eccc-3621-4d86-ab84-4bd29780b2a4"
  );

  if (isPending || isSignedUrlPending) {
    return <div>Loading...</div>;
  }

  if (isError || signedUrlError) {
    return <div>Error: {error?.message}</div>;
  }

  if (!isPremium) {
    return (
      <div>
        <p>Upgrade to premium to watch this video</p>
        <PaymentButton />
      </div>
    );
  }

  console.log("signedUrl", signedUrl);

  return (
    <iframe
      src={(signedUrl?.data as string) ?? ""}
      loading="lazy"
      style={{
        border: 0,
        position: "absolute",
        top: 0,
        height: "100%",
        width: "100%",
      }}
      allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
      allowFullScreen={true}
    ></iframe>
  );
};
