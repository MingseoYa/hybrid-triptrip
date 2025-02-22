"use client";

import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./pagination.css";
import { useDeviceSetting } from "@/commons/settings/device-setting/hook";
import { useParams } from "next/navigation";
import { useLoading } from "@/commons/stores/loading-store";
import { webviewlog } from "@/commons/libraries/webview-log";
import { usePlaceDetail } from "@/commons/hooks/use-place-detail";

export default function SolplaceLogsDetailImageSlider() {
  const { solplaceLogId } = useParams();
  const isLoading = useLoading((state) => state.isLoading);
  const setIsLoading = useLoading((state) => state.setIsLoading);
  const { data } = usePlaceDetail();
  const images = data?.fetchSolplaceLog?.images;

  const { fetchApp } = useDeviceSetting();

  const onClickFullScreen = () => {
    setIsLoading(true);

    window.setTimeout(() => {
      fetchApp({ query: "toggleDeviceLayoutForNotchTranslucentSet" });
      fetchApp({
        query: "setDeviceLayoutForNotchContentSet",
        variables: { notchContent: "dark" },
      });
      window.setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }, 100);
  };

  webviewlog(isLoading);

  if (isLoading) return <></>;

  const slideImages = images?.length
    ? images.map((image) => `https://storage.googleapis.com/${image}`)
    : ["/images/triptrip.png"];

  return (
    <div className={styles.container}>
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true, type: "fraction" }}
        slidesPerView={1}
      >
        {slideImages.map((src, index) => (
          <SwiperSlide key={index}>
            <Link
              href={`/solplace-logs/${solplaceLogId}/${index}`}
              scroll={false}
            >
              <Image
                onClick={onClickFullScreen}
                src={src}
                alt={`Slide ${index + 1}`}
                width={0}
                height={0}
                sizes="100vw"
                className={styles.image}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
