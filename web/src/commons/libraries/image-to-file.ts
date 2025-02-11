import { v4 as uuidv4 } from "uuid";

// base64로 저장된 images(store)를 파일 형식으로 다시 원상복귀하는 로직
export const imageToFile = (imageurl: string) => {
  const [meta, base64] = imageurl.split(",");
  const mime = meta.match(/:(.*?);/)?.[1];
  const fileExtension = mime?.split("/")[1];

  // Base64를 디코딩하여 Uint8Array 생성
  const binary = atob(base64);
  const u8arr = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  // Blob 생성
  const blob = new Blob([u8arr], { type: mime });

  // File 객체 생성
  const newFile = new File([blob], `${uuidv4()}.${fileExtension}`, {
    type: mime,
  });

  return newFile;
};
