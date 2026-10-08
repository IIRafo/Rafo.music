import { SITE } from "@/data/site";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">© {new Date().getFullYear()} <span className="artist">{SITE.artistName}</span>. Os direitos concedidos dependem da licença adquirida e dos termos do contrato.</div>
    </footer>
  );
}
