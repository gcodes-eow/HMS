import { Button } from "@/components/ui/Button";
import { getRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  const role = await getRole();

  if (userId && role) {
    switch (role) {
      case "admin":
        return redirect("/admin");
      case "doctor":
        return redirect("/doctor");
      case "nurse":
        return redirect("/nurse");
      case "patient":
        return redirect("/patient");
      case "cashier":
        return redirect("/cashier");
      case "pharmacist":
        return redirect("/pharmacist");
      case "receptionist":
        return redirect("/receptionist");
      case "laboratory":
        return redirect("/laboratory");
      default:
        return redirect("/sign-in");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Welcome to <br />
            <span className="text-blue-700 text-5xl md:text-6xl">ClinicX</span>
          </h1>
        </div>

        <div className="text-center max-w-xl flex flex-col items-center justify-center">
          <p className="mb-8">
            Please login to your account or register to get your click account. With your
            account, you can benefit from our services and book an appointment with our
            healthcare professional.
          </p>

          <div className="flex gap-4">
            {userId ? (
              <Link href={`/${role}`}>
                <Button>View Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button className="md:text-base font-light">Get Account</Button>
                </Link>

                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="md:text-base no-underline bg-white rounded border border-black transition-colors duration-300 hover:bg-black hover:text-white"
                  >
                    Login to Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <footer className="mt-8">
        <p className="text-center text-sm">
          &copy; 2024 ClinicX Hospital Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
