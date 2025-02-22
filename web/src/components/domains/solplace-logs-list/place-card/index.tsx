import Image from "next/image";
import styles from "./styles.module.css";
import Link from "next/link";

export default function PlaceCard({ data }) {
  const imageUrl = data?.images?.length
    ? `https://storage.googleapis.com/${data.images[0]}`
    : "/images/triptrip.png";
  return (
    <Link className={styles.card} href={`/solplace-logs/${data.id}`}>
      <Image
        src={imageUrl}
        width={0}
        height={0}
        sizes="100vw"
        className={styles.image}
        alt="cardImage"
      />
      <div className={styles.contents}>
        <div className={styles.info}>
          <div className={styles.title}>{data.title}</div>
          <div className={styles.description}>{data.contents}</div>
        </div>
        <div className={styles.address}>
          <Image
            className={styles.icon16}
            src="/assets/location_icon.svg"
            width={0}
            height={0}
            sizes="100vw"
            alt="location_icon"
          />
          <div className={styles.addressTitle}>{data.address}</div>
        </div>
      </div>
    </Link>
  );
}
