function(instance, context) {
    instance.data.processImage = function(fileBlob) {
        instance.publishState("loading", "yes");
        instance.publishState("error", ""); // Clear any previous error state

        if (fileBlob) {
            // Check if the file is an image based on MIME type
            if (!fileBlob.type.startsWith("image/")) {
                instance.publishState("error", "The uploaded file is not an image.");
                instance.publishState("loading", "no");
                return;
            }

            const img = new Image();
            img.onload = function() {
                instance.publishState("image_height", img.height);
                instance.publishState("image_width", img.width);
                instance.publishState("image_size", (fileBlob.size /(1024 * 1024)).toFixed(2));
                instance.publishState("loading", "no");
            };

            const reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
            };

            reader.readAsDataURL(fileBlob);
        } else {
            instance.publishState("loading", "no");
        }
    };
}
