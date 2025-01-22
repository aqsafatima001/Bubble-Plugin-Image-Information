function(instance, properties, context) {
    instance.publishState("loading", "yes");
    instance.publishState("error", ""); // Clear any previous error state
	instance.publishState("image_height",);
	instance.publishState("image_width",);
	instance.publishState("image_size",);
    const fileUrl = properties.image;

    if (fileUrl) {
        // Ensure the URL is prefixed with 'https:' if missing
        const fullUrl = fileUrl.startsWith("https:") ? fileUrl : "https:" + fileUrl;
        // Use a proxy to bypass CORS restrictions
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(fullUrl)}`;

        fetch(proxyUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch the file via proxy: ${response.statusText}`);
                }
                return response.blob();
            })
            .then(blob => {
                // Check if the fetched file is an image
                if (!blob.type.startsWith("image/")) {
                    instance.publishState("error", "The provided URL does not link to an image.");
                    instance.publishState("loading", "no");
                    return;
                }

                // Process the Blob
                instance.data.processImage(blob);
            })
            .catch(error => {
                instance.publishState("error", "Error fetching and processing the file.");
                instance.publishState("loading", "no");
            });
    } else {
        instance.publishState("loading", "no");
    }
}
