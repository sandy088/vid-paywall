import crypto from "crypto";
function generateToken(videoId: string, expires: number, securityKey: string) {
  const data = securityKey + videoId + expires.toString();

  const hash = crypto.createHash("sha256");
  hash.update(data);

  return hash.digest("hex");
}
export function signStreamUrl(iframeUrl: string, securityKey: string) {
  const expiration = 36;

  const parsedUrl = new URL(iframeUrl);
  const pathSegments = parsedUrl.pathname.split("/");
  const videoId = pathSegments[3];

  //@ts-ignore
  const expires = Math.floor(new Date() / 1000) + expiration;

  const token = generateToken(videoId, expires, securityKey);
  parsedUrl.searchParams.set("token", token);
  parsedUrl.searchParams.set("expires", expires.toString());

  return parsedUrl.toString();
}
