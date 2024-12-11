export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject("Failed to convert image to base64");
      }
    };

    reader.onerror = (error) => {
      reject(`Error reading the file: ${error}`);
    };

    reader.readAsDataURL(file);
  });
};
