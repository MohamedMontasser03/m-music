import { NextApiRequest, NextApiResponse } from "next";

export default function audioProxy(req: NextApiRequest, res: NextApiResponse) {
  const url = Object.entries(req.query).reduce(
    (acc, [key, value]) =>
      key === "url" ? (value as string) : `${acc}&${key}=${value}`,
    ""
  );

  if (typeof url !== "string") {
    res.status(400).send("Bad Request");
    return;
  }
  const reqHeaders = req.headers;

  fetch(url, {
    headers: Object.fromEntries(
      Object.entries(reqHeaders).filter(([key]) => key !== "host")
    ) as HeadersInit,
  })
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (contentType) {
        res.setHeader("content-type", contentType);
      }
      res.status(response.status);

      const headers = response.headers.entries();
      for (const [key, value] of headers) {
        res.setHeader(key, value);
      }

      response.body?.pipe(res);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
}
