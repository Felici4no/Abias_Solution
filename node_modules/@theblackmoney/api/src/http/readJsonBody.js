const ONE_MEGABYTE = 1024 * 1024;

export async function readJsonBody(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;

    if (size > ONE_MEGABYTE) {
      throw new Error("Request body is too large");
    }

    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");

  if (!rawBody.trim()) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return {
      _invalidJson: true
    };
  }
}
