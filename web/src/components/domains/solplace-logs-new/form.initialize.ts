"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeviceSetting } from "@/commons/settings/device-setting/hook";
import { UseFormReturn } from "react-hook-form";
import { ISchema } from "./form.schema";
import { useImageStore } from "@/commons/stores/image-store";
import { gql, useMutation } from "@apollo/client";
import { webviewlog } from "@/commons/libraries/webview-log";
import { UPLOAD_FILE } from "@/commons/apis/mutations/upload.file";
import { imageToFile } from "@/commons/libraries/image-to-file";

const CREATE_SOLPLACE_LOG = gql`
  mutation createSolplaceLog($createSolplaceLogInput: CreateSolplaceLogInput!) {
    createSolplaceLog(createSolplaceLogInput: $createSolplaceLogInput) {
      id
      title
      contents
      address
      images
    }
  }
`;

export const useInitialize = (methods: UseFormReturn<ISchema>) => {
  const [createSolplaceLog] = useMutation(CREATE_SOLPLACE_LOG, {
    update: (cache, { data }) => {
      if (!data?.createSolplaceLog) return;

      cache.modify({
        fields: {
          fetchSolplaceLogs(existingLogs = []) {
            return [data.createSolplaceLog, ...existingLogs]; // 새로운 로그 추가
          },
        },
      });
    },
  });

  const [uploadFile] = useMutation(UPLOAD_FILE);
  const router = useRouter();
  // 쿼리스트링에서 뽑기
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const contents = searchParams.get("contents");
  const address = searchParams.get("address");

  const images = useImageStore((state) => state.images);
  const clearImages = useImageStore((state) => state.clearImages);

  const { fetchApp } = useDeviceSetting();

  // 등록하기 버튼 클릭 시
  const onSubmit = async (data: ISchema) => {
    const imageDecoded = images.map((el) => {
      return imageToFile(el);
    });

    const imageResult = await Promise.all(
      imageDecoded.map(
        async (el) => await uploadFile({ variables: { file: el } })
      )
    );

    const imageResultUrls = imageResult.map(
      (el) => el.data?.uploadFile.url ?? ""
    );
    const { title, contents, address } = data;
    webviewlog(data);
    try {
      const result = await createSolplaceLog({
        variables: {
          createSolplaceLogInput: {
            title,
            contents,
            address,
            images: imageResultUrls,
          },
        },
      });
      webviewlog(result);
      console.log(result);
      fetchApp({ query: "requestDeviceNotificationsForPermissionSet" });
      fetchApp({
        query: "createDeviceNotificationsForSubmitSet",
        variables: {
          page: `/solplace-logs/${result?.data.createSolplaceLog.id}`,
        },
      });
    } catch (error) {
      webviewlog(error);
    }
    clearImages();
    router.push("/solplace-logs");
  };

  useEffect(() => {
    if (title) methods.setValue("title", title);
    if (images) methods.setValue("images", images);
    if (contents) methods.setValue("contents", contents);
    if (address) methods.setValue("address", address);
  }, [searchParams]);

  return {
    onSubmit,
  };
};
