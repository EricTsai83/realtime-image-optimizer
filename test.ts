export async function GET(request: Request) {
  try {
    const imagepath = new URL(request.url).pathname
      .split("/")
      .slice(3)
      .join("/");

    // Get URL parameters
    const searchParams = request.searchParams;
    const width = searchParams.get("w");
    const height = searchParams.get("h");
    const format = searchParams.get("format");
    const quality = searchParams.get("q");

    // Build IPX operation options
    const operations: Record<string, string> = {};

    if (width) operations.width = width;
    if (height) operations.height = height;
    if (format) operations.format = format;
    if (quality) operations.quality = quality;

    // Process the image
    const processedimage = await ipx(imagepath, operations).process();
    const data = processedimage.data;
    console.log(data);
    // Return the optimized image
    return new NextResponse(data, {
      headers: {
        "Content-Type":
          data === "jpeg" ? "image/jpeg" : `image/${processedimage.format}`,
        // Cache-Control: stale-while-revalidate strategy
        "Cache-Control": "public, max-age=60, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Image processing error:", error);
    return NextResponse.json(
      { error: "Image processing failed" },
      { status: 500 },
    );
  }
}
