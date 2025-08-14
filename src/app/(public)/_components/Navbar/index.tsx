import styles from "./navbar.module.css";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Image from "next/image";

import { type UserSafe } from "@/server/db/schema";
import UserMenu from "@/components/UserMenu";

type Props = {
	user?: UserSafe;
	className?: string;
};

export default function Navbar({ user, className }: Props) {
	return (
		<div className={`${styles.navbar} ${className}`}>
			<div>
				<Link href="/">
					<Image src="/logo.png" height={100} width={100} alt="App logo" />
				</Link>
			</div>

			<div className={styles.auth_links}>
				{user ? (
					<UserMenu userName={user.name || user.email || "Usuário"} />
				) : (
					<Link href="/procurar">
						<Button size="sm" variant="primary">
							Procurar
						</Button>
					</Link>
				)}
			</div>
		</div>
	);
}
