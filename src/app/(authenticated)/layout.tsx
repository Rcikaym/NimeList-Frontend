import AuthNavbar from "../../components/AuthNavbar";
import Footer from "../../components/Footer";
// import "/../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthNavbar />
      <main className="bg-black overflow-y-auto">{children}</main>
      <Footer />
    </>
  );
}
