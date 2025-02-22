import SolplaceMap from "@/components/commons/solplace-map";
import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { usePlaceDetail } from "@/commons/hooks/use-place-detail";
import { webviewlog } from "@/commons/libraries/webview-log";

export default function PlaceInfo() {
  const { data } = usePlaceDetail();
  const lat = data?.fetchSolplaceLog?.lat;
  const lng = data?.fetchSolplaceLog?.lng;
  const center = { lat, lng };
  webviewlog(data);
  const { solplaceLogId } = useParams();
  // 지도 보기 상태
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  // 지도 토글
  const toggleLocation = () => {
    setIsLocationOpen((prev) => !prev);
  };

  return (
    <div className={styles.detailInfo}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>{data?.fetchSolplaceLog.title}</div>
        <Link href={`/solplace-logs/${solplaceLogId}/edit`}>
          <Image
            className={styles.icon24}
            src="/assets/edit.svg"
            width={0}
            height={0}
            sizes="100vw"
            alt="add"
          />
        </Link>
      </div>

      <div className={styles.locationArea}>
        <div className={styles.location}>
          <div className={styles.address}>
            <Image
              className={styles.icon16}
              src="/assets/location_icon.svg"
              width={0}
              height={0}
              sizes="100vw"
              alt="location"
            />
            <div className={styles.addressTitle}>
              {data?.fetchSolplaceLog.address}
            </div>
          </div>

          <div className={styles.dropdown} onClick={toggleLocation}>
            <div>지도 {isLocationOpen ? "접기" : "보기"}</div>
            <Image
              className={styles.icon24}
              src={
                isLocationOpen
                  ? "/assets/up_arrow.svg"
                  : "/assets/down_arrow.svg"
              }
              width={0}
              height={0}
              sizes="100vw"
              alt="downArrow"
            />
          </div>
        </div>
        {isLocationOpen && <SolplaceMap center={center} />}
      </div>
    </div>
  );
}
