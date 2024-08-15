export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
       <iframe
            src={'https://iframe.mediadelivery.net/play/288439/d1b2eccc-3621-4d86-ab84-4bd29780b2a4'}
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
    </main>
  );
}
