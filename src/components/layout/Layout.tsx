import { Navbar } from "../navbar/Navbar";

interface Layout {
  children: JSX.Element
}
export default function Layout({ children }: Layout) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
