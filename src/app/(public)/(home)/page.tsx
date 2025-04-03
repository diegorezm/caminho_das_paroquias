import Button from "@/components/ui/Button";
import { CardBody, CardRoot, CardTitle } from "@/components/ui/Card";
import styles from "./index.module.css";

export default async function Home() {
  const variants = ["primary", "secondary", "outline", "ghost"] as const;
  return (
    <div className={styles.list}>
      <h1>Variants</h1>
      {variants.map((e, i) => (
        <div key={i}>
          <Button variant={e}>{e}</Button>
          <br />
        </div>
      ))}
      <h1>Cards</h1>

      <CardRoot variant="outline">
        <CardTitle title="Lorem ipsum" description="lorem ispum?" />
        <CardBody>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. A magni
            enim adipisci facilis nulla perferendis fuga obcaecati reiciendis
            maiores totam similique illo nisi, culpa eaque? Illo autem totam
            eveniet numquam?
          </p>
        </CardBody>
      </CardRoot>
    </div>
  );
}
